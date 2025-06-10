import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { callLlamaAPI } from './llamaAPI';
import toast from 'react-hot-toast';

// Define the type for explanations
export type AIExplanation = {
  definition?: string;
  formula?: string;
  formulaDescription?: string;
  relatedConcepts?: string[];
  examples?: string[];
  references?: { title: string; url: string }[];
  imageUrl?: string;
  videoUrl?: string;
};

type AIAssistantContextType = {
  selectedText: string;
  showSidePanel: boolean;
  isLoading: boolean;
  explanation: AIExplanation | null;
  toggleSidePanel: () => void;
  closeSidePanel: () => void;
  searchRelatedConcept: (concept: string) => void;
};

const AIAssistantContext = createContext<AIAssistantContextType>({
  selectedText: '',
  showSidePanel: false,
  isLoading: false,
  explanation: null,
  toggleSidePanel: () => {},
  closeSidePanel: () => {},
  searchRelatedConcept: () => {},
});

export const useAIAssistant = () => useContext(AIAssistantContext);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedText, setSelectedText] = useState('');
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [interactionHistory, setInteractionHistory] = useState<{
    query: string;
    timestamp: number;
  }[]>([]);

  // Enhanced text selection handler with better detection
  useEffect(() => {
    // Track if mouse is down - helps prevent accidental text deselection
    let isMouseDown = false;
    
    const handleMouseDown = () => {
      isMouseDown = true;
    };
    
    const handleMouseUp = () => {
      isMouseDown = false;
      
      // Wait a tiny bit for selection to complete
      setTimeout(handleTextSelection, 10);
    };
    
    const handleTextSelection = () => {
      try {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || '';
        
        if (selectedText.length > 2) { // Only trigger for meaningful selections (more than 2 chars)
          console.log("Text selected:", selectedText);
          setSelectedText(selectedText);
          
          // Get the position of the selection
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Ensure the position is valid before setting
            if (rect.top && rect.left) {
              // Position button to the left of the selection
              setSelectionPosition({
                top: rect.top - 40,
                left: rect.left - 60 // Position to the left of selection
              });
              console.log("Selection position set:", { top: rect.top - 40, left: rect.left - 60 });
            }
          }
        } else if (!isMouseDown && selectedText.length === 0) {
          // Clear selection only when text is actually deselected
          // and the mouse is not pressed (prevents clearing during selection process)
          setTimeout(() => {
            const currentSelection = window.getSelection();
            if ((currentSelection?.toString() || '').trim().length === 0) {
              setSelectedText('');
              setSelectionPosition(null);
            }
          }, 300); // Small delay to prevent flickering
        }
      } catch (error) {
        console.error("Error handling text selection:", error);
      }
    };

    // Use events for better selection detection
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleTextSelection);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleTextSelection);
    };
  }, []);

  // Update interaction history when user selects text
  useEffect(() => {
    if (selectedText) {
      setInteractionHistory(prev => [
        ...prev,
        { query: selectedText, timestamp: Date.now() }
      ].slice(-10)); // Keep last 10 interactions
    }
  }, [selectedText]);

  // Toggle side panel visibility
  const toggleSidePanel = async () => {
    try {
      console.log("Toggle side panel called, current state:", { showSidePanel, selectedText });
      
      if (!showSidePanel && selectedText) {
        setShowSidePanel(true);
        await fetchExplanation(selectedText);
      } else {
        setShowSidePanel(!showSidePanel);
      }
    } catch (error) {
      console.error("Error toggling side panel:", error);
      toast.error("Failed to open AI assistant panel");
    }
  };

  // Close side panel
  const closeSidePanel = () => {
    setShowSidePanel(false);
  };

  // Search for a related concept
  const searchRelatedConcept = async (concept: string) => {
    try {
      console.log("Searching for related concept:", concept);
      setSelectedText(concept);
      setIsLoading(true);
      setShowSidePanel(true); // Ensure panel is visible
      await fetchExplanation(concept);
    } catch (error) {
      console.error("Error searching related concept:", error);
      toast.error("Failed to search for related concept");
      setIsLoading(false);
    }
  };

  // Fetch explanation for selected text
  const fetchExplanation = async (text: string) => {
    setIsLoading(true);
    console.log("Fetching explanation for:", text);
    
    try {
      // Call the API to get the explanation (mock or real)
      const result = await callLlamaAPI(text, interactionHistory);
      console.log("API response received:", result);
      
      if (!result) {
        console.warn("Empty response from API");
        throw new Error("Empty response received");
      }
      
      // Add the result to the UI
      setExplanation(result);
      
      // Show success notification
      toast.success("AI assistant ready with explanation", {
        id: "ai-success",
        duration: 2000
      });
      
    } catch (error) {
      console.error("Error fetching explanation:", error);
      toast.error("Something went wrong with the AI service", {
        id: "ai-error",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        selectedText,
        showSidePanel,
        isLoading,
        explanation,
        toggleSidePanel,
        closeSidePanel,
        searchRelatedConcept
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

// Generate fallback responses if API fails
function generateFallbackResponse(text: string, interactionHistory: { query: string; timestamp: number }[]): AIExplanation {
  const searchTerm = text.toLowerCase();
  
  // Viscosity explanations
  if (searchTerm.includes('viscosity')) {
    return {
      definition: "Viscosity is a fundamental property of fluids that measures their resistance to deformation or flow. In civil and mechanical engineering, viscosity is crucial for designing fluid transport systems, analyzing hydraulic machinery performance, and predicting fluid behavior in various applications.",
      formula: "μ = τ / (du/dy)",
      formulaDescription: "Dynamic viscosity (μ) equals shear stress (τ) divided by shear rate (du/dy). SI unit: Pa·s",
      relatedConcepts: ["Reynolds Number", "Laminar Flow", "Turbulent Flow", "Non-Newtonian Fluids"],
      examples: [
        "Water at 20°C has a viscosity of 1.002 mPa·s",
        "Honey has a high viscosity and flows slowly",
        "Motor oils are rated by their viscosity (e.g., 5W-30)",
        "Blood viscosity changes with hematocrit levels"
      ],
      references: [
        { title: "Fluid Mechanics: Fundamentals and Applications", url: "/resources/fluid-mechanics" },
        { title: "Dynamic Viscosity Experiment", url: "/experiments/viscosity" }
      ],
      imageUrl: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    };
  }
  
  // Density explanations
  else if (searchTerm.includes('density') || searchTerm.includes('mass')) {
    return {
      definition: "Density (ρ) is defined as mass per unit volume and is a critical property in civil engineering materials and structural design. It affects structural loads, buoyancy, material selection, and foundation design.",
      formula: "ρ = m/V",
      formulaDescription: "Density (ρ) equals mass (m) divided by volume (V), typically measured in kg/m³",
      relatedConcepts: ["Specific Gravity", "Buoyancy", "Archimedes' Principle", "Unit Weight"],
      examples: [
        "The density of water at 4°C is 1000 kg/m³",
        "Ice has a lower density than water, which is why it floats",
        "In concrete mix design, density affects workability and strength",
        "Soil density influences bearing capacity and settlement calculations"
      ],
      references: [
        { title: "Civil Engineering Materials Handbook", url: "/resources/materials" },
        { title: "Mass Density Analysis Experiment", url: "/experiments/mass-density" }
      ],
      imageUrl: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    };
  }
  
  // Fluid dynamics explanations
  else if (searchTerm.includes('flow') || searchTerm.includes('fluid dynamics') || searchTerm.includes('fluid flow')) {
    return {
      definition: "Fluid dynamics is the study of how fluids (liquids and gases) move and the forces acting on them. It is a fundamental area of fluid mechanics that deals with fluid flow patterns, velocity, pressure, and related phenomena in various engineering applications.",
      formula: "ρ(∂v/∂t + v·∇v) = -∇p + μ∇²v + ρg",
      formulaDescription: "Navier-Stokes equation: relates fluid acceleration (left side) to pressure gradient, viscous forces, and gravity (right side)",
      relatedConcepts: ["Laminar Flow", "Turbulent Flow", "Bernoulli Principle", "Boundary Layer", "Flow Rate"],
      examples: [
        "Water flowing through pipes in municipal systems",
        "Air movement around aircraft wings creating lift",
        "Blood circulation through veins and arteries",
        "River flow patterns around bridge supports"
      ],
      references: [
        { title: "Fundamentals of Fluid Dynamics", url: "/resources/fluid-dynamics" },
        { title: "Flow Visualization Experiment", url: "/experiments/flow-dynamics" }
      ],
      imageUrl: "https://images.unsplash.com/photo-1581093196277-9f6e9b96cc00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    };
  }
  
  // Pressure explanations
  else if (searchTerm.includes('pressure') || searchTerm.includes('force') || searchTerm.includes('stress')) {
    return {
      definition: "Pressure is the force applied perpendicular to a surface per unit area. In fluid mechanics, pressure is a fundamental property that affects fluid behavior and is critical for designing hydraulic systems, pumps, and fluid containment structures.",
      formula: "P = F/A",
      formulaDescription: "Pressure (P) equals force (F) divided by the area (A) over which it is applied, typically measured in pascals (Pa) or N/m²",
      relatedConcepts: ["Hydrostatic Pressure", "Pascal's Law", "Gauge Pressure", "Absolute Pressure", "Pressure Head"],
      examples: [
        "Water pressure increases with depth in a swimming pool",
        "Atmospheric pressure decreases with altitude",
        "Tire pressure must be maintained for optimal vehicle performance",
        "Blood pressure is a vital health indicator in medical diagnostics"
      ],
      references: [
        { title: "Fluid Statics and Pressure", url: "/resources/pressure" },
        { title: "Hydrostatic Pressure Experiment", url: "/experiments/hydrostatic" }
      ],
      imageUrl: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    };
  }

  // Default response for other terms
  else {
    // Check interaction history for context
    const recentInteractions = interactionHistory
      .slice(-3)
      .map(item => item.query.toLowerCase());
    
    let contextualTopic = "fluid mechanics";
    
    if (recentInteractions.some(query => query.includes('viscosity') || query.includes('flow'))) {
      contextualTopic = "fluid dynamics";
    } else if (recentInteractions.some(query => query.includes('pressure') || query.includes('force'))) {
      contextualTopic = "fluid statics";
    } else if (recentInteractions.some(query => query.includes('experiment') || query.includes('measurement'))) {
      contextualTopic = "experimental methods";
    }
    
    return {
      definition: `"${text}" appears to be related to ${contextualTopic}. While I don't have specific information about this exact term, it may be connected to fundamental fluid mechanics principles.`,
      relatedConcepts: ["Fluid Properties", "Flow Dynamics", "Pressure Systems", "Experimental Methods"],
      examples: [
        "Consider exploring related concepts in our experiments section",
        "Check the learning resources for more information on fluid mechanics fundamentals"
      ],
      references: [
        { title: "Fluid Mechanics Fundamentals", url: "/resources/fundamentals" },
        { title: "Browse All Experiments", url: "/experiments" }
      ],
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    };
  }
} 