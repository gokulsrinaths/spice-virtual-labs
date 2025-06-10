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
    text: "What happens to vapor pressure as temperature increases?",
    options: [
      "Vapor pressure decreases",
      "Vapor pressure increases",
      "Vapor pressure remains constant",
      "Vapor pressure becomes zero"
    ],
    correctAnswer: 1,
    explanation: "As temperature increases, more molecules have enough energy to escape the liquid phase, increasing the vapor pressure."
  },
  {
    id: 2,
    text: "What is vapor pressure?",
    options: [
      "The pressure exerted by air above a liquid",
      "The pressure exerted by vapor in equilibrium with its liquid phase",
      "The total pressure in a container",
      "The atmospheric pressure"
    ],
    correctAnswer: 1,
    explanation: "Vapor pressure is the pressure exerted by a vapor when it is in equilibrium with its liquid phase at a given temperature."
  },
  {
    id: 3,
    text: "At what temperature does vapor pressure equal atmospheric pressure?",
    options: [
      "Freezing point",
      "Melting point",
      "Boiling point",
      "Triple point"
    ],
    correctAnswer: 2,
    explanation: "A liquid boils when its vapor pressure equals atmospheric pressure. This occurs at the boiling point temperature."
  },
  {
    id: 4,
    text: "How does vapor pressure vary with intermolecular forces?",
    options: [
      "Stronger forces lead to higher vapor pressure",
      "Stronger forces lead to lower vapor pressure",
      "Forces have no effect on vapor pressure",
      "The relationship is random"
    ],
    correctAnswer: 1,
    explanation: "Stronger intermolecular forces make it harder for molecules to escape the liquid phase, resulting in lower vapor pressure."
  },
  {
    id: 5,
    text: "What is the relationship between molecular weight and vapor pressure?",
    options: [
      "Heavier molecules have higher vapor pressure",
      "Heavier molecules have lower vapor pressure",
      "Molecular weight has no effect",
      "The relationship depends on temperature"
    ],
    correctAnswer: 1,
    explanation: "Generally, heavier molecules have lower vapor pressure because they require more energy to overcome intermolecular forces and escape the liquid phase."
  }
];

export function VaporPressureQuiz() {
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