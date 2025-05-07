import React, { useState } from "react";
import { FaArrowLeft, FaYoutube, FaSearch, FaSpinner, FaGlobe } from "react-icons/fa";
import "../index.css";
import FloatingObjects from "../components/FloatingObjects";

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [languageCode, setLanguageCode] = useState("en");
  const [isCheckingVideo, setIsCheckingVideo] = useState(false);
  const [subtitleInfo, setSubtitleInfo] = useState(null);

  // Common language options
  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" }
  ];

  // Sample videos known to have good captions
  const sampleVideos = [
    {
      title: "Khan Academy Math",
      url: "https://www.youtube.com/watch?v=NcoPn5j0owl",
      description: "Algebra basics"
    },
    {
      title: "Crash Course Computer Science",
      url: "https://www.youtube.com/watch?v=O5nskjZ_GoI",
      description: "Computer science basics"
    },
    {
      title: "TED-Ed History",
      url: "https://www.youtube.com/watch?v=fBq3nwQ_-TE",
      description: "History of the world"
    }
  ];

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

  // Fetch video transcript from the backend API with language support
  const fetchTranscript = async (videoId, langCode = "en") => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getTranscript?videoId=${videoId}&lang=${langCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }
      const data = await response.json();
      if (data.transcript) {
        return data.transcript;
      } else {
        throw new Error(data.error || "No transcript available");
      }
    } catch (error) {
      console.error("Error fetching transcript:", error);
      throw error;
    }
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
      // Get video info first
      const info = await fetchVideoInfo(extractedId);
      setVideoInfo(info);
      
      try {
        // Then try to get the transcript with selected language
        const text = await fetchTranscript(extractedId, languageCode);
        setTranscript(text);
        
        // Move to next step
        setStep(2);
      } catch (transcriptError) {
        console.error("Transcript error:", transcriptError);
        setErrorMessage(
          "Failed to retrieve video transcript. This could be because:\n" +
          "- The video doesn't have captions/subtitles\n" +
          "- The captions are not in a supported format\n" +
          "- The selected language is not available for this video\n" +
          "Please try another video with captions enabled or try a different language."
        );
      }
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

  const tryExampleVideo = (url) => {
    setVideoUrl(url);
    // Automatically submit the form with the selected URL
    const extractedId = extractVideoId(url);
    if (extractedId) {
      setVideoId(extractedId);
      setIsLoading(true);
      
      // Use the same process as handleSubmit but without the event
      (async () => {
        try {
          const info = await fetchVideoInfo(extractedId);
          setVideoInfo(info);
          
          try {
            const text = await fetchTranscript(extractedId, languageCode);
            setTranscript(text);
            setStep(2);
          } catch (error) {
            setErrorMessage(
              "Failed to retrieve video transcript. This could be because:\n" +
              "- The video doesn't have captions/subtitles\n" +
              "- The captions are not in a supported format\n" +
              "- The selected language is not available for this video\n" +
              "Please try another video with captions enabled or try a different language."
            );
          }
        } catch (error) {
          setErrorMessage("Failed to retrieve video information. Please try another video.");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  };

  // Format seconds to MM:SS
  const formatDuration = (duration) => {
    if (!duration) return "--:--";
    
    // Sample format: "15:42"
    return duration;
  };

  // Filter multi-line error messages for better display
  const formatErrorMessage = (message) => {
    if (!message) return "";
    
    // Convert newlines to HTML line breaks
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Check if a video has available subtitles
  const checkVideoSubtitles = async () => {
    if (!videoUrl) {
      setErrorMessage("Please enter a YouTube URL first");
      return;
    }
    
    const extractedId = extractVideoId(videoUrl);
    if (!extractedId) {
      setErrorMessage("Invalid YouTube URL. Please enter a valid YouTube video link.");
      return;
    }
    
    setIsCheckingVideo(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/debugSubtitles?videoId=${extractedId}`);
      
      if (!response.ok) {
        throw new Error("Failed to check video subtitles");
      }
      
      const data = await response.json();
      setSubtitleInfo(data);
      
      // Check if the video has subtitles
      const hasSubtitles = data.available_subtitles && 
        (data.available_subtitles.length > 0) && 
        !data.available_subtitles.some(sub => sub.message && sub.message.includes("has no"));
      
      if (hasSubtitles) {
        setErrorMessage("");
      } else {
        setErrorMessage("This video does not appear to have any subtitles/captions available. Please try another video.");
      }
    } catch (error) {
      console.error("Error checking video subtitles:", error);
      setErrorMessage("Failed to check video subtitles. Please try again.");
    } finally {
      setIsCheckingVideo(false);
    }
  };

  // Render step 1: Enter YouTube URL
  const renderUrlInput = () => (
    <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">YouTube Video to Quiz</h2>
      
      {errorMessage && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 mb-6">
          {formatErrorMessage(errorMessage)}
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

        <div className="mt-4 flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-300 text-sm hover:text-amber-400 flex items-center"
          >
            <FaGlobe className="mr-2" />
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>

          <button
            type="button"
            onClick={checkVideoSubtitles}
            disabled={isCheckingVideo}
            className="text-gray-300 text-sm hover:text-green-400 flex items-center"
          >
            {isCheckingVideo ? <FaSpinner className="animate-spin mr-2" /> : <FaYoutube className="mr-2" />}
            Check Video
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-3 bg-slate-800 rounded-lg p-4 border border-slate-600">
            <label className="block text-gray-300 mb-2 text-sm">Caption Language</label>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-gray-400 text-xs mt-2">
              If English captions aren't available, try selecting a different language.
              Not all videos have captions in all languages.
            </p>
          </div>
        )}

        {subtitleInfo && (
          <div className="mt-3 bg-green-400/10 border border-green-400/30 rounded-lg p-3 text-xs text-green-300 max-h-36 overflow-y-auto">
            <p className="font-medium">{subtitleInfo.video_title || 'Unknown title'}</p>
            <p className="mt-1 mb-2">Available subtitles:</p>
            <ul className="list-disc pl-5">
              {subtitleInfo.available_subtitles && subtitleInfo.available_subtitles.length > 0 ? (
                subtitleInfo.available_subtitles.map((sub, idx) => (
                  <li key={idx}>
                    {sub.language ? `${sub.language} (${sub.formats?.join(', ')})` : sub.message}
                  </li>
                ))
              ) : (
                <li>No subtitles available</li>
              )}
            </ul>
          </div>
        )}
      </form>
      
      <div className="mb-6">
        <h3 className="text-gray-300 text-sm mb-2">Try Example Videos:</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {sampleVideos.map((video, index) => (
            <button
              key={index}
              onClick={() => tryExampleVideo(video.url)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-sm p-2 rounded border border-slate-600 transition duration-200"
            >
              <div className="font-medium">{video.title}</div>
              <div className="text-gray-400 text-xs mt-1">{video.description}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="bg-red-500/20 p-2 rounded-full mr-3">
          <FaYoutube className="text-red-500" size={24} />
        </div>
        <p className="text-gray-300">
          Enter a YouTube video URL to automatically extract its transcript and generate quiz questions.
        </p>
      </div>
      
      <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 text-sm text-amber-200">
        <p className="font-medium mb-1">Best practices for video selection:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Select videos with clear narration and good audio quality</li>
          <li>Educational videos from channels like Khan Academy, Crash Course, and TED-Ed work well</li>
          <li>Verify that the video has English captions (either auto-generated or manual)</li>
          <li>Try shorter videos (5-15 minutes) for more focused quiz questions</li>
        </ul>
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
      <FloatingObjects />
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
            
            <div className="mt-4 bg-slate-800 rounded-lg p-4 text-yellow-300 text-sm">
              <p className="font-medium mb-1">Important Note:</p>
              <p>This feature uses the actual transcript/captions from the YouTube video to generate questions. The video must have captions available (either auto-generated or manually added) for this to work. Questions will be based directly on the content spoken in the video.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeQuiz; 