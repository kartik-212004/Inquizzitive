import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUsers,
  FaCopy,
  FaLock,
  FaCheck,
  FaPlus,
  FaUserCircle,
} from "react-icons/fa";
import "../index.css";

const Collaborate = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [sessionName, setSessionName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [localSession, setLocalSession] = useState(null);

  useEffect(() => {
    // Get user's saved name from localStorage if available
    const savedName = localStorage.getItem("collaborateUserName");
    if (savedName) {
      setDisplayName(savedName);
    }

    // Check if there's an active local session
    const storedSession = localStorage.getItem("currentCollaborativeSession");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setLocalSession(sessionData);
      } catch (e) {
        localStorage.removeItem("currentCollaborativeSession");
      }
    }
  }, []);

  const handleCreateSession = async () => {
    // Validate input
    if (!sessionName.trim()) {
      setErrorMessage("Please enter a session name");
      return;
    }
    if (!displayName.trim()) {
      setErrorMessage("Please enter your display name");
      return;
    }

    setIsCreatingSession(true);
    setErrorMessage("");

    try {
      // Instead of real API call, we'll simulate with a local implementation for the hackathon
      // In a real implementation, this would create a session on the server
      setTimeout(() => {
        // Generate a random 6-character code
        const generatedId = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        // Create a session object
        const sessionData = {
          id: generatedId,
          name: sessionName,
          createdBy: displayName,
          createdAt: new Date().toISOString(),
          participants: [
            {
              id: "host-" + Math.random().toString(36).substring(2, 9),
              name: displayName,
              isHost: true,
              joinedAt: new Date().toISOString(),
            },
          ],
          quizzes: [],
        };

        // Save session data to localStorage (would normally be on server)
        localStorage.setItem(
          "currentCollaborativeSession",
          JSON.stringify(sessionData)
        );
        localStorage.setItem(
          "collaborativeSessionsList",
          JSON.stringify([
            ...(JSON.parse(localStorage.getItem("collaborativeSessionsList")) ||
              []),
            {
              id: sessionData.id,
              name: sessionData.name,
              createdAt: sessionData.createdAt,
            },
          ])
        );

        // Save user name for future use
        localStorage.setItem("collaborateUserName", displayName);

        // Update state
        setSessionId(generatedId);
        setSessionCreated(true);
        setLocalSession(sessionData);
        setParticipants(sessionData.participants);

        setIsCreatingSession(false);
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to create session. Please try again.");
      setIsCreatingSession(false);
    }
  };

  const handleJoinSession = async () => {
    // Validate input
    if (!joinCode.trim()) {
      setErrorMessage("Please enter a session code");
      return;
    }
    if (!displayName.trim()) {
      setErrorMessage("Please enter your display name");
      return;
    }

    setIsJoiningSession(true);
    setErrorMessage("");

    try {
      // In a real implementation, this would check if the session exists on the server
      // For now, we'll simulate checking for an existing session
      setTimeout(() => {
        // This is just for demo/hackathon purposes
        // In a real app, we would verify this code against a database

        // Create a simulated session if the user entered the "demo" code
        if (joinCode.toUpperCase() === "DEMO12") {
          const sessionData = {
            id: "DEMO12",
            name: "Demo Collaboration Session",
            createdBy: "Instructor Demo",
            createdAt: new Date().toISOString(),
            participants: [
              {
                id: "host-demo",
                name: "Instructor Demo",
                isHost: true,
                joinedAt: new Date(Date.now() - 3600000).toISOString(),
              },
              {
                id: "user-" + Math.random().toString(36).substring(2, 9),
                name: displayName,
                isHost: false,
                joinedAt: new Date().toISOString(),
              },
            ],
            quizzes: [],
          };

          localStorage.setItem(
            "currentCollaborativeSession",
            JSON.stringify(sessionData)
          );
          localStorage.setItem("collaborateUserName", displayName);

          setLocalSession(sessionData);
          setParticipants(sessionData.participants);
          setSessionCreated(true);
          setIsJoiningSession(false);
          return;
        }

        setErrorMessage(
          "Session not found. Please check the code and try again."
        );
        setIsJoiningSession(false);
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to join session. Please try again.");
      setIsJoiningSession(false);
    }
  };

  const copySessionCode = () => {
    navigator.clipboard
      .writeText(sessionId) // ✅ Correct method for copying text
      .then(() => {
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const exitSession = () => {
    localStorage.removeItem("currentCollaborativeSession");
    setLocalSession(null);
    setSessionCreated(false);
    setParticipants([]);
    setSessionId("");
  };

  const renderSessionDetails = () => {
    if (!localSession) return null;

    return (
      <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {localSession.name}
          </h3>
          <div className="flex items-center space-x-3">
            <span className="bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full flex items-center">
              <FaLock className="mr-1" size={12} /> Session Code:{" "}
              {localSession.id}
            </span>
            <button
              onClick={copySessionCode}
              className="bg-slate-600 hover:bg-slate-500 text-white text-sm px-3 py-1 rounded-full flex items-center transition duration-200"
            >
              {copiedToClipboard ? (
                <FaCheck className="mr-1" size={12} />
              ) : (
                <FaCopy className="mr-1" size={12} />
              )}
              {copiedToClipboard ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-white mb-3">
            Participants ({localSession.participants.length})
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {localSession.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center bg-slate-800 rounded-lg p-3"
              >
                <FaUserCircle className="text-amber-400 mr-3" size={24} />
                <div>
                  <p className="text-white font-medium">{participant.name}</p>
                  <p className="text-gray-400 text-sm">
                    {participant.isHost ? "Host" : "Participant"} • Joined{" "}
                    {new Date(participant.joinedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <a
            href="/question-type"
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg flex items-center justify-center transition duration-200"
          >
            <FaPlus className="mr-2" /> Create Quiz Together
          </a>
          <button
            onClick={exitSession}
            className="bg-slate-600 hover:bg-red-500/80 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Exit Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <a
            href="/"
            className="text-gray-400 hover:text-amber-400 flex items-center"
          >
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
        <div className="bg-slate-700/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <FaUsers className="text-amber-400 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-white">
              Collaborative Quiz Mode
            </h2>
          </div>

          {localSession ? (
            // Already in a session, show session details
            renderSessionDetails()
          ) : (
            // Not in a session, show create/join tabs
            <>
              <div className="bg-slate-800/50 rounded-lg flex mb-6">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`flex-1 py-3 text-center rounded-lg transition ${
                    activeTab === "create"
                      ? "bg-amber-400 text-slate-900 font-medium"
                      : "text-white hover:bg-slate-700"
                  }`}
                >
                  Create Session
                </button>
                <button
                  onClick={() => setActiveTab("join")}
                  className={`flex-1 py-3 text-center rounded-lg transition ${
                    activeTab === "join"
                      ? "bg-amber-400 text-slate-900 font-medium"
                      : "text-white hover:bg-slate-700"
                  }`}
                >
                  Join Session
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg p-3 mb-6">
                  {errorMessage}
                </div>
              )}

              {activeTab === "create" ? (
                <>
                  {sessionCreated ? (
                    // Session created successfully
                    renderSessionDetails()
                  ) : (
                    // Show create session form
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">
                          Session Name
                        </label>
                        <input
                          type="text"
                          value={sessionName}
                          onChange={(e) => setSessionName(e.target.value)}
                          placeholder="Enter a name for your quiz session"
                          className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2">
                          Your Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <button
                        onClick={handleCreateSession}
                        disabled={isCreatingSession}
                        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg mt-4 transition duration-200 flex items-center justify-center"
                      >
                        {isCreatingSession ? (
                          <>
                            <div className="mr-2 w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            Creating...
                          </>
                        ) : (
                          "Create Collaborative Session"
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Join session form
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Session Code
                    </label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter the 6-character code"
                      className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Try code "DEMO12" for a demo session
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Your Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-slate-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <button
                    onClick={handleJoinSession}
                    disabled={isJoiningSession}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-medium py-3 rounded-lg mt-4 transition duration-200 flex items-center justify-center"
                  >
                    {isJoiningSession ? (
                      <>
                        <div className="mr-2 w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Joining...
                      </>
                    ) : (
                      "Join Session"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 p-5 rounded-xl">
            <h3 className="text-amber-400 font-bold text-lg mb-2">
              Create Together
            </h3>
            <p className="text-gray-300">
              Collaborate in real-time with classmates or colleagues to create
              quizzes as a team.
            </p>
          </div>

          <div className="bg-slate-700/50 p-5 rounded-xl">
            <h3 className="text-amber-400 font-bold text-lg mb-2">
              Shared Results
            </h3>
            <p className="text-gray-300">
              View analytics and export quizzes to Google Forms or PDF together
              with your group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborate;
