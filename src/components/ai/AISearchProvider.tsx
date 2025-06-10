import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define types for the AI search feature
type AISearchResult = {
  text: string;
  source?: string;
  url?: string;
  formula?: string;
  formulaDescription?: string;
  figure?: string;
  figureCaption?: string;
}

// Context type definition
type AISearchContextType = {
  selectedText: string;
  showAISearchModal: boolean;
  aiSearchResults: AISearchResult[];
  aiSearchLoading: boolean;
  handleAISearch: () => Promise<void>;
  closeAISearchModal: () => void;
};

// Create context with default values
const AISearchContext = createContext<AISearchContextType>({
  selectedText: '',
  showAISearchModal: false,
  aiSearchResults: [],
  aiSearchLoading: false,
  handleAISearch: async () => {},
  closeAISearchModal: () => {},
});

// Hook to use the AI search context
export const useAISearch = () => useContext(AISearchContext);

// Props for the provider component
interface AISearchProviderProps {
  children: ReactNode;
}

export function AISearchProvider({ children }: AISearchProviderProps) {
  const [selectedText, setSelectedText] = useState<string>('');
  const [showAISearchModal, setShowAISearchModal] = useState<boolean>(false);
  const [aiSearchResults, setAISearchResults] = useState<AISearchResult[]>([]);
  const [aiSearchLoading, setAISearchLoading] = useState<boolean>(false);
  const [selectionPosition, setSelectionPosition] = useState<{ top: number; left: number } | null>(null);
  const [searchQueryText, setSearchQueryText] = useState<string>('');

  // Handle text selection
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const text = selection.toString().trim();
        setSelectedText(text);
        
        // Get the position of the selection
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectionPosition({
            top: rect.top - 40,
            left: rect.left
          });
        }
      } else {
        // Clear selection when text is deselected
        resetSelection();
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleTextSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('selectionchange', handleTextSelection);
    };
  }, []);

  // Reset selection when the modal is closed
  const resetSelection = () => {
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Handle AI search request
  const handleAISearch = async () => {
    if (!selectedText) return;
    
    // Store the current selected text for display in the modal
    setSearchQueryText(selectedText);
    
    setShowAISearchModal(true);
    setAISearchLoading(true);
    
    // Simulate API call to AI service
    // In a real implementation, you would call your actual AI service API here
    setTimeout(() => {
      const searchTerm = selectedText.toLowerCase();
      const mockResults: AISearchResult[] = [];
      
      // Specific detailed results based on search term
      if (searchTerm.includes('viscosity')) {
        // Comprehensive results for viscosity - with formula but no image
        mockResults.push({
          text: `Viscosity is a fundamental property of fluids that measures their resistance to deformation or flow. In civil and mechanical engineering, viscosity is crucial for designing fluid transport systems, analyzing hydraulic machinery performance, and predicting fluid behavior in various applications. Dynamic viscosity (μ) measures the tangential force per unit area required to move one horizontal plane relative to another at unit velocity when the planes are separated by the fluid. Kinematic viscosity (ν) is the ratio of dynamic viscosity to density (ν = μ/ρ).`,
          source: "Fluid Mechanics: Fundamentals and Applications",
          url: "#",
          formula: "μ = τ / (du/dy)",
          formulaDescription: "Dynamic viscosity (μ) equals shear stress (τ) divided by shear rate (du/dy). SI unit: Pa·s"
        });
        
        // Add detailed examples and applications - without image
        mockResults.push({
          text: `Viscosity significantly affects fluid flow characteristics in pipes, open channels, and around structures. Engineers must account for viscosity when designing pumping systems, water treatment facilities, and hydraulic structures. For example, the Reynolds number (Re = ρvD/μ) uses viscosity to predict whether flow will be laminar or turbulent. In non-Newtonian fluids like concrete slurries, drilling muds, and wastewater sludge, viscosity varies with shear rate, presenting additional engineering challenges.`,
          source: "Applied Hydraulics in Engineering Practice",
          url: "#"
        });
      } 
      else if (searchTerm.includes('density') || searchTerm.includes('mass') || searchTerm.includes('specific gravity')) {
        // Comprehensive density information - with formula but no image
        mockResults.push({
          text: `Density (ρ) is defined as mass per unit volume and is a critical property in civil engineering materials and structural design. It affects structural loads, buoyancy, material selection, and foundation design. In geotechnical engineering, soil density influences settlement calculations, bearing capacity, and slope stability. For structural components, density determines dead loads and inertial forces during dynamic events like earthquakes.`,
          source: "Civil Engineering Materials Handbook",
          url: "#",
          formula: searchTerm.includes('specific gravity') ? 
                  "SG = ρ_material / ρ_water" : 
                  searchTerm.includes('unit weight') ? 
                  "γ = ρg" : 
                  "ρ = m/V",
          formulaDescription: searchTerm.includes('specific gravity') ? 
                             "Specific gravity (SG) is the ratio of material density to reference water density (typically at 4°C where ρ_water = 1000 kg/m³)" : 
                             searchTerm.includes('unit weight') ? 
                             "Unit weight (γ) equals density (ρ) multiplied by gravitational acceleration (g = 9.81 m/s²), measured in N/m³ or kN/m³" : 
                             "Density (ρ) equals mass (m) divided by volume (V), typically measured in kg/m³"
        });
        
        // Add practical applications - without image
        mockResults.push({
          text: `In concrete mix design, density directly impacts workability, strength, and durability. ASTM C138 provides standard testing methods for density determination in concrete mixtures. In soil mechanics, relative density indicates compaction level of granular soils, affecting their engineering properties. For hydraulic structures, accurate density measurements are essential for calculating hydrostatic forces, buoyancy effects, and stability analysis. Bulk density, particle density, and dry density are differentiated based on how void spaces and moisture content are considered.`,
          source: "Materials Testing in Civil Engineering Practice",
          url: "#"
        });
      }
      else if (searchTerm.includes('reynolds') || searchTerm.includes('reynolds number')) {
        // Detailed explanation of Reynolds number - with formula but no image
        mockResults.push({
          text: `The Reynolds number (Re) is a dimensionless quantity that predicts fluid flow patterns by representing the ratio of inertial forces to viscous forces. It's one of the most important parameters in fluid mechanics, providing a criterion for determining whether flow will be laminar (smooth, orderly) or turbulent (chaotic, with eddies and vortices). This distinction is crucial for accurate hydraulic modeling, pipe flow calculations, and open channel design.`,
          source: "Hydraulic Engineering: Theory and Practice",
          url: "#",
          formula: "Re = ρvD/μ = vD/ν",
          formulaDescription: "Reynolds number (Re) equals fluid density (ρ) times velocity (v) times characteristic length (D) divided by dynamic viscosity (μ); alternatively, velocity times characteristic length divided by kinematic viscosity (ν)"
        });
        
        // Add practical implications - without image
        mockResults.push({
          text: `For pipe flow, transition from laminar to turbulent typically occurs around Re ≈ 2300, though fully developed turbulent flow may not establish until Re > 4000. Engineers use these thresholds to determine appropriate friction factors and head loss calculations. For open channel flow and flow around structures, critical Reynolds numbers differ. In water treatment processes, Reynolds number helps determine mixing efficiency and settling behavior. CFD (Computational Fluid Dynamics) models use Reynolds numbers to select appropriate turbulence models for accurate flow simulation.`,
          source: "Applied Fluid Mechanics in Civil Engineering",
          url: "#"
        });
      }
      else if (searchTerm.includes('pressure') || searchTerm.includes('hydraulic pressure')) {
        // Comprehensive pressure information - no formula for civil term
        mockResults.push({
          text: `Pressure in fluid systems is defined as force per unit area and is fundamental to hydraulic engineering, water distribution systems, and structural design. In civil engineering applications, both gauge pressure (relative to atmospheric pressure) and absolute pressure are considered depending on the context. Hydrostatic pressure increases linearly with depth according to p = ρgh, where ρ is fluid density, g is gravitational acceleration, and h is depth. Understanding pressure distribution is essential for designing retaining walls, water tanks, dams, and drainage systems.`,
          source: "Hydraulic Structures Design Manual",
          url: "#"
        });
        
        // Add applications and pressure distribution - no formula or image
        mockResults.push({
          text: `Pressure considerations are critical for designing dams, retaining walls, pipelines, and water tanks. Pascal's law states that pressure applied to a confined fluid is transmitted undiminished throughout the fluid and acts perpendicular to containing surfaces. This principle underlies hydraulic machinery operation. Pressure transients (water hammer) occur when flow velocity changes rapidly, potentially causing structural damage. Engineers use surge analysis and pressure relief systems to mitigate these effects. For groundwater systems, piezometric head combines pressure head, velocity head, and elevation head according to Bernoulli's principle.`,
          source: "Hydraulic Engineering Systems",
          url: "#"
        });
      }
      else if (searchTerm.includes('bernoulli') || searchTerm.includes('bernoulli equation') || searchTerm.includes('energy equation')) {
        // Comprehensive Bernoulli principle explanation - with formula but no image
        mockResults.push({
          text: `Bernoulli's equation is a fundamental principle in fluid mechanics that relates pressure, velocity, and elevation in a flowing fluid. It represents the conservation of energy per unit volume along a streamline under ideal conditions (steady, inviscid, incompressible flow). The principle states that as fluid velocity increases, pressure decreases, and vice versa. This principle is essential for analyzing flow in pipes, channels, around structures, and through hydraulic machinery.`,
          source: "Fluid Mechanics Principles and Applications",
          url: "#",
          formula: "p₁/ρg + v₁²/2g + z₁ = p₂/ρg + v₂²/2g + z₂",
          formulaDescription: "Bernoulli's equation where each term represents energy per unit weight (head): pressure head (p/ρg), velocity head (v²/2g), and elevation head (z) at points 1 and 2 along a streamline"
        });
        
        // Add practical applications - without image
        mockResults.push({
          text: `In civil engineering practice, Bernoulli's equation helps analyze flow through variable cross-section channels, over weirs and spillways, and through orifices. For real fluids with viscous effects, the equation is modified to include head loss terms. The hydraulic grade line (HGL) represents the sum of pressure head and elevation head, while the energy grade line (EGL) includes velocity head as well. Engineers use these visual representations to identify potential cavitation zones, ensure sufficient pressure throughout systems, and design hydraulic jumps for energy dissipation.`,
          source: "Hydraulic Design Handbook",
          url: "#"
        });
      }
      else if (searchTerm.includes('head loss') || searchTerm.includes('friction loss')) {
        // Detailed head loss information - no formula for civil term
        mockResults.push({
          text: `Head loss in fluid systems represents energy dissipation due to friction and minor losses from fittings, valves, bends, contractions, and expansions. Major (friction) losses occur along the pipe length and are calculated using the Darcy-Weisbach equation. Head loss directly affects pump selection, system capacity, and energy requirements in water distribution networks, irrigation systems, and wastewater conveyance systems. Understanding head loss is fundamental to designing efficient hydraulic systems that balance energy use with flow requirements.`,
          source: "Hydraulic Engineering Design",
          url: "#"
        });
        
        // Add practical applications - no formula or image
        mockResults.push({
          text: `Engineers use the Moody diagram to determine friction factors based on Reynolds number and relative pipe roughness (ε/D). For laminar flow (Re < 2300), f = 64/Re, while turbulent flow requires iterative solutions or empirical equations like Colebrook-White. In complex systems, Hardy Cross method or computer models help determine flow distribution and pressure gradients. Minor losses are particularly significant in systems with numerous fittings or at higher velocities. For open channels, Manning's equation is commonly used instead, relating flow to channel roughness, hydraulic radius, and slope.`,
          source: "Practical Hydraulic Design for Civil Engineers",
          url: "#"
        });
      }
      else if (searchTerm.includes('water flow') || searchTerm.includes('open channel') || searchTerm.includes('flow rate')) {
        // Detailed water flow information - no formula for civil term
        mockResults.push({
          text: `Water flow in civil engineering encompasses pipe flow (pressurized) and open channel flow (free surface). Flow characteristics are described by continuity equation (Q = VA, where Q is flow rate, V is velocity, and A is cross-sectional area), energy equations, and momentum principles. Flow classification includes steady vs. unsteady, uniform vs. varied, laminar vs. turbulent, and subcritical vs. supercritical based on Froude number. These distinctions determine appropriate analysis methods and design considerations for various hydraulic structures.`,
          source: "Open Channel Hydraulics",
          url: "#"
        });
        
        // Add practical applications - no formula or image
        mockResults.push({
          text: `Engineering applications include sizing culverts, designing channels for flood control, irrigation canal systems, and stormwater management. Hydraulic jumps occur when flow transitions from supercritical to subcritical, serving as energy dissipation structures downstream of spillways and stilling basins. The Froude number (Fr = v/√(gD)) determines flow regime, with Fr < 1 indicating subcritical flow and Fr > 1 indicating supercritical flow. Transitional zones require special attention to prevent scouring, erosion, and hydraulic instabilities. Critical design considerations include velocity limitations, freeboard requirements, and scour protection measures.`,
          source: "Hydraulic Structures and Flood Control",
          url: "#"
        });
      }
      else {
        // Generic civil engineering fluid mechanics information for other terms - no formula or image
        mockResults.push({
          text: `"${selectedText}" is an important concept in civil engineering fluid mechanics. Understanding fluid behavior is essential for designing water distribution systems, wastewater treatment facilities, hydraulic structures, and stormwater management systems. Fluid mechanics principles combine conservation of mass, momentum, and energy with material properties to predict fluid behavior under various conditions. Civil engineers analyze fluid properties and behaviors to develop safe, efficient infrastructure that can withstand various hydraulic conditions while meeting project requirements.`,
          source: "Principles of Civil Engineering Hydraulics",
          url: "#"
        });
        
        mockResults.push({
          text: `Civil engineers apply fluid mechanics concepts like "${selectedText}" when analyzing flow in pipes, open channels, around structures, and through porous media. Laboratory testing, computational fluid dynamics (CFD), and empirical methods help determine appropriate design parameters. Considerations include avoiding cavitation, managing sediment transport, ensuring adequate capacity, and optimizing energy efficiency throughout the system lifecycle. Understanding these principles allows engineers to design resilient systems that can handle varying flow conditions while remaining cost-effective.`,
          source: "Civil Engineering Fluid Mechanics Applications",
          url: "#"
        });
      }
      
      // Add relevant standards information when applicable - no formula or image
      if (searchTerm.includes('density') || searchTerm.includes('mass')) {
        mockResults.push({
          text: `ASTM standards provide specific testing procedures for density measurements in civil engineering materials:
          • ASTM D7263: Standard Test Methods for Laboratory Determination of Density of Soil Specimens
          • ASTM C138: Standard Test Method for Density (Unit Weight), Yield, and Air Content of Concrete
          • ASTM D1505: Standard Test Method for Density of Plastics by the Density-Gradient Technique
          
          These standards ensure consistent measurement approaches across the industry and provide quality control guidelines for material testing laboratories. Following standardized procedures is essential for producing reliable data that can be used in design calculations and quality control processes.`,
          source: "ASTM International Standards Compilation",
          url: "#"
        });
      }
      else if (searchTerm.includes('viscosity')) {
        mockResults.push({
          text: `Standard testing methods for viscosity determination include:
          • ASTM D445: Standard Test Method for Kinematic Viscosity of Transparent and Opaque Liquids
          • ASTM D2196: Standard Test Methods for Rheological Properties of Non-Newtonian Materials by Rotational Viscometer
          • ISO 3219: Plastics — Polymers/resins in the liquid state or as emulsions or dispersions — Determination of viscosity using a rotational viscometer with defined shear rate
          
          These methods use various viscometers including capillary, falling sphere, rotational, and vibrational types, each suitable for different viscosity ranges and fluid types. Accurate viscosity measurements are crucial for predicting fluid behavior in engineering applications.`,
          source: "Materials Testing Standards in Engineering Practice",
          url: "#"
        });
      }
      else if (searchTerm.includes('flow') || searchTerm.includes('hydraulic')) {
        mockResults.push({
          text: `Hydraulic design guidelines and standards include:
          • USBR Hydraulic Design of Stilling Basins and Energy Dissipators
          • FHWA HEC-14: Hydraulic Design of Energy Dissipators for Culverts and Channels
          • AWWA Manual M55: PE Pipe—Design and Installation
          • Hydraulic Institute Standards for pump testing and system design
          
          These resources provide proven design methodologies, safety factors, and quality control requirements for hydraulic structures and systems based on extensive research and field performance data. Engineers rely on these established guidelines to ensure their designs meet industry-accepted practices and safety requirements.`,
          source: "Hydraulic Engineering Standards Compendium",
          url: "#"
        });
      }
      
      // Set civil engineering flag to conditionally display formulas in UI
      const isCivilEngineeringTerm = searchTerm.includes('pressure') || 
                                   searchTerm.includes('hydraulic') || 
                                   searchTerm.includes('water flow') || 
                                   searchTerm.includes('open channel') || 
                                   searchTerm.includes('flow rate') || 
                                   searchTerm.includes('head loss') || 
                                   searchTerm.includes('friction');
      
      // For civil engineering terms, remove formulas
      if (isCivilEngineeringTerm) {
        mockResults.forEach(result => {
          result.formula = undefined;
          result.formulaDescription = undefined;
        });
      }
      
      // Remove all images as requested
      mockResults.forEach(result => {
        result.figure = undefined;
        result.figureCaption = undefined;
      });
      
      setAISearchResults(mockResults);
      setAISearchLoading(false);
    }, 1500);
  };

  // Close AI search modal
  const closeAISearchModal = () => {
    setShowAISearchModal(false);
    resetSelection();
    setAISearchResults([]);
  };

  // Context value
  const contextValue: AISearchContextType = {
    selectedText,
    showAISearchModal,
    aiSearchResults,
    aiSearchLoading,
    handleAISearch,
    closeAISearchModal
  };

  return (
    <AISearchContext.Provider value={contextValue}>
      {children}
      
      {/* Text Selection AI Search Button */}
      <AnimatePresence>
        {selectedText && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed cursor-pointer bg-blue-600 rounded-full shadow-lg p-1.5 z-50 flex items-center hover:bg-blue-700"
            style={{ 
              top: `${selectionPosition.top}px`, 
              left: `${selectionPosition.left}px` 
            }}
            onClick={handleAISearch}
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span className="text-white text-xs font-medium ml-1 mr-1">AI</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Search Results Modal */}
      <AnimatePresence>
        {showAISearchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeAISearchModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">Civil Engineering Insights</h3>
                </div>
                <button
                  onClick={closeAISearchModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800">
                  <p className="font-medium">You searched for:</p>
                  <p className="mt-1">"{searchQueryText}"</p>
                </div>
              </div>
              
              {aiSearchLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Searching knowledge base...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {/* Mathematical Formula Display - show only for non-civil terms */}
                  {aiSearchResults.some(result => result.formula) && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-blue-100">
                      <h4 className="font-medium text-gray-800 mb-3">Formula</h4>
                      {aiSearchResults.map((result, index) => result.formula && (
                        <div key={`formula-${index}`} className="mb-3 last:mb-0">
                          <div className="bg-white p-3 rounded border border-gray-200 text-center font-medium text-lg mb-2">
                            {result.formula}
                          </div>
                          {result.formulaDescription && (
                            <p className="text-sm text-gray-600">{result.formulaDescription}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text Explanations */}
                  {aiSearchResults.map((result, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 mb-3">{result.text}</p>
                      {result.source && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Source: {result.source}</span>
                          {result.url && (
                            <a 
                              href={result.url}
                              className="ml-2 text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="mt-4 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Related Civil Engineering Experiments</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Hydraulic Flow', 'Structural Analysis', 'Soil Mechanics', 'Environmental Systems'].map((topic) => (
                        <Link 
                          key={topic} 
                          to={`/experiments/${topic.toLowerCase().replace(' ', '-')}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Beaker className="h-4 w-4" />
                          <span>{topic}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                <div className="flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Customer satisfaction guaranteed</span>
                </div>
                <button
                  onClick={closeAISearchModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AISearchContext.Provider>
  );
} 