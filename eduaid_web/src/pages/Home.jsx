import React from "react";
import { FaFileAlt, FaChartBar, FaMicrophone, FaUsers, FaHistory, FaYoutube } from "react-icons/fa";
import "../index.css";

const Home = () => {
  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
              Inquiz
            </span>
            <span className="bg-gradient-to-r from-amber-300 to-white text-transparent bg-clip-text">
              zitive
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The ultimate AI-powered quiz generator. Create comprehensive quizzes from text, YouTube videos, or even your voice in seconds.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Text Quiz Generator */}
          <a 
            href="/question-type"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaFileAlt className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Text-to-Quiz</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Transform any text content into a comprehensive quiz. Paste text or upload documents to generate questions instantly.
            </p>
            <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-2 px-4 rounded-lg transition duration-200 mt-auto w-full">
              Create Quiz
            </button>
          </a>
          
          {/* Voice Quiz Generator */}
          <a 
            href="/voice-to-quiz"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaMicrophone className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Voice-to-Quiz</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Record your voice explaining a concept, and our AI will transcribe and generate a quiz from your speech.
            </p>
            <div className="bg-purple-500/20 text-purple-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3">
              NEW FEATURE
            </div>
            <button className="bg-purple-500 hover:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 w-full">
              Try Voice Input
            </button>
          </a>
          
          {/* YouTube Quiz Generator */}
          <a 
            href="/youtube-quiz"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-red-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaYoutube className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">YouTube-to-Quiz</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Generate quizzes directly from YouTube videos. Perfect for educational content and lecture videos.
            </p>
            <button className="bg-red-500 hover:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-auto w-full">
              YouTube Quiz
            </button>
          </a>
          
          {/* Collaborative Quiz */}
          <a 
            href="/collaborate"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Collaborative Quiz</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Create quizzes together with colleagues or classmates in real-time. Perfect for study groups and team projects.
            </p>
            <div className="bg-blue-500/20 text-blue-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3">
              NEW FEATURE
            </div>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 w-full">
              Collaborate
            </button>
          </a>
          
          {/* Previous Quizzes */}
          <a 
            href="/previous"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-green-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaHistory className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Quiz History</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Access your previously generated quizzes. Review, edit, or share quizzes you've created in the past.
            </p>
            <button className="bg-green-500 hover:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-auto w-full">
              View History
            </button>
          </a>
          
          {/* Analytics */}
          <a 
            href="/analytics"
            className="bg-slate-700/80 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:bg-slate-700 flex flex-col h-full"
          >
            <div className="bg-amber-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaChartBar className="text-amber-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Quiz Analytics</h3>
            <p className="text-gray-300 mb-6 flex-grow">
              Gain insights from your quiz creation patterns. Visualize your quiz activity and content with detailed analytics.
            </p>
            <div className="bg-amber-500/20 text-amber-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3">
              NEW FEATURE
            </div>
            <button className="bg-amber-500 hover:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 w-full">
              View Analytics
            </button>
          </a>
        </div>
        
        {/* Info Banner */}
        <div className="bg-slate-700/50 rounded-xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold text-white mb-3">Win That Hackathon!</h2>
              <p className="text-gray-300">
                This enhanced version of Inquizzitive offers multiple quiz generation methods, collaborative features, and analytics to make your project stand out. Perfect for educational institutions, students, and professionals.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 rounded-lg transition duration-200">
                Start Creating
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Inquizzitive - An AI-Powered Quiz Generator</p>
          <p className="mt-2 text-sm">Created for your college hackathon</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
