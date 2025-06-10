import type { AIExplanation } from "./types";

export function useMockAPIResponse(prompt: string, interactionHistory: { query: string; timestamp: number }[]): Promise<AIExplanation> {
  return new Promise((resolve) => {
    // Simulate API delay (1 second)
    setTimeout(() => {
      const searchTerm = prompt.toLowerCase();
      let result: AIExplanation;
      
      // Choose appropriate mock response based on the search term
      if (searchTerm.includes('viscosity')) {
        result = {
          definition: "Viscosity is a fundamental property of fluids that measures their resistance to deformation or flow. In fluid mechanics, viscosity refers to the internal friction within a fluid. This property determines how easily a fluid flows and how it interacts with its surroundings. Viscosity plays a crucial role in many engineering applications, from designing pipelines and pumps to understanding blood flow in medical contexts.",
          formula: "μ = τ / (du/dy)",
          formulaDescription: "Dynamic viscosity (μ) equals shear stress (τ) divided by shear rate (du/dy). The SI unit is Pascal-second (Pa·s). Kinematic viscosity (ν) is dynamic viscosity divided by density: ν = μ/ρ, measured in m²/s.",
          relatedConcepts: ["Reynolds Number", "Laminar Flow", "Turbulent Flow", "Non-Newtonian Fluids", "Kinematic Viscosity", "Shear Stress", "Boundary Layer", "Viscous Dissipation"],
          examples: [
            "Water at 20°C has a viscosity of approximately 1.002 mPa·s, while at 100°C it decreases to 0.282 mPa·s, showing temperature dependence",
            "Honey is approximately 10,000 times more viscous than water, demonstrating the wide range of viscosity values in common fluids",
            "Motor oils are rated by their viscosity at different temperatures (e.g., 5W-30), with the first number indicating cold temperature performance",
            "In blood vessels, viscosity affects circulation and blood pressure, with blood being a non-Newtonian fluid whose viscosity changes with flow rate"
          ],
          references: [
            { title: "Fluid Mechanics: Fundamentals and Applications", url: "/resources/fluid-mechanics" },
            { title: "Dynamic Viscosity Experiment", url: "/experiments/viscosity" },
            { title: "Journal of Fluid Mechanics", url: "/resources/journal-fluid-mechanics" }
          ],
          teachingNote: "Understanding viscosity is crucial for fluid mechanics as it determines flow behavior and energy dissipation in fluid systems."
        };
      }
      else if (searchTerm.includes('density') || searchTerm.includes('mass')) {
        result = {
          definition: "Density (ρ) is defined as mass per unit volume, a fundamental property of matter that determines how tightly packed the atoms or molecules are within a substance. In fluid mechanics, density is crucial for calculating buoyancy, pressure gradients, and flow characteristics.",
          formula: "ρ = m/V",
          formulaDescription: "Density (ρ) equals mass (m) divided by volume (V), typically measured in kilograms per cubic meter (kg/m³).",
          relatedConcepts: ["Specific Gravity", "Buoyancy", "Archimedes' Principle", "Unit Weight", "Relative Density"],
          examples: [
            "Water at 4°C has a density of exactly 1000 kg/m³",
            "Ice has a lower density than water, which is why it floats",
            "Mercury's high density makes it useful for barometers",
            "Density affects structural loads in civil engineering"
          ],
          references: [
            { title: "Civil Engineering Materials Handbook", url: "/resources/materials" },
            { title: "Mass Density Analysis Experiment", url: "/experiments/mass-density" }
          ],
          teachingNote: "Density is a key property that affects fluid behavior and structural design considerations."
        };
      }
      else if (searchTerm.includes('reynolds') || searchTerm.includes('reynolds number')) {
        result = {
          definition: "The Reynolds number (Re) is a dimensionless quantity that predicts flow patterns in different fluid flow situations. It represents the ratio of inertial forces to viscous forces within a fluid.",
          formula: "Re = ρvD/μ = vD/ν",
          formulaDescription: "Reynolds number (Re) equals fluid density (ρ) times velocity (v) times characteristic length (D) divided by dynamic viscosity (μ), or velocity times characteristic length divided by kinematic viscosity (ν).",
          relatedConcepts: ["Laminar Flow", "Turbulent Flow", "Flow Transition", "Pipe Flow", "Boundary Layer"],
          examples: [
            "Re < 2300: Laminar flow in pipes",
            "2300 < Re < 4000: Transitional flow",
            "Re > 4000: Turbulent flow",
            "Aircraft wing design considers Reynolds number effects"
          ],
          references: [
            { title: "Flow Patterns and Reynolds Number", url: "/resources/reynolds" },
            { title: "Reynolds Number Experiment", url: "/experiments/reynolds" }
          ],
          teachingNote: "The Reynolds number is crucial for predicting flow behavior and designing fluid systems."
        };
      }
      else {
        // Default response for other fluid mechanics terms
        result = {
          definition: `The term "${prompt}" is related to fluid mechanics. While I don't have specific information about this exact term, it may be connected to fundamental fluid mechanics principles.`,
          relatedConcepts: ["Fluid Properties", "Flow Dynamics", "Pressure", "Viscosity"],
          examples: [
            "Consider exploring related concepts in our experiments section",
            "Check the learning resources for more information"
          ],
          references: [
            { title: "Fluid Mechanics Fundamentals", url: "/resources/fundamentals" },
            { title: "Browse All Experiments", url: "/experiments" }
          ],
          teachingNote: "Understanding fundamental fluid mechanics concepts helps build a strong foundation for more advanced topics."
        };
      }
      
      resolve(result);
    }, 1000); // 1 second delay
  });
} 