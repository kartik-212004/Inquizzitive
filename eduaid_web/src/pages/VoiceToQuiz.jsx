import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaMicrophone, FaStop, FaPause, FaPlay, FaRedo, FaSpinner, FaCheck } from "react-icons/fa";
import "../index.css";

const VoiceToQuiz = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle"); // idle, active, paused, stopped, processing, success
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy Difficulty");
  const [questionType, setQuestionType] = useState("mcq");
  const [confidence, setConfidence] = useState(100);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Simulating speech recognition with a mock function
  const mockTranscribeAudio = (audioBlob) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const mockTranscripts = [
          "The water cycle is the continuous movement of water within the Earth and atmosphere. It is a complex system that includes many different processes. Liquid water evaporates into water vapor, condenses to form clouds, and precipitates back to earth in the form of rain and snow. Water in the liquid state flows across land, into the ground, and eventually returns to the oceans.",
          "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the organisms' activities. This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water.",
          "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system.",
          "Human brain development is a complex, lifelong process. The brain begins forming very early in prenatal development. Neural connections form throughout life, but there are prime times when the brain is especially receptive to forming neural pathways. During these sensitive periods, the brain sets up the basic architecture of how information will be processed."
        ];
        
        // Randomly select one of the mock transcripts
        const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
        resolve(mockTranscripts[randomIndex]);
      }, 2000);
    });
  };

  useEffect(() => {
    // Start/stop the timer for recording duration
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    // Cleanup on unmount
    return () => {
      clearInterval(timerRef.current);
      
      // Clean up media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      
      // Clean up audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isRecording, isPaused, audioUrl]);

  const startRecording = async () => {
    setErrorMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Close mic access
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordingStatus("active");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Could not access your microphone. Please check your device permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      setRecordingStatus("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setRecordingStatus("active");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingStatus("stopped");
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setTranscript("");
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingStatus("idle");
    setIsReviewing(false);
  };

  const transcribeAudio = async () => {
    if (!audioBlob) {
      setErrorMessage("No recording to process.");
      return;
    }

    setIsProcessing(true);
    setRecordingStatus("processing");
    
    try {
      // In a real implementation, you would send the audioBlob to a server for transcription
      // For this hackathon demo, we'll use a mock function
      const transcribed = await mockTranscribeAudio(audioBlob);
      setTranscript(transcribed);
      setIsReviewing(true);
      setRecordingStatus("success");
    } catch (error) {
      console.error("Transcription error:", error);
      setErrorMessage("Failed to transcribe audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateQuiz = () => {
    if (!transcript) {
      setErrorMessage("Please record and transcribe audio first.");
      return;
    }
    
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
    
    // Redirect to the next page in the quiz creation flow
    window.location.href = "/text-input";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getRecordingStatusText = () => {
    switch (recordingStatus) {
      case "active":
        return "Recording...";
      case "paused":
        return "Recording paused";
      case "stopped":
        return "Recording complete";
      case "processing":
        return "Processing audio...";
      case "success":
        return "Transcription complete";
      default:
        return "Record your voice";
    }
  };

  const getRecordingStatusColor = () => {
    switch (recordingStatus) {
      case "active":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "processing":
        return "text-amber-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
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
        
        {/* Main Content */}
        <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Voice-to-Quiz Generator</h2>
          
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 mb-6">
              {errorMessage}
            </div>
          )}
          
          {isReviewing ? (
            // Transcript review section
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-3">Review Transcript</h3>
                <div className="bg-slate-800/80 p-4 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">{transcript}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Quiz Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Question Type</label>
                    <select 
                      className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                      className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                      className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Transcription Confidence</label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={confidence}
                        onChange={(e) => setConfidence(e.target.value)}
                        className="w-full accent-amber-400"
                      />
                      <span className="ml-2 text-white">{confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={resetRecording}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 rounded-lg transition duration-200"
                >
                  Record Again
                </button>
                <button
                  onClick={generateQuiz}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg transition duration-200"
                >
                  Generate Quiz
                </button>
              </div>
            </div>
          ) : (
            // Recording interface
            <div className="flex flex-col items-center">
              <div className={`text-center mb-6 ${getRecordingStatusColor()}`}>
                <p className="text-xl font-medium">
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" /> {getRecordingStatusText()}
                    </span>
                  ) : (
                    getRecordingStatusText()
                  )}
                </p>
                {isRecording && (
                  <p className="text-2xl font-bold mt-2">{formatTime(recordingTime)}</p>
                )}
              </div>
              
              <div className="w-48 h-48 rounded-full bg-slate-800/80 flex items-center justify-center mb-8 relative">
                {recordingStatus === "success" ? (
                  <FaCheck className="text-green-400" size={64} />
                ) : (
                  <div 
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording && !isPaused 
                        ? "bg-red-500 animate-pulse" 
                        : "bg-amber-400 hover:bg-amber-300"
                    }`}
                  >
                    {!isRecording ? (
                      <FaMicrophone 
                        className="text-slate-900" 
                        size={48} 
                        onClick={startRecording}
                      />
                    ) : isPaused ? (
                      <FaPlay 
                        className="text-slate-900" 
                        size={48} 
                        onClick={resumeRecording}
                      />
                    ) : (
                      <FaStop 
                        className="text-slate-900" 
                        size={48} 
                        onClick={stopRecording}
                      />
                    )}
                  </div>
                )}
                
                {isRecording && !isPaused && (
                  <button 
                    className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 w-12 h-12 rounded-full flex items-center justify-center transition duration-200"
                    onClick={pauseRecording}
                  >
                    <FaPause className="text-white" size={20} />
                  </button>
                )}
              </div>
              
              {audioUrl && (
                <div className="w-full mb-6">
                  <audio 
                    ref={audioRef}
                    src={audioUrl} 
                    controls 
                    className="w-full focus:outline-none"
                  />
                </div>
              )}
              
              {recordingStatus === "stopped" && (
                <div className="flex space-x-4 w-full">
                  <button
                    onClick={resetRecording}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <FaRedo className="mr-2" /> Record Again
                  </button>
                  <button
                    onClick={transcribeAudio}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg transition duration-200"
                  >
                    Transcribe Audio
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Info Section */}
        <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex">
              <span className="bg-amber-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
              <span>Record your voice explaining a concept or reading educational content</span>
            </li>
            <li className="flex">
              <span className="bg-amber-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
              <span>Our AI transcribes your speech into text automatically</span>
            </li>
            <li className="flex">
              <span className="bg-amber-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
              <span>Review the transcript and customize your quiz settings</span>
            </li>
            <li className="flex">
              <span className="bg-amber-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
              <span>Generate a quiz based on the transcribed content</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VoiceToQuiz; 