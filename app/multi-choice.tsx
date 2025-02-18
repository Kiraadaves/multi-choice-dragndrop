"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  hint: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What do plants need for photosynthesis?",
    options: [
      { id: "A", text: "Oxygen & Sugar" },
      { id: "B", text: "Sunlight, Water & Carbon Dioxide" },
      { id: "C", text: "Protein & Salt" },
    ],
    correctAnswer: "B",
    hint: "Think about what gives plants energy",
  },
  {
    id: 2,
    text: "What is the role of sunlight in photosynthesis?",
    options: [
      { id: "A", text: "It provides energy to make food" },
      { id: "B", text: "It helps plants absorb water" },
      { id: "C", text: "It turns leaves green" },
    ],
    correctAnswer: "A",
    hint: "Plants use sunlight as their primary energy source",
  },
  {
    id: 3,
    text: "Which part of the plant carries out photosynthesis?",
    options: [
      { id: "A", text: "Roots" },
      { id: "B", text: "Stem" },
      { id: "C", text: "Leaves" },
    ],
    correctAnswer: "C",
    hint: "Think about which part is usually green",
  },
  {
    id: 4,
    text: "What is the main product of photosynthesis?",
    options: [
      { id: "A", text: "Oxygen" },
      { id: "B", text: "Glucose" },
      { id: "C", text: "Carbon dioxide" },
    ],
    correctAnswer: "B",
    hint: "Plants produce their own food through photosynthesis",
  },
];

export default function MultipleChoiceQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowHint(answerId !== questions[currentQuestion].correctAnswer);
    if (answerId === questions[currentQuestion].correctAnswer) {
      setPoints((prev) => prev + 30);
    }
  };

  const handleContinue = () => {
    if (selectedAnswer) {
      setAnswers([...answers, selectedAnswer]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowHint(false);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowHint(false);
    }
  };

  if (showResults) {
    return (
      <div className="rounded-lg bg-white p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">Quiz Complete!</h2>
        <div className="mb-6 text-4xl font-bold text-purple-600">
          {points} points
        </div>
        <p className="mb-4 text-gray-600">
          You got{" "}
          {
            answers.filter(
              (answer, index) => answer === questions[index].correctAnswer
            ).length
          }{" "}
          out of {questions.length} questions correct
        </p>
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setPoints(0);
            setShowResults(false);
            setAnswers([]);
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 p-4">
          <button onClick={handleBack} className="p-2">
            <ArrowLeft className="h-5 w-5 text-purple-600" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <h2 className="text-sm text-gray-500">
              Question {currentQuestion + 1}
            </h2>
            <div className="flex gap-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-6 rounded-full",
                    index === currentQuestion
                      ? "bg-purple-600"
                      : index < currentQuestion
                      ? "bg-purple-300"
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <span>Goal: {30 * questions.length} points</span>
            <span>Current Points: {points}</span>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <h3 className="text-lg font-medium">
            Question {questions[currentQuestion].id}
          </h3>
          <p className="text-gray-600">{questions[currentQuestion].text}</p>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  selectedAnswer === option.id &&
                    option.id === questions[currentQuestion].correctAnswer &&
                    "border-green-500 bg-green-50",
                  selectedAnswer === option.id &&
                    option.id !== questions[currentQuestion].correctAnswer &&
                    "border-red-500 bg-red-50",
                  !selectedAnswer && "hover:bg-gray-50"
                )}
              >
                <span className="font-medium">{option.id}.</span> {option.text}
              </button>
            ))}
          </div>

          {showHint && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              <p className="text-sm">Think again!</p>
              <p className="text-xs">{questions[currentQuestion].hint}</p>
            </div>
          )}

          {selectedAnswer === questions[currentQuestion].correctAnswer && (
            <div className="rounded-lg bg-green-50 p-4 text-green-600">
              <p className="text-sm">Right!</p>
              <p className="text-xs">Great job! You got it correct.</p>
            </div>
          )}

          {selectedAnswer && (
            <button className="w-full bg-purple-600" onClick={handleContinue}>
              Continue
              <span className="ml-2">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
