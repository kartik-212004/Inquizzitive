import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaChartPie,
  FaChartLine,
  FaLightbulb,
  FaCheck,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import "../index.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
);

const Analytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [difficultyData, setDifficultyData] = useState({});
  const [questionTypeData, setQuestionTypeData] = useState({});
  const [quizCountData, setQuizCountData] = useState({});
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load quiz data from localStorage
    const loadData = () => {
      setLoading(true);
      const previousQuizzes =
        JSON.parse(localStorage.getItem("previousQuizzes")) || [];
      setQuizzes(previousQuizzes);

      // Extract topics from quiz text using NLP-like approach (simplified)
      extractTopicsAndKeywords(previousQuizzes);

      // Analyze difficulty distribution
      analyzeDifficultyDistribution(previousQuizzes);

      // Analyze question type distribution
      analyzeQuestionTypeDistribution(previousQuizzes);

      // Analyze quiz creation over time
      analyzeQuizCreationOverTime(previousQuizzes);

      // Generate AI-powered insights
      generateInsights(previousQuizzes);

      setLoading(false);
    };

    loadData();
  }, []);

  // Extract topics and keywords from quiz content
  const extractTopicsAndKeywords = (quizzes) => {
    // Simple topic extraction (in a real implementation, use NLP)
    const allText = quizzes.map((quiz) => quiz.text || "").join(" ");
    const words = allText.toLowerCase().split(/\s+/);

    // Count word frequency (ignore common words)
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "of",
      "is",
      "are",
    ]);
    const wordCount = {};

    words.forEach((word) => {
      if (word.length > 3 && !commonWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // Sort by frequency
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .filter(([word, count]) => count > 1)
      .slice(0, 20);

    // Extract top keywords and potential topics
    const extractedKeywords = sortedWords.map(([word]) => word);
    setKeywords(extractedKeywords);
    

    // Group related keywords into topics (simplified)
    const extractedTopics = [];
    for (let i = 0; i < Math.min(5, sortedWords.length); i++) {
      extractedTopics.push({
        name: sortedWords[i][0],
        count: sortedWords[i][1],
        relatedWords: extractedKeywords
          .filter(
            (word) =>
              word !== sortedWords[i][0] &&
              word.includes(sortedWords[i][0].substring(0, 3))
          )
          .slice(0, 3),
      });
    }

    setTopics(extractedTopics);
  };

  // Analyze difficulty distribution
  const analyzeDifficultyDistribution = (quizzes) => {
    const difficultyCount = {
      "Easy Difficulty": 0,
      "Hard Difficulty": 0,
    };

    quizzes.forEach((quiz) => {
      difficultyCount[quiz.difficulty] =
        (difficultyCount[quiz.difficulty] || 0) + 1;
    });

    setDifficultyData({
      labels: Object.keys(difficultyCount),
      datasets: [
        {
          label: "Quiz Difficulty",
          data: Object.values(difficultyCount),
          backgroundColor: [
            "rgba(248, 169, 62, 0.6)",
            "rgba(230, 93, 93, 0.6)",
          ],
          borderColor: ["rgba(248, 169, 62, 1)", "rgba(230, 93, 93, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };

  // Analyze question type distribution
  const analyzeQuestionTypeDistribution = (quizzes) => {
    const typeLabels = {
      get_shortq: "Short Answer",
      get_mcq: "Multiple Choice",
      get_boolq: "True/False",
      get_problems: "Mixed",
    };

    const typeCount = {
      "Short Answer": 0,
      "Multiple Choice": 0,
      "True/False": 0,
      Mixed: 0,
    };

    quizzes.forEach((quiz) => {
      const type = typeLabels[quiz.selectedQuestionType] || "Mixed";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    setQuestionTypeData({
      labels: Object.keys(typeCount),
      datasets: [
        {
          label: "Question Types",
          data: Object.values(typeCount),
          backgroundColor: [
            "rgba(83, 144, 217, 0.6)",
            "rgba(120, 99, 230, 0.6)",
            "rgba(87, 182, 174, 0.6)",
            "rgba(76, 175, 80, 0.6)",
          ],
          borderColor: [
            "rgba(83, 144, 217, 1)",
            "rgba(120, 99, 230, 1)",
            "rgba(87, 182, 174, 1)",
            "rgba(76, 175, 80, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  // Analyze quiz creation over time
  const analyzeQuizCreationOverTime = (quizzes) => {
    // Group quizzes by date (day level)
    const quizzesByDate = {};

    quizzes.forEach((quiz) => {
      const date = new Date(quiz.date);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      quizzesByDate[dateStr] = (quizzesByDate[dateStr] || 0) + 1;
    });

    // Sort dates
    const sortedDates = Object.keys(quizzesByDate).sort();

    // Create data for chart
    setQuizCountData({
      labels: sortedDates.map((date) => {
        const [year, month, day] = date.split("-");
        return `${month}/${day}`;
      }),
      datasets: [
        {
          label: "Quizzes Created",
          data: sortedDates.map((date) => quizzesByDate[date]),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  // Generate AI-powered insights
  const generateInsights = (quizzes) => {
    if (quizzes.length === 0) {
      setInsights([
        "Start creating quizzes to see personalized insights!",
        "Try different question types to enhance learning.",
        "Mix difficulty levels for a comprehensive learning experience.",
      ]);
      return;
    }

    const generatedInsights = [];

    // Most common question type
    const typeCount = {};
    quizzes.forEach((quiz) => {
      typeCount[quiz.selectedQuestionType] =
        (typeCount[quiz.selectedQuestionType] || 0) + 1;
    });

    const mostCommonType = Object.entries(typeCount).sort(
      (a, b) => b[1] - a[1]
    )[0];
    if (mostCommonType) {
      const typeNames = {
        get_shortq: "Short Answer questions",
        get_mcq: "Multiple Choice questions",
        get_boolq: "True/False questions",
        get_problems: "Mixed question types",
      };
      generatedInsights.push(
        `You prefer ${
          typeNames[mostCommonType[0]]
        }. Consider exploring other question types for variety.`
      );
    }

    // Difficulty preference
    const difficultyCount = {
      "Easy Difficulty": 0,
      "Hard Difficulty": 0,
    };

    quizzes.forEach((quiz) => {
      difficultyCount[quiz.difficulty] =
        (difficultyCount[quiz.difficulty] || 0) + 1;
    });

    if (
      difficultyCount["Easy Difficulty"] > difficultyCount["Hard Difficulty"]
    ) {
      generatedInsights.push(
        "You mostly create easier quizzes. Challenge yourself with hard difficulty to deepen understanding."
      );
    } else if (
      difficultyCount["Hard Difficulty"] > difficultyCount["Easy Difficulty"]
    ) {
      generatedInsights.push(
        "You prefer challenging quizzes. Great job pushing your knowledge!"
      );
    }

    // Quiz length trend
    const averageQuestions =
      quizzes.reduce((sum, quiz) => sum + quiz.numQuestions, 0) /
      quizzes.length;
    generatedInsights.push(
      `Your quizzes have an average of ${averageQuestions.toFixed(
        1
      )} questions. ${
        averageQuestions < 8
          ? "Consider longer quizzes for comprehensive testing."
          : "Good quiz length for thorough assessment!"
      }`
    );

    // Recent activity
    const now = new Date();
    const recentQuizzes = quizzes.filter((quiz) => {
      const quizDate = new Date(quiz.date);
      const diffDays = Math.floor((now - quizDate) / (1000 * 60 * 60 * 24));
      return diffDays < 7;
    });

    if (recentQuizzes.length === 0) {
      generatedInsights.push(
        "You haven't created quizzes recently. Regular quiz creation enhances learning retention."
      );
    } else if (recentQuizzes.length >= 3) {
      generatedInsights.push(
        "You've been actively creating quizzes this week. Great job maintaining consistency!"
      );
    }

    // Add recommendation based on quiz topics
    if (topics.length > 0) {
      generatedInsights.push(
        `Based on your quiz content, you could explore more about "${topics[0].name}" and related concepts.`
      );
    }

    setInsights(generatedInsights);
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        color: "white",
      },
    },
  };

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
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
            <span className="ml-2 text-white">Analytics</span>
          </div>
          <div className="w-20"></div> {/* Empty div for flexbox alignment */}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-4 border-t-4 border-amber-400 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Analytics Summary */}
            <div className="bg-slate-700/80 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FaChartPie className="mr-3 text-amber-400" />
                Quiz Analytics Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-800/80 rounded-lg p-4 shadow">
                  <h3 className="text-amber-300 text-lg mb-2">Total Quizzes</h3>
                  <p className="text-4xl font-bold text-white">
                    {quizzes.length}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {quizzes.length > 0
                      ? `Last created: ${new Date(
                          quizzes[quizzes.length - 1]?.date
                        ).toLocaleDateString()}`
                      : "No quizzes created yet"}
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-4 shadow">
                  <h3 className="text-amber-300 text-lg mb-2">
                    Total Questions
                  </h3>
                  <p className="text-4xl font-bold text-white">
                    {quizzes.reduce((sum, quiz) => sum + quiz.numQuestions, 0)}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {quizzes.length > 0
                      ? `Avg per quiz: ${(
                          quizzes.reduce(
                            (sum, quiz) => sum + quiz.numQuestions,
                            0
                          ) / quizzes.length
                        ).toFixed(1)}`
                      : "No questions created yet"}
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-4 shadow">
                  <h3 className="text-amber-300 text-lg mb-2">Main Topics</h3>
                  <div className="text-white">
                    {topics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-500/20 text-amber-300 text-sm px-2 py-1 rounded-full"
                          >
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No topics detected yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Difficulty Distribution */}
              <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">
                  Difficulty Distribution
                </h3>
                {Object.keys(difficultyData).length > 0 ? (
                  <div className="h-64">
                    <Pie data={difficultyData} options={pieOptions} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </div>

              {/* Question Type Distribution */}
              <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">
                  Question Types
                </h3>
                {Object.keys(questionTypeData).length > 0 ? (
                  <div className="h-64">
                    <Bar
                      data={questionTypeData}
                      options={{
                        ...pieOptions,
                        indexAxis: "y",
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: { color: "white" },
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                          },
                          y: {
                            ticks: { color: "white" },
                            grid: { color: "rgba(255, 255, 255, 0.1)" },
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quiz Creation Timeline */}
              <div className="lg:col-span-2 bg-slate-700/80 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">
                  Quiz Creation Timeline
                </h3>
                {Object.keys(quizCountData).length > 0 &&
                quizCountData.labels.length > 0 ? (
                  <div className="h-64">
                    <Line data={quizCountData} options={lineOptions} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-400">
                      Not enough data for timeline
                    </p>
                  </div>
                )}
              </div>

              {/* AI Insights */}
              <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FaLightbulb className="mr-2 text-amber-400" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  {insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start">
                      <FaCheck className="text-amber-400 mt-1 mr-3 flex-shrink-0" />
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keywords Cloud */}
            {keywords.length > 0 && (
              <div className="mt-8 bg-slate-700/80 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">
                  Keyword Analysis
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {keywords.map((keyword, idx) => {
                    // Calculate size based on position in the array (first items are more frequent)
                    const size = Math.max(
                      1,
                      Math.min(4, 4 - (idx / keywords.length) * 3)
                    );
                    const colors = [
                      "bg-amber-500/20 text-amber-300",
                      "bg-blue-500/20 text-blue-300",
                      "bg-green-500/20 text-green-300",
                      "bg-purple-500/20 text-purple-300",
                      "bg-red-500/20 text-red-300",
                    ];
                    const colorClass = colors[idx % colors.length];

                    return (
                      <span
                        key={idx}
                        className={`${colorClass} px-3 py-1 rounded-full text-${
                          Math.round(size) + "xl"
                        }`}
                      >
                        {keyword}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
