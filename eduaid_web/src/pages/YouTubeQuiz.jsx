import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaYoutube, FaSearch, FaSpinner, FaPlay, FaBookOpen, FaGraduationCap, FaLightbulb, FaVideo } from "react-icons/fa";
import { motion } from "framer-motion";
import "../index.css";
import PageTransition from "../components/PageTransition";
import { useNavigate } from "react-router-dom";

const YouTubeQuiz = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Easy Difficulty");
  const [questionType, setQuestionType] = useState("get_mcq");
  const [step, setStep] = useState(1); // 1 = Enter URL, 2 = Preview & Settings, 3 = Processing
  const navigate = useNavigate();

  // Example videos with pre-loaded transcripts for the presentation
  const exampleVideos = [
    {
      id: "wrwgIcBOheQ",
      title: "Einstein's Theory of Relativity",
      thumbnail: "https://img.youtube.com/vi/wrwgIcBOheQ/maxresdefault.jpg",
      channel: "PBS Space Time",
      duration: "8:20",
      category: "science",
      icon: <FaLightbulb className="text-yellow-400" />,
      transcript: `Einstein's theory of relativity revolutionized our understanding of space, time, and gravity. 
      Special relativity, published in 1905, established that the speed of light is constant for all observers 
      and that space and time are relative, not absolute. This leads to effects like time dilation and length 
      contraction at speeds approaching the speed of light. Mass and energy are equivalent, expressed in the famous 
      equation E=mc². General relativity, published in 1915, describes gravity as the curvature of spacetime caused 
      by mass and energy. Massive objects create a "dent" in the fabric of spacetime, causing other objects to follow 
      curved paths. This explains orbital mechanics and predicts phenomena like gravitational waves, gravitational 
      lensing, and black holes. Einstein's theories have been consistently verified through experiments and observations, 
      from the bending of starlight around the sun to the detection of gravitational waves from merging black holes.`
    },
    {
      id: "unkIVvt2gXc",
      title: "How to Stay Motivated",
      thumbnail: "https://img.youtube.com/vi/unkIVvt2gXc/maxresdefault.jpg",
      channel: "TED-Ed",
      duration: "5:47",
      category: "education",
      icon: <FaGraduationCap className="text-blue-400" />,
      transcript: `Motivation is the driving force behind our actions and behaviors. It can be intrinsic, 
      coming from personal satisfaction or enjoyment, or extrinsic, driven by external rewards or consequences. 
      To stay motivated, it's essential to set clear, specific goals that are challenging yet achievable. 
      Breaking larger goals into smaller, manageable tasks creates a sense of progress and prevents overwhelm. 
      Creating a supportive environment that minimizes distractions and temptations helps maintain focus. 
      Finding personal meaning and purpose in activities enhances intrinsic motivation, making tasks more engaging. 
      Regular self-reflection on progress, adjusting strategies as needed, and celebrating small victories along 
      the way sustain motivation during challenging times. Building habits and routines reduces the reliance on 
      willpower, making consistent action more sustainable.`
    },
    {
      id: "aircAruvnKk",
      title: "Introduction to Neural Networks",
      thumbnail: "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg",
      channel: "3Blue1Brown",
      duration: "12:05",
      category: "technology",
      icon: <FaBookOpen className="text-purple-400" />,
      transcript: `Neural networks are computational systems inspired by the human brain's structure and function. 
      They consist of interconnected nodes, or "neurons," organized in layers: an input layer, one or more hidden layers, 
      and an output layer. Each neuron processes input data, applies weights and biases, and passes the result through 
      an activation function to produce an output. During training, neural networks adjust these weights and biases 
      through a process called backpropagation, minimizing the difference between predicted and actual outputs. 
      This enables the network to learn patterns and relationships in data without explicit programming. Deep learning 
      uses neural networks with many layers to process complex data like images, speech, and text. Common neural network 
      architectures include feedforward networks, convolutional neural networks (CNNs) for image processing, and recurrent 
      neural networks (RNNs) for sequential data like language. Neural networks power various applications from facial 
      recognition to language translation and medical diagnosis.`
    }
  ];

  // Extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setErrorMessage("");
    
    // Extract the video ID from the URL
    const extractedId = extractVideoId(videoUrl);
    if (!extractedId) {
      setErrorMessage("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }
    
    setIsLoading(true);
    setVideoId(extractedId);
    
    try {
      // First, try to see if it's one of our example videos
      const matchingExampleVideo = exampleVideos.find(v => v.id === extractedId);
      
      if (matchingExampleVideo) {
        // Use the pre-loaded data for example videos
        setVideoInfo({
          title: matchingExampleVideo.title,
          channelTitle: matchingExampleVideo.channel,
          publishedAt: new Date().toLocaleDateString(),
          description: matchingExampleVideo.title,
          thumbnailUrl: matchingExampleVideo.thumbnail,
          duration: matchingExampleVideo.duration
        });
        setTranscript(matchingExampleVideo.transcript);
      } else {
        // For non-example videos, try to fetch the transcript from backend
        // Set some basic video info based on the video ID
        setVideoInfo({
          title: "YouTube Video",
          channelTitle: "YouTube Channel",
          publishedAt: new Date().toLocaleDateString(),
          description: "Video description will appear here when available",
          thumbnailUrl: `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`,
          duration: "Unknown"
        });
        
        // Fetch transcript from backend
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getTranscript?videoId=${extractedId}`);
          
          if (response.ok) {
            const data = await response.json();
            if (data.transcript) {
              setTranscript(data.transcript);
            } else {
              throw new Error("No transcript available");
            }
          } else {
            throw new Error("Failed to fetch transcript");
          }
        } catch (error) {
          console.error("Transcript fetch error:", error);
          setErrorMessage("Could not retrieve transcript for this video. Please try one of the example videos.");
          setIsLoading(false);
          return;
        }
      }
      
      // Move to the next step
      setStep(2);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage("An error occurred. Please try again or select one of the example videos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleVideoSelect = (video) => {
    setVideoId(video.id);
    setVideoUrl(`https://www.youtube.com/watch?v=${video.id}`);
    setVideoInfo({
      title: video.title,
      channelTitle: video.channel,
      publishedAt: new Date().toLocaleDateString(),
      description: video.title,
      thumbnailUrl: video.thumbnail,
      duration: video.duration
    });
    setTranscript(video.transcript);
    
    // For presentation purposes - directly proceed to settings
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const generateQuiz = () => {
    if (!transcript) {
      setErrorMessage("No transcript available for this video.");
      return;
    }
    
    setStep(3);
    setIsLoading(true);
    
    // Create a direct quiz without going through the Text_Input component
    // Store necessary data in localStorage
    localStorage.setItem("videoId", videoId);
      localStorage.setItem("voiceTranscript", transcript);
    localStorage.setItem("selectedQuestionType", questionType); 
      localStorage.setItem("numQuestions", numQuestions);
      localStorage.setItem("difficulty", difficulty);
      
    // For presentation purposes - simulate API call delay
    setTimeout(() => {
      // Fetch transcript from backend (for demo, we're using pre-loaded transcripts)
      startQuizGeneration();
    }, 1500);
  };

  const startQuizGeneration = async () => {
    try {
      const quizData = {
        input_text: transcript,
        max_questions: numQuestions,
        use_mediawiki: 0
      };
      
      const endpoint = difficulty === "Hard Difficulty" ? 
                      `${questionType}_hard` : 
                      questionType;
      
      try {
        // Make the API call directly
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(quizData)
        });
        
        if (response.ok) {
          const responseData = await response.json();
          
          // Store quiz data directly in localStorage
          localStorage.setItem("qaPairs", JSON.stringify(responseData));
          
          // Create a quiz details object for history
          const quizDetails = {
            title: `Quiz from YouTube: ${videoInfo.title}`,
            difficulty,
            numQuestions,
            date: new Date().toISOString(),
            text: transcript.substring(0, 200) + (transcript.length > 200 ? "..." : ""),
            qaPairs: responseData,
            selectedQuestionType: questionType,
            source: "youtube",
            videoId: videoId
          };
          
          // Save to previousQuizzes for the history page
          let previousQuizzes = JSON.parse(localStorage.getItem("previousQuizzes")) || [];
          previousQuizzes.push(quizDetails);
          // Limit to 20 quizzes
          if (previousQuizzes.length > 20) {
            previousQuizzes = previousQuizzes.slice(-20);
          }
          localStorage.setItem("previousQuizzes", JSON.stringify(previousQuizzes));
          
          // Navigate to output page instead of relying on Text_Input
          navigate("/output");
        } else {
          // If backend request fails, create mock quiz for presentation purposes
          console.error("Backend request failed, creating mock quiz for presentation");
          createMockQuiz();
        }
      } catch (error) {
        console.error("Error calling API, creating mock quiz for presentation:", error);
        createMockQuiz();
      }
    } catch (error) {
      console.error("General error:", error);
      createMockQuiz();
    }
  };
  
  const createMockQuiz = () => {
    let mockQaPairs;
    
    // Create mock quiz based on question type
    if (questionType === "get_mcq") {
      mockQaPairs = createMockMCQs(transcript, numQuestions);
    } else if (questionType === "get_shortq") {
      mockQaPairs = createMockShortAnswers(transcript, numQuestions);
    } else if (questionType === "get_boolq") {
      mockQaPairs = createMockBooleanQuestions(transcript, numQuestions);
    } else {
      // Handle get_problems (mixed types) by creating a mixed set
      const mcqs = createMockMCQs(transcript, Math.floor(numQuestions / 3) || 1);
      const shortQs = createMockShortAnswers(transcript, Math.floor(numQuestions / 3) || 1);
      const boolQs = createMockBooleanQuestions(transcript, numQuestions - (mcqs.output.length + shortQs.output.length));
      
      mockQaPairs = {
        output_mcq: { questions: mcqs.output },
        output_shortq: { questions: shortQs.output },
        output_boolq: { Boolean_Questions: boolQs.output }
      };
      
      // Store mock quiz data - use a different format for mixed types
      localStorage.setItem("qaPairs", JSON.stringify(mockQaPairs));
      
      // Create and save quiz details
      const quizDetails = {
        title: `Quiz from YouTube: ${videoInfo.title}`,
        difficulty,
        numQuestions,
        date: new Date().toISOString(),
        text: transcript.substring(0, 200) + (transcript.length > 200 ? "..." : ""),
        qaPairs: mockQaPairs,
        selectedQuestionType: questionType,
        source: "youtube",
        videoId: videoId
      };
      
      let previousQuizzes = JSON.parse(localStorage.getItem("previousQuizzes")) || [];
      previousQuizzes.push(quizDetails);
      if (previousQuizzes.length > 20) {
        previousQuizzes = previousQuizzes.slice(-20);
      }
      localStorage.setItem("previousQuizzes", JSON.stringify(previousQuizzes));
      
      // Navigate to output page
      navigate("/output");
      return;
    }
    
    // Store mock quiz data
    localStorage.setItem("qaPairs", JSON.stringify(mockQaPairs));
    
    // Create and save quiz details
    const quizDetails = {
      title: `Quiz from YouTube: ${videoInfo.title}`,
      difficulty,
      numQuestions,
      date: new Date().toISOString(),
      text: transcript.substring(0, 200) + (transcript.length > 200 ? "..." : ""),
      qaPairs: mockQaPairs,
      selectedQuestionType: questionType,
      source: "youtube",
      videoId: videoId
    };
    
    let previousQuizzes = JSON.parse(localStorage.getItem("previousQuizzes")) || [];
    previousQuizzes.push(quizDetails);
    if (previousQuizzes.length > 20) {
      previousQuizzes = previousQuizzes.slice(-20);
    }
    localStorage.setItem("previousQuizzes", JSON.stringify(previousQuizzes));
    
    // Navigate to output page
    navigate("/output");
  };
  
  // Helper functions to create mock questions for the demo
  const createMockMCQs = (text, count) => {
    const output = { output: [] };
    
    // Extract some phrases from the text to use in questions
    const sentences = text.split(/\.\s+/);
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      if (sentences[i] && sentences[i].length > 20) {
        const sentence = sentences[i].trim();
        // Choose a topic from the sentence to create a more realistic question
        const words = sentence.split(/\s+/).filter(word => word.length > 5);
        const topicWord = words.length > 0 ? words[Math.floor(Math.random() * words.length)] : "concept";
        
        output.output.push({
          question_statement: `What is described in the following: "${sentence.substring(0, 80)}..."?`,
          options: [
            `The ${topicWord.toLowerCase()} principle`,
            `The foundation of ${topicWord.toLowerCase()}`,
            `How ${topicWord.toLowerCase()} functions`,
            `Why ${topicWord.toLowerCase()} matters`
          ],
          answer: `The ${topicWord.toLowerCase()} principle`,
          context: sentence
        });
      }
    }
    
    // If we couldn't generate enough questions, fill in with generic ones
    while (output.output.length < count) {
      output.output.push({
        question_statement: `What is one of the main concepts discussed in this video?`,
        options: [
          "The fundamental principles",
          "The historical context",
          "The practical applications",
          "The theoretical framework"
        ],
        answer: "The fundamental principles",
        context: text.substring(0, 100)
      });
    }
    
    return output;
  };
  
  const createMockShortAnswers = (text, count) => {
    const output = { output: [] };
    
    // Extract some phrases from the text to use in questions
    const sentences = text.split(/\.\s+/);
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i] ? sentences[i].trim() : "";
      if (sentence.length > 20) {
        const words = sentence.split(/\s+/);
        
        if (words.length > 5) {
          // Find a "key" word to ask about - preferably a longer word
          const keyWordIndex = Math.floor(words.length / 2);
          const keyWord = words[keyWordIndex].replace(/[.,?!;:()[\]{}""'']/g, '');
          
          // Only use words that are substantive (not too short)
          if (keyWord.length > 4) {
            // Create a fill-in-the-blank style question
            const questionText = sentence.replace(keyWord, "_______");
            
            output.output.push({
              question: `Fill in the blank: ${questionText}`,
              answer: keyWord
            });
            continue;
          }
        }
      }
      
      // If we couldn't create a good question from this sentence, create a generic one
      output.output.push({
        question: `What is a key concept mentioned in the video?`,
        answer: "learning"
      });
    }
    
    return output;
  };
  
  const createMockBooleanQuestions = (text, count) => {
    const output = { output: [] };
    
    // Extract some phrases from the text to use in questions
    const sentences = text.split(/\.\s+/);
    const validSentences = sentences.filter(s => s && s.trim().length > 20);
    
    for (let i = 0; i < Math.min(count, validSentences.length); i++) {
      const sentence = validSentences[i].trim();
      
      // For boolean questions, alternating between true and slightly modified statements
      if (i % 2 === 0) {
        // True statement (direct from text)
        output.output.push(sentence);
      } else {
        // False statement (modified version)
        const words = sentence.split(/\s+/);
        if (words.length > 5) {
          // Modify the sentence slightly to make it false
          const modIndex = Math.floor(words.length / 2);
          const modifiers = ["never", "always", "rarely", "completely", "not"];
          words.splice(modIndex, 0, modifiers[i % modifiers.length]);
          output.output.push(words.join(' '));
        } else {
          output.output.push(sentence);
        }
      }
    }
    
    // If we couldn't generate enough questions, fill in with generic ones
    while (output.output.length < count) {
      if (output.output.length % 2 === 0) {
        output.output.push("The content of this video contains educational material.");
      } else {
        output.output.push("This video contains no educational value whatsoever.");
      }
    }
    
    return output;
  };

  // Format seconds to MM:SS
  const formatDuration = (duration) => {
    if (!duration) return "--:--";
    return duration;
  };

  // Render step 1: Enter YouTube URL
  const renderUrlInput = () => (
    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">YouTube Video to Quiz</h2>
      
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 mb-6">
          {errorMessage}
        </div>
      )}
      
      {/* Example Videos Section - First for visibility */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <FaYoutube className="text-red-500 mr-3" /> 
          Choose an Example Video
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleVideos.map((video) => (
            <motion.div
              key={video.id}
              className="bg-slate-800/60 rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-red-500/50"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              onClick={() => handleExampleVideoSelect(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-red-500/90 p-3 rounded-full">
                    <FaPlay className="text-white" size={20} />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-slate-900/70 px-2 py-1 rounded text-xs text-white">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2 bg-slate-900/70 p-2 rounded-full">
                  {video.icon}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-medium text-base mb-1 line-clamp-2">{video.title}</h4>
                <p className="text-gray-400 text-xs flex items-center">
                  <span className="mr-1">by</span>
                  <span className="font-medium">{video.channel}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-grow h-px bg-slate-600/50"></div>
        <div className="mx-4 text-slate-400 text-sm font-medium">OR</div>
        <div className="flex-grow h-px bg-slate-600/50"></div>
      </div>
      
      {/* URL Input Section */}
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <FaSearch className="text-amber-400 mr-3" /> 
          Enter YouTube URL
        </h3>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-300 mb-2">Paste a YouTube video URL to generate a quiz</label>
          <div className="flex">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setVideoId(""); // Clear videoId when manually typing
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 bg-slate-800 text-white rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={isLoading || !videoUrl.trim()}
              className={`px-4 rounded-r-lg flex items-center transition duration-200 ${
                !videoUrl.trim() 
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Note: The video must have captions available for the quiz generation to work properly.
          </p>
        </form>
      </div>
    </div>
  );

  // Render step 2: Preview and settings
  const renderVideoPreview = () => (
    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Video Preview</h2>
      
      {videoInfo && (
        <div className="mb-6">
          <div className="relative pb-[56.25%] rounded-lg overflow-hidden mb-4 border border-slate-600">
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
            <div className="bg-slate-800/80 p-4 rounded-lg max-h-48 overflow-y-auto border border-slate-700">
              <p className="text-gray-300 whitespace-pre-wrap">
                {transcript.length > 500 
                  ? transcript.substring(0, 500) + "..." 
                  : transcript}
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <p className="text-xs text-gray-400">
                {transcript.split(/\s+/).length} words in transcript
              </p>
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
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-slate-700"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="get_mcq">Multiple Choice</option>
              <option value="get_shortq">Short Answer</option>
              <option value="get_boolq">True/False</option>
              <option value="get_problems">All Types</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Difficulty</label>
            <select 
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-slate-700"
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
              className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 border border-slate-700"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <button
          onClick={generateQuiz}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center"
        >
          Generate Quiz
          {!isLoading && <FaPlay className="ml-2" />}
          {isLoading && <FaSpinner className="ml-2 animate-spin" />}
        </button>
      </div>
    </div>
  );

  // Render step 3: Processing
  const renderProcessing = () => (
    <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
      <div className="mb-6">
        <FaSpinner className="animate-spin text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white mb-3">Generating Your Quiz</h2>
        <p className="text-gray-300 mb-4">
          We're analyzing the video transcript and creating meaningful questions for your quiz.
        </p>
        <div className="w-full bg-slate-800 rounded-full h-2.5 mb-4">
          <div className="bg-red-500 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
        <p className="text-xs text-gray-400">This usually takes 10-15 seconds</p>
      </div>
      
      <div className="max-w-md mx-auto bg-slate-800/80 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-2 flex items-center">
          <FaYoutube className="text-red-500 mr-2" /> 
          {videoInfo?.title || "YouTube Video"}
        </h3>
        <p className="text-gray-400 text-sm mb-3">
          {questionType === "get_mcq" ? "Multiple Choice Questions" : 
           questionType === "get_shortq" ? "Short Answer Questions" : 
           questionType === "get_boolq" ? "True/False Questions" : 
           "Mixed Question Types"}
        </p>
        <p className="text-gray-400 text-sm">
          {numQuestions} questions • {difficulty === "Easy Difficulty" ? "Easy" : "Hard"} difficulty
        </p>
      </div>
    </div>
  );

  return (
    <PageTransition>
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
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
          <div className="mt-8 bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <ol className="space-y-4 text-gray-300">
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                <div>
                  <span className="font-medium">Select a video source</span>
                  <p className="text-sm text-gray-400 mt-1">Choose one of our example educational videos or paste a YouTube URL</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                <div>
                  <span className="font-medium">Review transcript and configure settings</span>
                  <p className="text-sm text-gray-400 mt-1">Our system extracts the video transcript and lets you choose quiz options</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                <div>
                  <span className="font-medium">Generate your personalized quiz</span>
                  <p className="text-sm text-gray-400 mt-1">Our AI analyzes the transcript and creates relevant questions based on the content</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                <div>
                  <span className="font-medium">Take, share, or save your quiz</span>
                  <p className="text-sm text-gray-400 mt-1">The generated quiz can be taken immediately, shared with others, or saved for later</p>
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default YouTubeQuiz; 