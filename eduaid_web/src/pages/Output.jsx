import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import "../index.css";
import { FaArrowLeft, FaFilePdf, FaGoogle, FaChevronDown, FaChevronUp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Output = () => {
  const [qaPairs, setQaPairs] = useState([]);
  const [questionType, setQuestionType] = useState(
    localStorage.getItem("questionType") || localStorage.getItem("selectedQuestionType") || "mcq"
  );
  const [pdfMode, setPdfMode] = useState("questions");
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [transcript, setTranscript] = useState("");
  const [videoId, setVideoId] = useState("");
  const [sourceType, setSourceType] = useState("text");

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("pdfDropdown");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !event.target.closest("button.dropdown-toggle")
      ) {
        dropdown.classList.add("hidden");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    // Check for YouTube video data first
    const storedVideoId = localStorage.getItem("videoId");
    const storedTranscript = localStorage.getItem("voiceTranscript");
    
    if (storedVideoId && storedTranscript) {
      setVideoId(storedVideoId);
      setTranscript(storedTranscript);
      setSourceType("youtube");
    }
    
    // Load quiz data
    const qaPairsFromStorage = JSON.parse(localStorage.getItem("qaPairs")) || {};
    if (qaPairsFromStorage) {
      const combinedQaPairs = [];

      // Process output_boolq (boolean questions)
      if (qaPairsFromStorage["output_boolq"]) {
        qaPairsFromStorage["output_boolq"]["Boolean_Questions"].forEach(
          (question, index) => {
            combinedQaPairs.push({
              question,
              question_type: "Boolean",
              context: qaPairsFromStorage["output_boolq"]["Text"],
            });
          }
        );
      }

      // Process output_mcq (multiple choice questions)
      if (qaPairsFromStorage["output_mcq"]) {
        qaPairsFromStorage["output_mcq"]["questions"].forEach((qaPair) => {
          combinedQaPairs.push({
            question: qaPair.question_statement,
            question_type: "MCQ",
            options: qaPair.options,
            answer: qaPair.answer,
            context: qaPair.context,
          });
        });
      }

      // Process standard output format based on question type
      if (qaPairsFromStorage["output"]) {
        if (questionType === "get_mcq" || questionType === "mcq") {
          // Process MCQ output
          qaPairsFromStorage["output"].forEach((qaPair) => {
            combinedQaPairs.push({
              question: qaPair.question_statement,
              question_type: "MCQ",
              options: qaPair.options,
              answer: qaPair.answer,
              context: qaPair.context,
            });
          });
        } else if (questionType === "get_boolq" || questionType === "boolean") {
          // Process Boolean output
          qaPairsFromStorage["output"].forEach((qaPair) => {
            combinedQaPairs.push({
              question: qaPair,
              question_type: "Boolean",
            });
          });
        } else if (questionType === "get_shortq" || questionType === "shortanswer") {
          // Process Short Answer output
          qaPairsFromStorage["output"].forEach((qaPair) => {
            combinedQaPairs.push({
              question: qaPair.question || qaPair.question_statement || qaPair.Question,
              options: qaPair.options,
              answer: qaPair.answer || qaPair.Answer,
              context: qaPair.context,
              question_type: "Short",
            });
          });
        }
      }

      setQaPairs(combinedQaPairs);
    }
  }, [questionType]);

  const generateGoogleForm = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/generate_gform`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qa_pairs: qaPairs,
        question_type: questionType,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const formUrl = result.form_link;
      window.open(formUrl, "_blank");
    } else {
      console.error("Failed to generate Google Form");
    }
  };

  const loadLogoAsBytes = async () => {
    return null;
  };

  const generatePDF = async (mode) => {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const maxContentWidth = pageWidth - (2 * margin);
    
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    const d = new Date(Date.now());

    // Title text
    page.drawText('Inquizzitive generated Quiz', {
      x: margin,
      y: pageHeight - margin,
      size: 20
    });
    page.drawText('Created On: ' + d.toString(), {
      x: margin,
      y: pageHeight - margin - 30,
      size: 10
    });
    
    const form = pdfDoc.getForm();
    let y = pageHeight - margin - 70;
    let questionIndex = 1;

    const createNewPageIfNeeded = (requiredHeight) => {
        if (y - requiredHeight < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
            return true;
        }
        return false;
    };

    const wrapText = (text, maxWidth) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
  
      words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = testLine.length * 6;
  
          if (testWidth > maxWidth) {
              lines.push(currentLine);
              currentLine = word;
          } else {
              currentLine = testLine;
          }
      });
  
      if (currentLine) {
          lines.push(currentLine);
      }
  
      return lines;
    };
  
    qaPairs.forEach((qaPair) => {
        let requiredHeight = 60;
        const questionLines = wrapText(qaPair.question, maxContentWidth);
        requiredHeight += questionLines.length * 20;

        if (mode !== 'answers') {
            if (qaPair.question_type === "Boolean") {
                requiredHeight += 60;
            } else if (qaPair.question_type === "MCQ" || qaPair.question_type === "MCQ_Hard") {
                const optionsCount = qaPair.options ? qaPair.options.length + 1 : 1;
                requiredHeight += optionsCount * 25;
            } else {
                requiredHeight += 40;
            }
        }

        if (mode === 'answers' || mode === 'questions_answers') {
            requiredHeight += 40;
        }

        createNewPageIfNeeded(requiredHeight);

        if (mode !== 'answers') {
          questionLines.forEach((line, lineIndex) => {
              const textToDraw = lineIndex === 0 
                  ? `Q${questionIndex}) ${line}`
                  : `        ${line}`;
              page.drawText(textToDraw, {
                  x: margin,
                  y: y - (lineIndex * 20),
                  size: 12,
                  maxWidth: maxContentWidth
              });
          });
          y -= (questionLines.length * 20 + 20);

            if (mode === 'questions') {
                if (qaPair.question_type === "Boolean") {
                    const radioGroup = form.createRadioGroup(`question${questionIndex}_answer`);
                    ['True', 'False'].forEach((option) => {
                        const radioOptions = {
                            x: margin + 20,
                            y,
                            width: 15,
                            height: 15,
                        };
                        radioGroup.addOptionToPage(option, page, radioOptions);
                        page.drawText(option, { x: margin + 40, y: y + 2, size: 12 });
                        y -= 20;
                    });
                } else if (qaPair.question_type === "MCQ" || qaPair.question_type === "MCQ_Hard") {
                    const allOptions = [...(qaPair.options || [])];
                    if (qaPair.answer && !allOptions.includes(qaPair.answer)) {
                        allOptions.push(qaPair.answer);
                    }
                    const shuffledOptions = shuffleArray([...allOptions]);
                    
                    const radioGroup = form.createRadioGroup(`question${questionIndex}_answer`);
                    shuffledOptions.forEach((option, index) => {
                        const radioOptions = {
                            x: margin + 20,
                            y,
                            width: 15,
                            height: 15,
                        };
                        radioGroup.addOptionToPage(`option${index}`, page, radioOptions);
                        const optionLines = wrapText(option, maxContentWidth - 60);
                        optionLines.forEach((line, lineIndex) => {
                            page.drawText(line, {
                                x: margin + 40,
                                y: y + 2 - (lineIndex * 15),
                                size: 12
                            });
                        });
                        y -= Math.max(25, optionLines.length * 20);
                    });
                } else if (qaPair.question_type === "Short") {
                    const answerField = form.createTextField(`question${questionIndex}_answer`);
                    answerField.setText("");
                    answerField.addToPage(page, {
                        x: margin,
                        y: y - 20,
                        width: maxContentWidth,
                        height: 20
                    });
                    y -= 40;
                }
            }
        }

        if (mode === 'answers' || mode === 'questions_answers') {
            const answerText = `Answer ${questionIndex}: ${qaPair.answer}`;
            const answerLines = wrapText(answerText, maxContentWidth);
            answerLines.forEach((line, lineIndex) => {
                page.drawText(line, {
                    x: margin,
                    y: y - (lineIndex * 15),
                    size: 12,
                    color: rgb(0, 0.5, 0)
                });
            });
            y -= answerLines.length * 20;
        }

        y -= 20;
        questionIndex += 1;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "inquizzitive_quiz.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.getElementById('pdfDropdown').classList.add('hidden');
  };

  return (
    <div className="w-screen min-h-screen bg-slate-800 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
      
      <div className="relative z-10 max-w-screen-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center">
            <FaArrowLeft className="mr-2" /> Back Home
          </Link>
          
          <div className="text-3xl text-center font-bold">
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
              Inquiz
            </span>
            <span className="bg-gradient-to-r from-amber-300 to-white text-transparent bg-clip-text">
              zitive
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
              onClick={generateGoogleForm}
            >
              <FaGoogle className="mr-2" /> Generate Form
            </button>
            
            <div className="relative">
              <button
                className="dropdown-toggle bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center"
                onClick={() => {
                  const dropdown = document.getElementById("pdfDropdown");
                  dropdown.classList.toggle("hidden");
                }}
              >
                <FaFilePdf className="mr-2" /> Export PDF <FaChevronDown className="ml-2" />
              </button>
              
              <div
                id="pdfDropdown"
                className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg hidden overflow-hidden z-10"
              >
                <button
                  onClick={() => {
                    setPdfMode("questions");
                    generatePDF("questions");
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-slate-600"
                >
                  Questions Only
                </button>
                <button
                  onClick={() => {
                    setPdfMode("answers");
                    generatePDF("answers");
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-slate-600"
                >
                  Questions with Answers
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Player (if from YouTube) */}
        {sourceType === "youtube" && videoId && (
          <div className="mb-8 bg-slate-700/80 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 flex items-center border-b border-slate-600">
              <div className="bg-red-500/20 p-2 rounded-full mr-3">
                <FaYoutube className="text-red-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">YouTube Quiz Source</h2>
            </div>
            
            <div className="relative pb-[56.25%] w-full">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Generated Questions */}
        <div className="bg-slate-700/80 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Generated Questions</h2>
          
          {qaPairs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No questions generated yet. Try creating a new quiz.
            </div>
          ) : (
            <div className="space-y-6">
              {qaPairs.map((qaPair, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors"
                >
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleQuestion(idx)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="bg-amber-500 text-white text-sm font-medium px-2 py-1 rounded mr-3">
                          {qaPair.question_type}
                        </span>
                        <h3 className="text-lg font-medium text-white">
                          Question {idx + 1}
                        </h3>
                      </div>
                      <p className="text-gray-200 mt-2">{qaPair.question}</p>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-white">
                      {expandedQuestions[idx] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                  
                  {expandedQuestions[idx] && (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                      {qaPair.question_type === "MCQ" && (
                        <div>
                          <h4 className="text-md font-medium text-gray-300 mb-2">
                            Options:
                          </h4>
                          <ul className="space-y-2">
                            {qaPair.options?.map((option, optIdx) => (
                              <li
                                key={optIdx}
                                className={`p-2 rounded ${
                                  option === qaPair.answer
                                    ? "bg-green-500/20 border border-green-500/40 text-green-300"
                                    : "bg-slate-700 text-gray-300"
                                }`}
                              >
                                {option}
                                {option === qaPair.answer && (
                                  <span className="ml-2 text-xs font-medium bg-green-600 text-white px-2 py-0.5 rounded">
                                    CORRECT
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {qaPair.question_type === "Boolean" && (
                        <div>
                          <h4 className="text-md font-medium text-gray-300 mb-2">
                            Options:
                          </h4>
                          <div className="flex space-x-4">
                            <div className="flex-1 p-2 rounded bg-slate-700 text-gray-300 text-center">
                              True
                            </div>
                            <div className="flex-1 p-2 rounded bg-slate-700 text-gray-300 text-center">
                              False
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {qaPair.question_type === "Short" && qaPair.answer && (
                        <div>
                          <h4 className="text-md font-medium text-gray-300 mb-2">
                            Answer:
                          </h4>
                          <div className="p-3 bg-green-500/20 border border-green-500/40 rounded text-green-300">
                            {qaPair.answer}
                          </div>
                        </div>
                      )}
                      
                      {qaPair.context && (
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-gray-300 mb-2">
                            Context:
                          </h4>
                          <div className="p-3 bg-slate-700 rounded text-gray-300 max-h-40 overflow-y-auto">
                            {qaPair.context}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Back to YouTube Button */}
        {sourceType === "youtube" && (
          <div className="mt-6 text-center">
            <Link
              to="/youtube-quiz"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
            >
              <FaYoutube className="mr-2" />
              Create Another YouTube Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
