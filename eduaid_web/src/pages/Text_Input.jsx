import React, { useState, useRef, useEffect } from "react";
import "../index.css";
import { FaClipboard, FaArrowLeft, FaArrowRight, FaUpload, FaPlusCircle, FaMinusCircle, FaMicrophone, FaYoutube, FaDownload, FaMinus, FaPlus } from "react-icons/fa";
import Switch from "react-switch";

const Text_Input = () => {
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("Easy Difficulty");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [fileContent, setFileContent] = useState(null);
  const [docUrl, setDocUrl] = useState("");
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [inputSource, setInputSource] = useState("direct"); // "direct", "voice", "youtube"

  useEffect(() => {
    // Check if we're coming from voice input or YouTube transcription
    const voiceTranscript = localStorage.getItem("voiceTranscript");
    if (voiceTranscript) {
      setText(voiceTranscript);
      
      // Get other saved settings
      const savedNumQuestions = localStorage.getItem("numQuestions");
      if (savedNumQuestions) {
        setNumQuestions(parseInt(savedNumQuestions));
      }
      
      const savedDifficulty = localStorage.getItem("difficulty");
      if (savedDifficulty) {
        setDifficulty(savedDifficulty);
      }
      
      // Determine the source
      if (window.location.pathname.includes("voice")) {
        setInputSource("voice");
      } else if (window.location.pathname.includes("youtube")) {
        setInputSource("youtube");
      }
      
      // Clear localStorage to avoid reusing on refresh
      localStorage.removeItem("voiceTranscript");
    }
  }, []);

  const toggleSwitch = () => {
    setIsToggleOn((isToggleOn + 1) % 2);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setText(data.content || data.error);
      } catch (error) {
        console.error("Error uploading file:", error);
        setText("Error uploading file");
      }
    }
  };

  const handleSaveToLocalStorage = async () => {
    setLoading(true);

    if (docUrl) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/get_content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ document_url: docUrl }),
        });

        if (response.ok) {
          const data = await response.json();
          setDocUrl("");
          setText(data || "Error in retrieving");
        } else {
          console.error("Error retrieving Google Doc content");
          setText("Error retrieving Google Doc content");
        }
      } catch (error) {
        console.error("Error:", error);
        setText("Error retrieving Google Doc content");
      } finally {
        setLoading(false);
      }
    } else if (text) {
      localStorage.setItem("textContent", text);
      localStorage.setItem("difficulty", difficulty);
      localStorage.setItem("numQuestions", numQuestions);

      await sendToBackend(
        text,
        difficulty,
        localStorage.getItem("selectedQuestionType")
      );
    }
  };

  const incrementQuestions = () => {
    setNumQuestions((prev) => prev + 1);
  };

  const decrementQuestions = () => {
    setNumQuestions((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const getEndpoint = (difficulty, questionType) => {
    if (difficulty !== "Easy Difficulty") {
      if (questionType === "get_shortq") {
        return "get_shortq_hard";
      } else if (questionType === "get_mcq") {
        return "get_mcq_hard";
      }
    }
    return questionType;
  };

  const sendToBackend = async (data, difficulty, questionType) => {
    const endpoint = getEndpoint(difficulty, questionType);
    try {
      setLoading(true);
      
      // Prepare form data
      const formData = JSON.stringify({
        input_text: data,
        max_questions: numQuestions,
        use_mediawiki: isToggleOn,
      });

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("qaPairs", JSON.stringify(responseData));

        // Create a quiz details object
        const quizDetails = {
          title: `Quiz ${new Date().toLocaleString()}`,
          difficulty,
          numQuestions,
          date: new Date().toISOString(),
          text: data.substring(0, 200) + (data.length > 200 ? "..." : ""),
          qaPairs: responseData,
          selectedQuestionType: questionType,
          source: inputSource
        };

        // Save to previousQuizzes for the history page
        let previousQuizzes = JSON.parse(localStorage.getItem("previousQuizzes")) || [];
        previousQuizzes.push(quizDetails);
        // Limit to 20 quizzes
        if (previousQuizzes.length > 20) {
          previousQuizzes = previousQuizzes.slice(-20);
        }
        localStorage.setItem("previousQuizzes", JSON.stringify(previousQuizzes));

        window.location.href = "/output";
      } else {
        console.error("Backend request failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70">
          <div className="loader border-4 border-t-4 border-amber-400 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      {/* Central Content */}
      <div className={`relative z-10 flex flex-col w-full max-w-2xl px-6 py-8 mx-auto ${loading ? "pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-8">
          <a href="/question-type" className="text-gray-400 hover:text-amber-400 flex items-center">
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
        
        {/* Input Source Indicator */}
        {inputSource !== "direct" && (
          <div className="mb-6 bg-slate-700/80 p-4 rounded-lg">
            <div className="flex items-center">
              {inputSource === "voice" ? (
                <>
                  <FaMicrophone className="text-purple-400 mr-3" />
                  <div>
                    <p className="text-white font-medium">Voice Transcription</p>
                    <p className="text-gray-400 text-sm">This content was transcribed from your voice recording</p>
                  </div>
                </>
              ) : inputSource === "youtube" ? (
                <>
                  <FaYoutube className="text-red-500 mr-3" />
                  <div>
                    <p className="text-white font-medium">YouTube Transcript</p>
                    <p className="text-gray-400 text-sm">This content was extracted from a YouTube video</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
        
        {/* Main Instructions */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-medium mb-2">Input your content</h2>
          <p className="text-gray-300 text-lg">Enter text or upload a file</p>
        </div>
        
        {/* Text Input Area */}
        <div className="relative mb-6">
          <div className="absolute top-3 left-3 text-gray-400">
            <FaClipboard />
          </div>
          <textarea
            className="w-full h-40 bg-slate-700 text-white rounded-lg p-4 pl-10 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your content here..."
          />
        </div>
        
        <div className="text-center text-gray-400 text-sm mb-4">- OR -</div>
        
        {/* File Upload and Google Doc URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 mb-2">Upload File</label>
            <div className="flex items-center">
              <label className="flex-1 flex items-center justify-center bg-slate-700 text-gray-300 rounded-lg p-3 cursor-pointer hover:bg-slate-600 transition duration-200">
                <FaUpload className="mr-2" />
                <span>Browse Files</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.docx"
                  ref={fileInputRef}
                />
              </label>
            </div>
            {fileContent && (
              <p className="text-green-400 text-sm mt-2">
                File uploaded successfully!
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Google Doc URL</label>
            <div className="flex">
              <input
                type="text"
                className="flex-1 bg-slate-700 text-white rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Paste Google Doc URL"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
              <button
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 rounded-r-lg transition duration-200"
                onClick={handleSaveToLocalStorage}
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
        
        {/* Configuration Options */}
        <div className="bg-slate-700/80 rounded-xl p-6 mb-6">
          <h3 className="text-white font-medium mb-4">Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Number of Questions</label>
              <div className="flex">
                <button
                  className="bg-slate-600 text-white px-3 py-2 rounded-l-lg hover:bg-slate-500 transition duration-200"
                  onClick={decrementQuestions}
                >
                  <FaMinus />
                </button>
                <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-center min-w-[60px]">
                  {numQuestions}
                </div>
                <button
                  className="bg-slate-600 text-white px-3 py-2 rounded-r-lg hover:bg-slate-500 transition duration-200"
                  onClick={incrementQuestions}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Difficulty</label>
              <div className="flex space-x-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg transition duration-200 ${
                    difficulty === "Easy Difficulty"
                      ? "bg-amber-400 text-slate-900 font-medium"
                      : "bg-slate-600 text-white hover:bg-slate-500"
                  }`}
                  onClick={() => setDifficulty("Easy Difficulty")}
                >
                  Easy
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg transition duration-200 ${
                    difficulty === "Hard Difficulty"
                      ? "bg-amber-400 text-slate-900 font-medium"
                      : "bg-slate-600 text-white hover:bg-slate-500"
                  }`}
                  onClick={() => setDifficulty("Hard Difficulty")}
                >
                  Hard
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-300 mr-3">Use Wikipedia:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isToggleOn}
                  onChange={toggleSwitch}
                />
                <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg transition duration-200"
          onClick={handleSaveToLocalStorage}
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
};

export default Text_Input;
