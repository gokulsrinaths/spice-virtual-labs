import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, ArrowRight, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "According to Bernoulli's principle, what happens to fluid pressure when velocity increases?",
    options: [
      "Pressure increases",
      "Pressure decreases",
      "Pressure remains constant",
      "Pressure becomes zero"
    ],
    correctAnswer: 1,
    explanation: "According to Bernoulli's principle, as fluid velocity increases, pressure must decrease to maintain constant total energy in the system."
  },
  {
    id: 2,
    text: "In a Venturi tube, where is the fluid velocity highest?",
    options: [
      "At the entrance",
      "At the throat (constriction)",
      "At the exit",
      "Velocity is constant throughout"
    ],
    correctAnswer: 1,
    explanation: "Due to the continuity equation, fluid velocity must increase at the throat where the cross-sectional area is smallest."
  },
  {
    id: 3,
    text: "What is the relationship between cross-sectional area and fluid velocity in a pipe?",
    options: [
      "They are directly proportional",
      "They are inversely proportional",
      "There is no relationship",
      "The relationship depends on pressure"
    ],
    correctAnswer: 1,
    explanation: "According to the continuity equation (A₁v₁ = A₂v₂), area and velocity are inversely proportional to maintain constant flow rate."
  },
  {
    id: 4,
    text: "Which of these is conserved in ideal fluid flow?",
    options: [
      "Only pressure",
      "Only velocity",
      "Total energy (pressure + kinetic + potential)",
      "Only kinetic energy"
    ],
    correctAnswer: 2,
    explanation: "Bernoulli's equation states that total energy (sum of pressure, kinetic, and potential energy) is conserved in ideal fluid flow."
  },
  {
    id: 5,
    text: "What assumption is NOT made in Bernoulli's equation?",
    options: [
      "Flow is steady",
      "Fluid is inviscid",
      "Flow is compressible",
      "Flow is along a streamline"
    ],
    correctAnswer: 2,
    explanation: "Bernoulli's equation assumes incompressible flow. The other assumptions (steady flow, inviscid fluid, and flow along a streamline) are all required."
  }
];

export function BernoulliQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setShowExplanation(false);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
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
  };

  const question = questions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Knowledge Check</h2>
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {currentQuestion < questions.length ? (
        <>
          <div className="mb-6">
            <p className="text-lg mb-4">{question.text}</p>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === index
                      ? showResult
                        ? index === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
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
                    <span className="text-green-600">Correct!</span>
                  ) : (
                    <span className="text-red-600">Incorrect. Try again!</span>
                  )}
                </div>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Explanation</span>
                </button>
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800"
                >
                  {question.explanation}
                </motion.div>
              )}

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
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
          <p className="text-lg mb-6">
            Your score: {score} out of {questions.length}
          </p>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleRestart}
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
}