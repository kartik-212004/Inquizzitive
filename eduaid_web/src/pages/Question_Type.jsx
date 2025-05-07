import React, { useState } from "react";
import "../index.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Question_Type = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSaveToLocalStorage = () => {
    if (selectedOption) {
      localStorage.setItem("selectedQuestionType", selectedOption);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6 mx-auto py-8">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-amber-400 flex items-center">
            <FaArrowLeft className="mr-2" /> Back
          </Link>
          
          <div className="text-3xl text-center font-bold">
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
              Inquiz
            </span>
            <span className="bg-gradient-to-r from-amber-300 to-white text-transparent bg-clip-text">
              zitive
            </span>
          </div>
          
          <div className="w-20"></div> {/* Empty div for flexbox alignment */}
        </div>
        
        {/* Main Text */}
        <div className="text-center mb-10">
          <h2 className="text-white text-2xl font-medium mb-2">What type of quiz do you want?</h2>
          <p className="text-gray-300 text-lg">Choose one option to continue</p>
        </div>
        
        {/* Option Buttons */}
        <div className="w-full space-y-3 mb-10">
          <div 
            onClick={() => handleOptionClick("get_shortq")}
            className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl transition duration-200 flex items-center cursor-pointer ${
              selectedOption === "get_shortq" ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
              selectedOption === "get_shortq" 
                ? "border-amber-400" 
                : "border-gray-400"
            }`}>
              {selectedOption === "get_shortq" && (
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              )}
            </div>
            <span className="text-lg">Short-Answer Type Questions</span>
          </div>
          
          <div 
            onClick={() => handleOptionClick("get_mcq")}
            className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl transition duration-200 flex items-center cursor-pointer ${
              selectedOption === "get_mcq" ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
              selectedOption === "get_mcq" 
                ? "border-amber-400" 
                : "border-gray-400"
            }`}>
              {selectedOption === "get_mcq" && (
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              )}
            </div>
            <span className="text-lg">Multiple Choice Questions</span>
          </div>
          
          <div 
            onClick={() => handleOptionClick("get_boolq")}
            className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl transition duration-200 flex items-center cursor-pointer ${
              selectedOption === "get_boolq" ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
              selectedOption === "get_boolq"
                ? "border-amber-400" 
                : "border-gray-400"
            }`}>
              {selectedOption === "get_boolq" && (
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              )}
            </div>
            <span className="text-lg">True/False Questions</span>
          </div>
          
          <div 
            onClick={() => handleOptionClick("get_problems")}
            className={`w-full bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl transition duration-200 flex items-center cursor-pointer ${
              selectedOption === "get_problems" ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border ${
              selectedOption === "get_problems" 
                ? "border-amber-400" 
                : "border-gray-400"
            }`}>
              {selectedOption === "get_problems" && (
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              )}
            </div>
            <span className="text-lg">All Questions</span>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="flex justify-center mt-4">
          {selectedOption ? (
            <Link to="/text-input">
              <button
                onClick={handleSaveToLocalStorage}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 px-8 rounded-full flex items-center transition duration-300"
              >
                Continue
                <FaArrowRight className="ml-2" />
              </button>
            </Link>
          ) : (
            <button
              onClick={() => alert("Please select a question type.")}
              className="bg-gray-500 text-white font-medium py-3 px-8 rounded-full flex items-center opacity-70 cursor-not-allowed"
              disabled
            >
              Continue
              <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Question_Type;
