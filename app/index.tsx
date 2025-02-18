"use client";
import React, { useState } from "react";
import MultipleChoiceQuiz from "./multi-choice";
import DragDropQuiz from "./drag-drop";

const FrontPage = () => {
  const [activeTab, setActiveTab] = useState("multi-choice");

  return (
    <div className="md:space-y-20 space-y-10">
      <div className="flex flex-wrap mb-8 bg-gray-200 rounded-lg p-1">
        <button
          className={`flex-1 py-3 px-4 text-center rounded-md ${
            activeTab === "multi-choice"
              ? "bg-white text-purple-600 font-bold shadow"
              : "bg-transparent text-purple-900"
          } transition-colors duration-300`}
          onClick={() => setActiveTab("multi-choice")}
        >
          Multi Choice Questions
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center rounded-md ${
            activeTab === "drag-and-drop"
              ? "bg-white text-purple-600 font-bold shadow"
              : "bg-transparent text-purple-900"
          } transition-colors duration-300`}
          onClick={() => setActiveTab("drag-and-drop")}
        >
          Drag and Drop Questions
        </button>
      </div>
      <div>
        {activeTab === "multi-choice" && <MultipleChoiceQuiz />}
        {activeTab === "drag-and-drop" && <DragDropQuiz />}
      </div>
    </div>
  );
};

export default FrontPage;
