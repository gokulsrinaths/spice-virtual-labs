import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ArrowRight, HelpCircle, RefreshCw, Award } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: 'concept' | 'calculation' | 'application';
  image?: string;
  formula?: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What are the three forms of energy considered in the energy equation?",
    options: [
      "Kinetic, Thermal, and Chemical",
      "Pressure, Kinetic, and Potential",
      "Thermal, Nuclear, and Mechanical",
      "Electric, Magnetic, and Kinetic"
    ],
    correctAnswer: 1,
    explanation: "The energy equation considers pressure energy (pressure head), kinetic energy (velocity head), and potential energy (elevation head). These three forms combine to give the total head in a fluid system.",
    difficulty: 'basic',
    category: 'concept'
  },
  {
    id: 2,
    text: "What is velocity head in the energy equation?",
    options: [
      "The height of the fluid column",
      "The pressure divided by specific weight",
      "The kinetic energy per unit weight (v²/2g)",
      "The elevation above datum"
    ],
    correctAnswer: 2,
    explanation: "Velocity head represents the kinetic energy per unit weight of fluid and is calculated as v²/2g, where v is velocity and g is gravitational acceleration. It quantifies the energy associated with fluid motion.",
    difficulty: 'basic',
    category: 'concept',
    formula: "hv = v²/2g"
  },
  {
    id: 3,
    text: "In an ideal flow (no losses), what happens to the total head along a streamline?",
    options: [
      "It increases with distance",
      "It decreases with distance",
      "It remains constant",
      "It varies randomly"
    ],
    correctAnswer: 2,
    explanation: "According to Bernoulli's principle, in an ideal flow with no losses, the total head (sum of pressure, velocity, and elevation heads) remains constant along a streamline. This is a fundamental principle of fluid mechanics.",
    difficulty: 'basic',
    category: 'concept'
  },
  {
    id: 4,
    text: "If a pipe diameter decreases from 200mm to 100mm, and the initial velocity is 2 m/s, what is the final velocity?",
    options: [
      "1 m/s",
      "4 m/s",
      "8 m/s",
      "16 m/s"
    ],
    correctAnswer: 2,
    explanation: "Using the continuity equation (A₁v₁ = A₂v₂), when the area reduces to 1/4 (diameter halves), the velocity must increase by a factor of 4 to maintain the same flow rate. Therefore, 2 m/s × 4 = 8 m/s.",
    difficulty: 'intermediate',
    category: 'calculation',
    formula: "A₁v₁ = A₂v₂"
  },
  {
    id: 5,
    text: "How does elevation head change with height?",
    options: [
      "It increases linearly with height",
      "It decreases linearly with height",
      "It varies with the square of height",
      "It remains constant with height"
    ],
    correctAnswer: 0,
    explanation: "Elevation head is directly proportional to height above the datum. It increases linearly as elevation increases, with the relationship h = z, where z is the height above the reference level.",
    difficulty: 'basic',
    category: 'concept',
    formula: "h = z"
  },
  {
    id: 6,
    text: "Calculate the pressure head for water (ρ = 1000 kg/m³) at a pressure of 200 kPa.",
    options: [
      "10.2 m",
      "20.4 m",
      "30.6 m",
      "40.8 m"
    ],
    correctAnswer: 1,
    explanation: "Pressure head = P/ρg = 200,000 Pa / (1000 kg/m³ × 9.81 m/s²) = 20.4 m. This represents the height of a water column that would create the same pressure.",
    difficulty: 'intermediate',
    category: 'calculation',
    formula: "hp = P/ρg"
  },
  {
    id: 7,
    text: "What happens to the hydraulic grade line when there are losses in the system?",
    options: [
      "It remains horizontal",
      "It increases in the flow direction",
      "It decreases in the flow direction",
      "It follows a parabolic curve"
    ],
    correctAnswer: 2,
    explanation: "The hydraulic grade line (HGL) decreases in the direction of flow when there are losses. The slope of the HGL represents the energy loss per unit length of pipe.",
    difficulty: 'intermediate',
    category: 'concept'
  },
  {
    id: 8,
    text: "For a flow rate of 0.1 m³/s in a 200mm diameter pipe, calculate the velocity head.",
    options: [
      "0.82 m",
      "1.64 m",
      "2.46 m",
      "3.28 m"
    ],
    correctAnswer: 0,
    explanation: "First calculate velocity: v = Q/A = 0.1/(π×0.1²) = 3.18 m/s. Then velocity head = v²/2g = 3.18²/(2×9.81) = 0.82 m",
    difficulty: 'advanced',
    category: 'calculation',
    formula: "v = Q/A, hv = v²/2g"
  },
  {
    id: 9,
    text: "What is the relationship between pipe diameter and head loss?",
    options: [
      "Head loss ∝ diameter",
      "Head loss ∝ 1/diameter",
      "Head loss ∝ 1/diameter⁵",
      "Head loss ∝ diameter²"
    ],
    correctAnswer: 2,
    explanation: "According to the Darcy-Weisbach equation, head loss is inversely proportional to the fifth power of diameter. This means a small change in diameter has a large effect on head loss.",
    difficulty: 'advanced',
    category: 'concept',
    formula: "hf ∝ 1/D⁵"
  },
  {
    id: 10,
    text: "How does Reynolds number affect the friction factor in laminar flow?",
    options: [
      "f = 64/Re",
      "f = 32/Re",
      "f = 16/Re",
      "f = 8/Re"
    ],
    correctAnswer: 0,
    explanation: "In laminar flow (Re < 2300), the friction factor is inversely proportional to Reynolds number according to the relationship f = 64/Re. This is a theoretical result from the Hagen-Poiseuille equation.",
    difficulty: 'advanced',
    category: 'concept',
    formula: "f = 64/Re"
  }
];

export function EnergyEquationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  const filteredQuestions = questions.filter(q => q.difficulty === difficulty);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setShowExplanation(false);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setCompletedQuestions([...completedQuestions, currentQuestion]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setCompletedQuestions([]);
  };

  const question = questions[currentQuestion];
  const progress = (completedQuestions.length / filteredQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Energy Equation Quiz</h2>
            <div className="flex items-center gap-4">
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value as 'basic' | 'intermediate' | 'advanced');
                  handleRestart();
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Restart
              </button>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentQuestion < questions.length ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                <span className={`px-2 py-1 rounded ${
                  question.difficulty === 'basic' ? 'bg-green-900/50 text-green-300' :
                  question.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-red-900/50 text-red-300'
                }`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded ${
                  question.category === 'concept' ? 'bg-blue-900/50 text-blue-300' :
                  question.category === 'calculation' ? 'bg-purple-900/50 text-purple-300' :
                  'bg-orange-900/50 text-orange-300'
                }`}>
                  {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
                </span>
              </div>
              <p className="text-lg mb-4 text-white">{question.text}</p>
              {question.formula && (
                <div className="mb-4 p-3 bg-zinc-800 rounded-lg font-mono text-sm text-zinc-300">
                  Formula: {question.formula}
                </div>
              )}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === index
                        ? showResult
                          ? index === question.correctAnswer
                            ? 'border-green-500 bg-green-900/20 text-green-300'
                            : 'border-red-500 bg-red-900/20 text-red-300'
                          : 'border-blue-500 bg-blue-900/20 text-blue-300'
                        : 'border-zinc-700 hover:border-zinc-600 text-zinc-300'
                    }`}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === question.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    {selectedAnswer === question.correctAnswer ? (
                      <span className="text-green-400">Correct!</span>
                    ) : (
                      <span className="text-red-400">Incorrect. Try again!</span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Explanation</span>
                  </button>
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-blue-900/20 rounded-lg text-sm text-blue-300"
                    >
                      {question.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>

                {currentQuestion < questions.length - 1 && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto"
                    onClick={handleNext}
                  >
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-white">
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-zinc-400 mb-4">
                You scored {score} out of {questions.length} questions correctly.
              </p>
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(score / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-zinc-400">
                {score === questions.length
                  ? "Perfect score! You've mastered the energy equation concepts!"
                  : score >= questions.length * 0.8
                  ? "Great job! You have a strong understanding of the material."
                  : score >= questions.length * 0.6
                  ? "Good effort! Review the concepts you missed and try again."
                  : "Keep practicing! Review the material and try the quiz again."}
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}