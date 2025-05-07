import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaEye, FaClock } from "react-icons/fa";
import "../index.css";

const Previous = () => {
  const [previousQuizzes, setPreviousQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const previousStoredQuizzes = JSON.parse(
      localStorage.getItem("previousQuizzes")
    );
    if (previousStoredQuizzes) {
      setPreviousQuizzes(previousStoredQuizzes);
    }
  }, []);

  const getFormattedDate = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  const loadQuiz = (index) => {
    const selectedQuiz = previousQuizzes[index];
    localStorage.setItem("qaPairs", JSON.stringify(selectedQuiz.qaPairs));
    localStorage.setItem(
      "selectedQuestionType",
      selectedQuiz.selectedQuestionType
    );
    navigate("/output");
  };

  const deleteQuiz = (index) => {
    const updatedQuizzes = [...previousQuizzes];
    updatedQuizzes.splice(index, 1);
    setPreviousQuizzes(updatedQuizzes);
    localStorage.setItem("previousQuizzes", JSON.stringify(updatedQuizzes));
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <a href="/" className="text-gray-400 hover:text-amber-400 flex items-center">
            <FaArrowLeft className="mr-2" /> Back
          </a>
          
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
        
        {/* Main Content Title */}
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-medium mb-2">Previous Quizzes</h2>
          <p className="text-gray-300 text-lg">
            {previousQuizzes.length === 0 
              ? "No previous quizzes found" 
              : `${previousQuizzes.length} saved quiz${previousQuizzes.length > 1 ? 'zes' : ''}`}
          </p>
        </div>
        
        {/* Previous Quizzes List */}
        {previousQuizzes.length > 0 ? (
          <div className="space-y-4 mb-10">
            {previousQuizzes.map((quiz, index) => {
              const questionCount = Object.values(quiz.qaPairs).reduce((total, current) => {
                if (Array.isArray(current)) {
                  return total + current.length;
                } else if (current.questions) {
                  return total + current.questions.length;
                } else if (current.Boolean_Questions) {
                  return total + current.Boolean_Questions.length;
                }
                return total;
              }, 0);
              
              return (
                <div
                  key={index}
                  className="bg-slate-700 rounded-lg shadow-lg transition-all duration-200 hover:shadow-amber-400/10 hover:translate-y-[-2px]"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white text-lg font-medium">
                          {quiz.title || `Quiz ${index + 1}`}
                        </h3>
                        <div className="text-gray-400 text-sm flex items-center mt-1">
                          <FaClock className="mr-1" /> {getFormattedDate(quiz.date)}
                        </div>
                      </div>
                      <div className="bg-amber-400/20 text-amber-300 font-medium rounded-full px-3 py-1 text-sm">
                        {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                      </div>
                    </div>
                    
                    <div className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {quiz.text && quiz.text.substring(0, 150)}
                      {quiz.text && quiz.text.length > 150 ? "..." : ""}
                    </div>
                    
                    <div className="flex space-x-3 mt-2">
                      <button
                        onClick={() => loadQuiz(index)}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white rounded-md py-2 flex items-center justify-center transition duration-200"
                      >
                        <FaEye className="mr-2 text-amber-400" /> View
                      </button>
                      <button
                        onClick={() => deleteQuiz(index)}
                        className="flex items-center justify-center px-3 py-2 bg-slate-600 hover:bg-red-500/80 text-white rounded-md transition duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 text-center">
            <p className="text-gray-300 mb-4">You haven't created any quizzes yet.</p>
            <a
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg transition duration-200"
            >
              Create Your First Quiz
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Previous;
