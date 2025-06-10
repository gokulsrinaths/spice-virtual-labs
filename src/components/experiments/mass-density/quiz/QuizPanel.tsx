import React, { useState } from 'react';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the relationship between mass density and temperature for most liquids?",
    options: [
      "Density increases as temperature increases",
      "Density decreases as temperature increases",
      "Density remains constant with temperature changes",
      "There is no relationship between density and temperature"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Why is it important to dry the volumetric flask before starting the experiment?",
    options: [
      "To make it easier to handle",
      "To remove any moisture that could affect mass measurements",
      "To sterilize the flask",
      "To calibrate the flask"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "How is specific gravity calculated in this experiment?",
    options: [
      "By multiplying density by gravity",
      "By dividing the liquid's density by the density of water at 4°C",
      "By measuring buoyant force",
      "By weighing equal volumes of different liquids"
    ],
    correctAnswer: 1
  }
];

export function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestion(currentQuestion + 1);
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
            <div className="flex justify-between items-center">
              <div className="text-sm">
                {selectedAnswer === question.correctAnswer ? (
                  <span className="text-green-600">Correct!</span>
                ) : (
                  <span className="text-red-600">Incorrect. Try again!</span>
                )}
              </div>
              {currentQuestion < questions.length - 1 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            onClick={() => {
              setCurrentQuestion(0);
              setScore(0);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
          >
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
}