"use client";

import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Term {
  id: string;
  text: string;
  definition: string;
}

const questions = [
  {
    id: 1,
    title: "Match the Mathematical Terms!",
    terms: [
      {
        id: "variable",
        text: "Variable",
        definition: "A symbol that represents an unknown value",
      },
      {
        id: "constant",
        text: "Constant",
        definition: "A fixed number that doesn't change",
      },
      {
        id: "expression",
        text: "Expression",
        definition: "A combination of numbers, variables and operations",
      },
      {
        id: "equation",
        text: "Equation",
        definition: "A statement that shows two expressions are equal",
      },
    ],
  },
  {
    id: 2,
    title: "Match the Scientific Method Steps!",
    terms: [
      {
        id: "hypothesis",
        text: "Hypothesis",
        definition: "An educated guess about how something works",
      },
      {
        id: "observation",
        text: "Observation",
        definition: "Gathering information using your senses",
      },
      {
        id: "experiment",
        text: "Experiment",
        definition: "A test to verify or disprove a hypothesis",
      },
      {
        id: "conclusion",
        text: "Conclusion",
        definition: "A summary of what was learned from the experiment",
      },
    ],
  },
  {
    id: 3,
    title: "Match the Grammar Terms!",
    terms: [
      {
        id: "noun",
        text: "Noun",
        definition: "A person, place, thing, or idea",
      },
      {
        id: "verb",
        text: "Verb",
        definition: "An action or state of being",
      },
      {
        id: "adjective",
        text: "Adjective",
        definition: "A word that describes a noun",
      },
      {
        id: "adverb",
        text: "Adverb",
        definition: "A word that modifies a verb or adjective",
      },
    ],
  },
  {
    id: 4,
    title: "Match the Science Concepts!",
    terms: [
      {
        id: "atom",
        text: "Atom",
        definition: "The smallest unit of matter",
      },
      {
        id: "molecule",
        text: "Molecule",
        definition: "Two or more atoms bonded together",
      },
      {
        id: "element",
        text: "Element",
        definition: "A pure substance made of one type of atom",
      },
      {
        id: "compound",
        text: "Compound",
        definition: "A substance made of different elements combined",
      },
    ],
  },
];

interface DraggableTermProps {
  term: Term;
  isDropped?: boolean;
}

function DraggableItem({ term, isDropped }: DraggableTermProps) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "term",
      item: term,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [term]
  );

  return (
    <div
      ref={drag}
      className={cn(
        "cursor-move rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-opacity",
        isDropped && "opacity-50"
      )}
      style={{ opacity }}
    >
      {term.text}
    </div>
  );
}

interface DropTargetProps {
  definition: string;
  onDrop: (item: Term) => void;
  isCorrect?: boolean;
  isWrong?: boolean;
  droppedTerm?: Term | null;
}

function DropTarget({
  definition,
  onDrop,
  isCorrect,
  isWrong,
  droppedTerm,
}: DropTargetProps) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "term",
      drop: (item: Term) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[80px] rounded-lg border-2 border-dashed p-4 transition-colors",
        isOver && "border-purple-500 bg-purple-50",
        isCorrect && "border-green-500 bg-green-50",
        isWrong && "border-red-500 bg-red-50",
        !droppedTerm && "border-gray-200"
      )}
    >
      <p className="mb-2 text-sm text-gray-600">{definition}</p>
      {droppedTerm && (
        <div
          className={cn(
            "inline-block rounded-lg px-3 py-1 text-sm",
            isCorrect
              ? "bg-green-100 text-green-700"
              : isWrong
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          )}
        >
          {droppedTerm.text}
        </div>
      )}
    </div>
  );
}

export default function DragDropQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [droppedTerms, setDroppedTerms] = useState<{
    [key: string]: Term | null;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleDrop = (definition: string, item: Term) => {
    setDroppedTerms((prev) => ({
      ...prev,
      [definition]: item,
    }));
  };

  const handleReset = () => {
    setDroppedTerms({});
  };

  const isCorrectMatch = (definition: string, term: Term | null) => {
    if (!term) return false;
    return (
      questions[currentQuestion].terms.find((t) => t.definition === definition)
        ?.id === term.id
    );
  };

  const handleContinue = () => {
    const correctAnswers = Object.entries(droppedTerms).filter(
      ([definition, term]) => isCorrectMatch(definition, term)
    );
    setScore((prev) => prev + correctAnswers.length * 25);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setDroppedTerms({});
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="rounded-lg bg-white p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">Quiz Complete!</h2>
        <div className="mb-6 text-4xl font-bold text-purple-600">
          {score} points
        </div>
        <p className="mb-4 text-gray-600">
          Maximum possible score: {questions.length * 100}
        </p>
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setDroppedTerms({});
            setScore(0);
            setShowResults(false);
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="rounded-lg bg-white">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <button className="p-2">
                <ArrowLeft className="h-5 w-5 text-purple-600" />
              </button>
              <h2 className="text-sm font-medium">
                Question {currentQuestion + 1}
              </h2>
            </div>
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

          <div className="space-y-4 p-4">
            <h3 className="mb-6 text-lg font-medium">
              {questions[currentQuestion].title}
            </h3>

            <div className="space-y-4">
              {questions[currentQuestion].terms.map((term) => (
                <DropTarget
                  key={term.definition}
                  definition={term.definition}
                  onDrop={(item) => handleDrop(term.definition, item)}
                  isCorrect={isCorrectMatch(
                    term.definition,
                    droppedTerms[term.definition]
                  )}
                  isWrong={
                    droppedTerms[term.definition] &&
                    !isCorrectMatch(
                      term.definition,
                      droppedTerms[term.definition]
                    )
                  }
                  droppedTerm={droppedTerms[term.definition]}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {questions[currentQuestion].terms.map((term) => (
                <DraggableItem
                  key={term.id}
                  term={term}
                  isDropped={Object.values(droppedTerms).some(
                    (t) => t?.id === term.id
                  )}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleContinue}
                disabled={
                  Object.keys(droppedTerms).length !==
                  questions[currentQuestion].terms.length
                }
              >
                Continue
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
