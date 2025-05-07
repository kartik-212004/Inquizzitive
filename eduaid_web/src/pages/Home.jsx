import React from "react";
import { FaFileAlt, FaChartBar, FaMicrophone, FaUsers, FaHistory, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../index.css";
import FloatingBooks from "../components/FloatingBooks";
import PageTransition from "../components/PageTransition";
import AnimatedElement from "../components/AnimatedElement";

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 10
      }
    }
  };

  const floatingVariants = {
    floating: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };

  const buttonHoverVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <PageTransition transitionType="fade">
      <motion.div 
        className="w-screen min-h-screen bg-slate-900 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-800/40 to-slate-950 opacity-70 fixed z-0"></div>
        
        {/* Floating Books Animation */}
        <FloatingBooks />
        
        {/* Main Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              animate="floating"
              variants={floatingVariants}
            >
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
                Inquiz
              </span>
              <span className="bg-gradient-to-r from-amber-300 to-white text-transparent bg-clip-text">
                zitive
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              The ultimate AI-powered quiz generator. Create comprehensive quizzes from text, YouTube videos, or even your voice in seconds.
            </motion.p>
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Quiz Generator */}
            <motion.div variants={itemVariants}>
              <Link to="/question-type">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(251 191 36)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-amber-400/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaFileAlt className="text-amber-400" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">Text-to-Quiz</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Transform any text content into a comprehensive quiz. Paste text or upload documents to generate questions instantly.
                  </p>
                  <motion.button 
                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-2 px-4 rounded-lg transition w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    Create Quiz
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Voice Quiz Generator */}
            <motion.div variants={itemVariants}>
              <Link to="/voice-to-quiz">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(168 85 247)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaMicrophone className="text-purple-400" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">Voice-to-Quiz</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Record your voice explaining a concept, and our AI will transcribe and generate a quiz from your speech.
                  </p>
                  <AnimatedElement
                    animationType="glow"
                    className="bg-purple-500/20 text-purple-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3"
                  >
                    NEW FEATURE
                  </AnimatedElement>
                  <motion.button 
                    className="bg-purple-500 hover:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    Try Voice Input
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* YouTube Quiz Generator */}
            <motion.div variants={itemVariants}>
              <Link to="/youtube-quiz">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(239 68 68)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-red-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaYoutube className="text-red-500" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">YouTube-to-Quiz</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Generate quizzes directly from YouTube videos. Perfect for educational content and lecture videos.
                  </p>
                  <motion.button 
                    className="bg-red-500 hover:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition mt-auto w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    YouTube Quiz
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Collaborative Quiz */}
            <motion.div variants={itemVariants}>
              <Link to="/collaborate">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(59 130 246)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaUsers className="text-blue-400" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">Collaborative Quiz</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Create quizzes together with colleagues or classmates in real-time. Perfect for study groups and team projects.
                  </p>
                  <AnimatedElement
                    animationType="glow"
                    className="bg-blue-500/20 text-blue-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3"
                  >
                    NEW FEATURE
                  </AnimatedElement>
                  <motion.button 
                    className="bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    Collaborate
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Previous Quizzes */}
            <motion.div variants={itemVariants}>
              <Link to="/previous">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(34 197 94)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-green-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaHistory className="text-green-400" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">Quiz History</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Access your previously generated quizzes. Review, edit, or share quizzes you've created in the past.
                  </p>
                  <motion.button 
                    className="bg-green-500 hover:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition mt-auto w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    View History
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Analytics */}
            <motion.div variants={itemVariants}>
              <Link to="/analytics">
                <motion.div 
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex flex-col h-full border border-slate-700 glass-dark"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    borderColor: "rgb(245 158 11)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedElement 
                    animationType="float" 
                    className="bg-amber-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  >
                    <FaChartBar className="text-amber-400" size={24} />
                  </AnimatedElement>
                  <h3 className="text-xl font-bold text-white mb-3">Quiz Analytics</h3>
                  <p className="text-gray-300 mb-6 flex-grow">
                    Gain insights from your quiz creation patterns. Visualize your quiz activity and content with detailed analytics.
                  </p>
                  <AnimatedElement
                    animationType="glow"
                    className="bg-amber-500/20 text-amber-300 text-xs font-medium py-1 px-3 rounded-full inline-block mb-3"
                  >
                    NEW FEATURE
                  </AnimatedElement>
                  <motion.button 
                    className="bg-amber-500 hover:bg-amber-400 text-white font-medium py-2 px-4 rounded-lg transition w-full"
                    variants={buttonHoverVariants}
                    whileHover="hover"
                  >
                    View Analytics
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Info Banner */}
          <motion.div 
            className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-8 mb-16 border border-slate-700 glass-dark"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
              borderColor: "rgb(251 191 36 / 0.5)"
            }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold text-white mb-3">Win That Hackathon!</h2>
                <p className="text-gray-300">
                  This enhanced version of Inquizzitive offers multiple quiz generation methods, collaborative features, and analytics to make your project stand out. Perfect for educational institutions, students, and professionals.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/question-type">
                  <motion.button 
                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-6 rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Start Creating
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <p>&copy; {new Date().getFullYear()} Inquizzitive - An AI-Powered Quiz Generator</p>
            <p className="mt-2 text-sm">Created for your college hackathon</p>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
};

export default Home;
