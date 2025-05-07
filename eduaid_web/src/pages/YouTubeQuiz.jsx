import React, { useState } from "react";
import { FaArrowLeft, FaYoutube, FaSearch, FaSpinner } from "react-icons/fa";
import "../index.css";

const YouTubeQuiz = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy Difficulty");
  const [questionType, setQuestionType] = useState("mcq");
  const [step, setStep] = useState(1); // 1 = Enter URL, 2 = Preview & Settings, 3 = Processing

  // Extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Mock function to fetch video info
  const fetchVideoInfo = async (videoId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockVideoData = {
          title: "Understanding Neural Networks",
          channelTitle: "Tech Educational Channel",
          publishedAt: "2023-03-15",
          description: "Learn about the fundamentals of neural networks and how they power modern AI systems.",
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: "15:42"
        };
        resolve(mockVideoData);
      }, 1000);
    });
  };

  // Mock function to fetch video transcript
  const fetchTranscript = async (videoId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sample transcript text
        const transcripts = [
          `Neural networks are a series of algorithms that mimic the operations of a human brain to recognize relationships between vast amounts of data. They are a form of machine learning that uses interconnected nodes or neurons in a layered structure resembling the human brain. 
          
          A neural network contains layers of interconnected nodes. Each node is a perceptron and is similar to a multiple linear regression. The perceptron feeds the signal produced by a multiple linear regression into an activation function that may be nonlinear.
          
          In a simple neural network, there are three types of layers: the input layer, hidden layers, and the output layer. The input layer receives the input data, the hidden layers process the data, and the output layer produces the result.`,
          
          `Computer vision is a field of artificial intelligence that trains computers to interpret and understand the visual world. Using digital images from cameras and videos and deep learning models, machines can accurately identify and classify objects and then react to what they "see."
          
          The field of computer vision has made tremendous advances in recent years through the use of convolutional neural networks (CNNs). CNNs are designed to automatically and adaptively learn spatial hierarchies of features from images.
          
          Some common applications of computer vision include image classification, object detection, image segmentation, and facial recognition. These technologies are now embedded in everything from autonomous vehicles to medical diagnostics.`,

          `Natural Language Processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data.
          
          The goal of NLP is to develop techniques that allow computers to understand and generate human language in a way that is both meaningful and useful. This includes tasks such as language translation, sentiment analysis, speech recognition, and text summarization.
          
          Modern NLP systems use deep learning approaches, particularly transformer-based models like BERT and GPT, which have revolutionized the field by allowing for more nuanced language understanding and generation.`
        ];
        
        // Randomly select one transcript
        const randomIndex = Math.floor(Math.random() * transcripts.length);
        resolve(transcripts[randomIndex]);
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    const extractedId = extractVideoId(videoUrl);
    if (!extractedId) {
      setErrorMessage("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }
    
    setIsLoading(true);
    setVideoId(extractedId);
    
    try {
      // In a real implementation, these would be actual API calls
      const info = await fetchVideoInfo(extractedId);
      setVideoInfo(info);
      
      const text = await fetchTranscript(extractedId);
      setTranscript(text);
      
      // Move to next step
      setStep(2);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setErrorMessage("Failed to retrieve video information. Please try another video.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = () => {
    if (!transcript) {
      setErrorMessage("No transcript available for this video.");
      return;
    }
    
    setStep(3);
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Save transcript to localStorage for the next page
      localStorage.setItem("voiceTranscript", transcript);
      localStorage.setItem("numQuestions", numQuestions);
      localStorage.setItem("difficulty", difficulty);
      
      // Map question type selection to backend endpoint
      const questionTypeMap = {
        "mcq": "get_mcq",
        "shortanswer": "get_shortq",
        "boolean": "get_boolq",
        "all": "get_problems"
      };
      
      localStorage.setItem("selectedQuestionType", questionTypeMap[questionType]);
      
      // Redirect to the text input page with the transcript
      window.location.href = "/text-input";
    }, 2000);
  };

  // Format seconds to MM:SS
  const formatDuration = (duration) => {
    if (!duration) return "--:--";
    
    // Sample format: "15:42"
    return duration;
  };

  // Render step 1: Enter YouTube URL
  const renderUrlInput = () => (
    <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">YouTube Video to Quiz</h2>
      
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 mb-6">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-gray-300 mb-2">Enter YouTube Video URL</label>
        <div className="flex">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 bg-slate-800 text-white rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-r-lg flex items-center transition duration-200"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
        </div>
      </form>
      
      <div className="flex items-center">
        <div className="bg-red-500/20 p-2 rounded-full mr-3">
          <FaYoutube className="text-red-500" size={24} />
        </div>
        <p className="text-gray-300">
          Enter a YouTube video URL to automatically extract its transcript and generate quiz questions.
        </p>
      </div>
    </div>
  );

  // Render step 2: Preview and settings
  const renderVideoPreview = () => (
    <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Video Preview</h2>
      
      {videoInfo && (
        <div className="mb-6">
          <div className="relative pb-[56.25%] rounded-lg overflow-hidden mb-4">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={videoInfo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{videoInfo.title}</h3>
          <div className="flex items-center text-gray-400 mb-4">
            <span>{videoInfo.channelTitle}</span>
            <span className="mx-2">•</span>
            <span>{formatDuration(videoInfo.duration)}</span>
          </div>
          
          <div className="mb-4">
            <h4 className="text-lg font-medium text-white mb-2">Transcript Preview</h4>
            <div className="bg-slate-800/80 p-4 rounded-lg max-h-40 overflow-y-auto">
              <p className="text-gray-300 whitespace-pre-wrap">{transcript.substring(0, 300)}...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-3">Quiz Settings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Question Type</label>
            <select 
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="mcq">Multiple Choice</option>
              <option value="shortanswer">Short Answer</option>
              <option value="boolean">True/False</option>
              <option value="all">All Types</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Difficulty</label>
            <select 
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy Difficulty">Easy</option>
              <option value="Hard Difficulty">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Number of Questions</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Back
        </button>
        <button
          onClick={generateQuiz}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );

  // Render step 3: Processing
  const renderProcessing = () => (
    <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg text-center">
      <FaSpinner className="animate-spin text-red-500 mx-auto mb-4" size={48} />
      <h2 className="text-2xl font-bold text-white mb-3">Generating Your Quiz</h2>
      <p className="text-gray-300">
        We're analyzing the video transcript and creating meaningful questions for your quiz.
      </p>
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <a href="/" className="text-gray-400 hover:text-red-400 flex items-center">
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
        
        {/* Main Content */}
        {step === 1 && renderUrlInput()}
        {step === 2 && renderVideoPreview()}
        {step === 3 && renderProcessing()}
        
        {step === 1 && (
          <div className="mt-8 bg-slate-700/80 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                <span>Enter a YouTube video URL (educational content works best)</span>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                <span>Our system extracts and analyzes the video transcript</span>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                <span>Configure quiz settings and generate your questions</span>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                <span>Share, export, or save your quiz for later use</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeQuiz; 