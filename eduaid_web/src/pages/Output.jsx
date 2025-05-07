import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import "../index.css";
import { FaArrowLeft, FaFilePdf, FaGoogle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Output = () => {
  const [qaPairs, setQaPairs] = useState([]);
  const [questionType, setQuestionType] = useState(
    localStorage.getItem("selectedQuestionType")
  );
  const [pdfMode, setPdfMode] = useState("questions");
  const [expandedQuestions, setExpandedQuestions] = useState({});

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
    const qaPairsFromStorage =
      JSON.parse(localStorage.getItem("qaPairs")) || {};
    if (qaPairsFromStorage) {
      const combinedQaPairs = [];

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

      if ((qaPairsFromStorage["output_mcq"] || questionType === "get_mcq") && qaPairsFromStorage["output"]) {
        qaPairsFromStorage["output"].forEach((qaPair) => {
          combinedQaPairs.push({
            question: qaPair.question_statement,
            question_type: "MCQ",
            options: qaPair.options,
            answer: qaPair.answer,
            context: qaPair.context,
          });
        });
      }

      if (questionType == "get_boolq" && qaPairsFromStorage["output"]) {
        qaPairsFromStorage["output"].forEach((qaPair) => {
          combinedQaPairs.push({
            question: qaPair,
            question_type: "Boolean",
          });
        });
      } else if (qaPairsFromStorage["output"] && questionType !== "get_mcq") {
        qaPairsFromStorage["output"].forEach((qaPair) => {
          combinedQaPairs.push({
            question:
              qaPair.question || qaPair.question_statement || qaPair.Question,
            options: qaPair.options,
            answer: qaPair.answer || qaPair.Answer,
            context: qaPair.context,
            question_type: "Short",
          });
        });
      }

      setQaPairs(combinedQaPairs);
    }
  }, []);

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
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/text-input" className="text-gray-400 hover:text-amber-400 flex items-center">
            <FaArrowLeft className="mr-2" /> Back
          </Link>
          
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
        
        {/* Main Content Title */}
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-medium mb-2">Generated Quiz</h2>
          <p className="text-gray-300 text-lg">
            {qaPairs.length} {qaPairs.length === 1 ? 'question' : 'questions'} created
          </p>
          
          {/* Validation message */}
          {localStorage.getItem("validationMessage") && (
            <div className="mt-3 text-amber-300 bg-amber-300/10 border border-amber-300/30 rounded-lg p-3 mx-auto max-w-2xl">
              {localStorage.getItem("validationMessage")}
            </div>
          )}
        </div>
        
        {/* Questions List */}
        <div className="space-y-4 mb-10">
          {qaPairs.map((qaPair, index) => {
            const combinedOptions = qaPair.options
              ? [...qaPair.options, qaPair.answer]
              : [qaPair.answer];
            const shuffledOptions = shuffleArray(combinedOptions);
            
            return (
              <div
                key={index}
                className="bg-slate-700 rounded-lg overflow-hidden shadow-lg transition-all duration-200"
              >
                {/* Question Header */}
                <div 
                  className="px-5 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <div>
                    <span className="text-amber-400 font-medium">Question {index + 1}</span>
                    <h3 className="text-white text-lg font-medium mt-1">
                      {qaPair.question}
                    </h3>
                  </div>
                  <div className="text-amber-400">
                    {expandedQuestions[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                
                {/* Question Details */}
                {expandedQuestions[index] && (
                  <div className="px-5 py-4 bg-slate-800 border-t border-slate-600">
                    {qaPair.question_type !== "Boolean" ? (
                      <>
                        <div className="mb-3">
                          <span className="text-gray-400 text-sm block mb-1">Answer:</span>
                          <div className="text-white font-medium bg-slate-700 px-3 py-2 rounded-md">
                            {qaPair.answer}
                          </div>
                        </div>
                        
                        {qaPair.options && qaPair.options.length > 0 && (
                          <div>
                            <span className="text-gray-400 text-sm block mb-2">Options:</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {shuffledOptions.map((option, idx) => (
                                <div 
                                  key={idx} 
                                  className={`px-3 py-2 rounded-md text-sm ${
                                    option === qaPair.answer 
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                                      : "bg-slate-700 text-gray-200"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mb-3">
                        <span className="text-gray-400 text-sm block mb-1">Type:</span>
                        <div className="text-white font-medium bg-slate-700 px-3 py-2 rounded-md">
                          True/False Question
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={generateGoogleForm}
            className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-lg transition duration-300 flex items-center"
          >
            <FaGoogle className="mr-2 text-amber-400" />
            Generate Google Form
          </button>
          
          <div className="relative">
            <button
              className="dropdown-toggle bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-lg transition duration-300 flex items-center"
              onClick={() => document.getElementById('pdfDropdown').classList.toggle('hidden')}
            >
              <FaFilePdf className="mr-2 text-amber-400" />
              Generate PDF
            </button>
            
            <div
              id="pdfDropdown"
              className="hidden absolute right-0 mt-2 w-56 bg-slate-900 rounded-lg shadow-xl z-10 border border-slate-700"
            >
              <button
                className="block w-full text-left px-4 py-3 text-white hover:bg-slate-700 rounded-t-lg"
                onClick={() => generatePDF('questions')}
              >
                Questions Only
              </button>
              <button
                className="block w-full text-left px-4 py-3 text-white hover:bg-slate-700 border-t border-slate-700"
                onClick={() => generatePDF('questions_answers')}
              >
                Questions with Answers
              </button>
              <button
                className="block w-full text-left px-4 py-3 text-white hover:bg-slate-700 rounded-b-lg border-t border-slate-700"
                onClick={() => generatePDF('answers')}
              >
                Answers Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
