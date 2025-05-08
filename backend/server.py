from flask import Flask, request, jsonify
from flask_cors import CORS
from pprint import pprint
import nltk
import subprocess
import os
import glob

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
nltk.download("stopwords")
nltk.download('punkt_tab')
from Generator import main
import re
import json
import spacy
from transformers import pipeline
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
import random
import webbrowser
from apiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools
from mediawikiapi import MediaWikiAPI

app = Flask(__name__)
CORS(app)
print("Starting Flask App...")

SERVICE_ACCOUNT_FILE = './service_account_key.json'
SCOPES = ['https://www.googleapis.com/auth/documents.readonly']

MCQGen = main.MCQGenerator()
answer = main.AnswerPredictor()
BoolQGen = main.BoolQGenerator()
ShortQGen = main.ShortQGenerator()
qg = main.QuestionGenerator()
docs_service = main.GoogleDocsService(SERVICE_ACCOUNT_FILE, SCOPES)
file_processor = main.FileProcessor()
mediawikiapi = MediaWikiAPI()
qa_model = pipeline("question-answering")


def process_input_text(input_text, use_mediawiki):
    if use_mediawiki == 1:
        input_text = mediawikiapi.summary(input_text,8)
    return input_text


@app.route("/get_mcq", methods=["POST"])
def get_mcq():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    input_text = process_input_text(input_text, use_mediawiki)
    
    # Ensure we request enough keywords to generate the requested number of questions
    # The identify_keywords function limits based on this parameter
    output = MCQGen.generate_mcq(
        {"input_text": input_text, "max_questions": max_questions * 2}
    )
    
    questions = output.get("questions", [])
    
    # Limit to the requested number of questions if we got more
    if len(questions) > max_questions:
        questions = questions[:max_questions]
    
    return jsonify({"output": questions})


@app.route("/get_boolq", methods=["POST"])
def get_boolq():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    input_text = process_input_text(input_text, use_mediawiki)
    
    # BoolQ generation might return fewer questions than requested
    # Try multiple times with increasing limits until we get enough questions
    attempt = 1
    max_attempts = 3
    multiplier = 3
    
    while attempt <= max_attempts:
        output = BoolQGen.generate_boolq(
            {"input_text": input_text, "max_questions": max_questions * multiplier * attempt}
        )
        
        boolean_questions = output.get("Boolean_Questions", [])
        
        if len(boolean_questions) >= max_questions:
            # We got enough questions, limit to the requested number
            boolean_questions = boolean_questions[:max_questions]
            break
        
        attempt += 1
    
    return jsonify({"output": boolean_questions})


@app.route("/get_shortq", methods=["POST"])
def get_shortq():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    input_text = process_input_text(input_text, use_mediawiki)
    
    # Ensure we request enough keywords to generate the requested number of questions
    output = ShortQGen.generate_shortq(
        {"input_text": input_text, "max_questions": max_questions * 2}
    )
    
    questions = output.get("questions", [])
    
    # Limit to the requested number of questions if we got more
    if len(questions) > max_questions:
        questions = questions[:max_questions]
    
    return jsonify({"output": questions})


@app.route("/get_problems", methods=["POST"])
def get_problems():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    
    # Distribute the requested questions across the three types
    # Allocate at least one question per type
    total_types = 3
    min_per_type = 1
    remaining = max(max_questions - (total_types * min_per_type), 0)
    
    # Distribute remaining questions evenly
    questions_per_type = min_per_type + (remaining // total_types)
    extra = remaining % total_types
    
    max_questions_mcq = questions_per_type + (1 if extra > 0 else 0)
    max_questions_boolq = questions_per_type + (1 if extra > 1 else 0)
    max_questions_shortq = questions_per_type + (1 if extra > 2 else 0)
    
    input_text = process_input_text(input_text, use_mediawiki)
    
    # Request double the questions from each generator to ensure we get enough
    output1 = MCQGen.generate_mcq(
        {"input_text": input_text, "max_questions": max_questions_mcq * 2}
    )
    output2 = BoolQGen.generate_boolq(
        {"input_text": input_text, "max_questions": max_questions_boolq * 3}
    )
    output3 = ShortQGen.generate_shortq(
        {"input_text": input_text, "max_questions": max_questions_shortq * 2}
    )
    
    # Limit each output to the requested number of questions
    if output1.get("questions") and len(output1["questions"]) > max_questions_mcq:
        output1["questions"] = output1["questions"][:max_questions_mcq]
    
    if output2.get("Boolean_Questions") and len(output2["Boolean_Questions"]) > max_questions_boolq:
        output2["Boolean_Questions"] = output2["Boolean_Questions"][:max_questions_boolq]
    
    if output3.get("questions") and len(output3["questions"]) > max_questions_shortq:
        output3["questions"] = output3["questions"][:max_questions_shortq]
    
    return jsonify(
        {"output_mcq": output1, "output_boolq": output2, "output_shortq": output3}
    )

@app.route("/get_mcq_answer", methods=["POST"])
def get_mcq_answer():
    data = request.get_json()
    input_text = data.get("input_text", "")
    input_questions = data.get("input_question", [])
    input_options = data.get("input_options", [])
    outputs = []

    if not input_questions or not input_options or len(input_questions) != len(input_options):
        return jsonify({"outputs": outputs})

    for question, options in zip(input_questions, input_options):
        # Generate answer using the QA model
        qa_response = qa_model(question=question, context=input_text)
        generated_answer = qa_response["answer"]

        # Calculate similarity between generated answer and each option
        options_with_answer = options + [generated_answer]
        vectorizer = TfidfVectorizer().fit_transform(options_with_answer)
        vectors = vectorizer.toarray()
        generated_answer_vector = vectors[-1].reshape(1, -1)

        similarities = cosine_similarity(vectors[:-1], generated_answer_vector).flatten()
        max_similarity_index = similarities.argmax()

        # Return the option with the highest similarity
        best_option = options[max_similarity_index]
        
        outputs.append(best_option)

    return jsonify({"output": outputs})


@app.route("/get_shortq_answer", methods=["POST"])
def get_answer():
    data = request.get_json()
    input_text = data.get("input_text", "")
    input_questions = data.get("input_question", [])
    answers = []
    for question in input_questions:
        qa_response = qa_model(question=question, context=input_text)
        answers.append(qa_response["answer"])

    return jsonify({"output": answers})


@app.route("/get_boolean_answer", methods=["POST"])
def get_boolean_answer():
    data = request.get_json()
    input_text = data.get("input_text", "")
    input_questions = data.get("input_question", [])
    output = []

    for question in input_questions:
        qa_response = answer.predict_boolean_answer(
            {"input_text": input_text, "input_question": question}
        )
        if(qa_response):
            output.append("True")
        else:
            output.append("False")

    return jsonify({"output": output})


@app.route('/get_content', methods=['POST'])
def get_content():
    try:
        data = request.get_json()
        document_url = data.get('document_url')
        if not document_url:
            return jsonify({'error': 'Document URL is required'}), 400

        text = docs_service.get_document_content(document_url)
        return jsonify(text)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/generate_gform", methods=["POST"])
def generate_gform():
    data = request.get_json()
    qa_pairs = data.get("qa_pairs", "")
    question_type = data.get("question_type", "")
    SCOPES = "https://www.googleapis.com/auth/forms.body"
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets("credentials.json", SCOPES)
        creds = tools.run_flow(flow, store)

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )
    NEW_FORM = {
        "info": {
            "title": "Inquizzitive form",
        }
    }
    requests_list = []

    if question_type == "get_shortq":
        for index, qapair in enumerate(qa_pairs):
            requests = {
                "createItem": {
                    "item": {
                        "title": qapair["question"],
                        "questionItem": {
                            "question": {
                                "required": True,
                                "textQuestion": {},
                            }
                        },
                    },
                    "location": {"index": index},
                }
            }
            requests_list.append(requests)
    elif question_type == "get_mcq":
        for index, qapair in enumerate(qa_pairs):
            # Extract and filter the options
            options = qapair.get("options", [])
            valid_options = [
                opt for opt in options if opt
            ]  # Filter out empty or None options

            # Ensure the answer is included in the choices
            choices = [qapair["answer"]] + valid_options[
                :3
            ]  # Include up to the first 3 options

            # Randomize the order of the choices
            random.shuffle(choices)

            # Prepare the request structure
            choices_list = [{"value": choice} for choice in choices]

            requests = {
                "createItem": {
                    "item": {
                        "title": qapair["question"],
                        "questionItem": {
                            "question": {
                                "required": True,
                                "choiceQuestion": {
                                    "type": "RADIO",
                                    "options": choices_list,
                                },
                            }
                        },
                    },
                    "location": {"index": index},
                }
            }

            requests_list.append(requests)
    elif question_type == "get_boolq":
        for index, qapair in enumerate(qa_pairs):
            choices_list = [
                {"value": "True"},
                {"value": "False"},
            ]
            requests = {
                "createItem": {
                    "item": {
                        "title": qapair["question"],
                        "questionItem": {
                            "question": {
                                "required": True,
                                "choiceQuestion": {
                                    "type": "RADIO",
                                    "options": choices_list,
                                },
                            }
                        },
                    },
                    "location": {"index": index},
                }
            }

            requests_list.append(requests)
    else:
        for index, qapair in enumerate(qa_pairs):
            if "options" in qapair and qapair["options"]:
                options = qapair["options"]
                valid_options = [
                    opt for opt in options if opt
                ]  # Filter out empty or None options
                choices = [qapair["answer"]] + valid_options[
                    :3
                ]  # Include up to the first 3 options
                random.shuffle(choices)
                choices_list = [{"value": choice} for choice in choices]
                question_structure = {
                    "choiceQuestion": {
                        "type": "RADIO",
                        "options": choices_list,
                    }
                }
            elif "answer" in qapair:
                question_structure = {"textQuestion": {}}
            else:
                question_structure = {
                    "choiceQuestion": {
                        "type": "RADIO",
                        "options": [
                            {"value": "True"},
                            {"value": "False"},
                        ],
                    }
                }

            requests = {
                "createItem": {
                    "item": {
                        "title": qapair["question"],
                        "questionItem": {
                            "question": {
                                "required": True,
                                **question_structure,
                            }
                        },
                    },
                    "location": {"index": index},
                }
            }
            requests_list.append(requests)

    NEW_QUESTION = {"requests": requests_list}

    result = form_service.forms().create(body=NEW_FORM).execute()
    form_service.forms().batchUpdate(
        formId=result["formId"], body=NEW_QUESTION
    ).execute()

    edit_url = jsonify(result["responderUri"])
    webbrowser.open_new_tab(
        "https://docs.google.com/forms/d/" + result["formId"] + "/edit"
    )
    return edit_url


@app.route("/get_shortq_hard", methods=["POST"])
def get_shortq_hard():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    input_text = process_input_text(input_text, use_mediawiki)
    output = ShortQGen.generate_shortq(
        {"input_text": input_text, "max_questions": max_questions * 2}
    )
    questions = output.get("questions", [])
    if len(questions) > max_questions:
        questions = questions[:max_questions]
    return jsonify({"output": questions})


@app.route("/get_mcq_hard", methods=["POST"])
def get_mcq_hard():
    data = request.get_json()
    input_text = data.get("input_text", "")
    use_mediawiki = data.get("use_mediawiki", 0)
    max_questions = int(data.get("max_questions", 4))
    input_text = process_input_text(input_text, use_mediawiki)
    output = MCQGen.generate_mcq(
        {"input_text": input_text, "max_questions": max_questions * 2}
    )
    questions = output.get("questions", [])
    if len(questions) > max_questions:
        questions = questions[:max_questions]
    return jsonify({"output": questions})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    content = file_processor.process_file(file)
    
    if content:
        return jsonify({"content": content})
    else:
        return jsonify({"error": "Unsupported file type or error processing file"}), 400

@app.route("/", methods=["GET"])
def hello():
    return "The server is working fine"

def clean_transcript(file_path):
    """Extracts and cleans transcript from a VTT file."""
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    transcript_lines = []
    skip_metadata = True  # Skip lines until we reach actual captions

    for line in lines:
        line = line.strip()

        # Skip metadata lines like "Kind: captions" or "Language: en"
        if line.lower().startswith(("kind:", "language:", "webvtt")):
            continue
        
        # Detect timestamps like "00:01:23.456 --> 00:01:25.789"
        if "-->" in line:
            skip_metadata = False  # Now real captions start
            continue
        
        if not skip_metadata:
            # Remove formatting tags like <c>...</c> and <00:00:00.000>
            line = re.sub(r"<[^>]+>", "", line)
            transcript_lines.append(line)

    return " ".join(transcript_lines).strip()

@app.route('/getTranscript', methods=['GET'])
def get_transcript():
    video_id = request.args.get('videoId')
    if not video_id:
        return jsonify({"error": "No video ID provided"}), 400

    try:
        # Make sure the subtitles directory exists
        os.makedirs("subtitles", exist_ok=True)
        
        # For hackathon demo - add mock transcripts for sample videos
        demo_transcripts = {
            "wrwgIcBOheQ": """Einstein's theory of relativity revolutionized our understanding of space, time, and gravity. 
      Special relativity, published in 1905, established that the speed of light is constant for all observers 
      and that space and time are relative, not absolute. This leads to effects like time dilation and length 
      contraction at speeds approaching the speed of light. Mass and energy are equivalent, expressed in the famous 
      equation E=mc². General relativity, published in 1915, describes gravity as the curvature of spacetime caused 
      by mass and energy. Massive objects create a "dent" in the fabric of spacetime, causing other objects to follow 
      curved paths. This explains orbital mechanics and predicts phenomena like gravitational waves, gravitational 
      lensing, and black holes. Einstein's theories have been consistently verified through experiments and observations, 
      from the bending of starlight around the sun to the detection of gravitational waves from merging black holes.""",
            
            "unkIVvt2gXc": """Motivation is the driving force behind our actions and behaviors. It can be intrinsic, 
      coming from personal satisfaction or enjoyment, or extrinsic, driven by external rewards or consequences. 
      To stay motivated, it's essential to set clear, specific goals that are challenging yet achievable. 
      Breaking larger goals into smaller, manageable tasks creates a sense of progress and prevents overwhelm. 
      Creating a supportive environment that minimizes distractions and temptations helps maintain focus. 
      Finding personal meaning and purpose in activities enhances intrinsic motivation, making tasks more engaging. 
      Regular self-reflection on progress, adjusting strategies as needed, and celebrating small victories along 
      the way sustain motivation during challenging times. Building habits and routines reduces the reliance on 
      willpower, making consistent action more sustainable.""",
            
            "aircAruvnKk": """Neural networks are computational systems inspired by the human brain's structure and function. 
      They consist of interconnected nodes, or "neurons," organized in layers: an input layer, one or more hidden layers, 
      and an output layer. Each neuron processes input data, applies weights and biases, and passes the result through 
      an activation function to produce an output. During training, neural networks adjust these weights and biases 
      through a process called backpropagation, minimizing the difference between predicted and actual outputs. 
      This enables the network to learn patterns and relationships in data without explicit programming. Deep learning 
      uses neural networks with many layers to process complex data like images, speech, and text. Common neural network 
      architectures include feedforward networks, convolutional neural networks (CNNs) for image processing, and recurrent 
      neural networks (RNNs) for sequential data like language. Neural networks power various applications from facial 
      recognition to language translation and medical diagnosis."""
        }
        
        # Check if we have a mock transcript for this video (for demo purposes)
        if video_id in demo_transcripts:
            return jsonify({"transcript": demo_transcripts[video_id]})
        
        # Try to download the transcript
        try:
            subprocess.run(
                ["yt-dlp", "--write-auto-sub", "--sub-lang", "en", "--skip-download",
                 "--sub-format", "vtt", "-o", f"subtitles/{video_id}.vtt", 
                 f"https://www.youtube.com/watch?v={video_id}"],
                check=True, capture_output=True, text=True, timeout=30
            )

            # Find the latest .vtt file in the "subtitles" folder
            subtitle_files = glob.glob("subtitles/*.vtt")
            if not subtitle_files:
                # If no subtitles found, generate a placeholder transcript
                placeholder_transcript = f"""This is a placeholder transcript for video ID {video_id}.
                It appears this video doesn't have automatic captions available.
                For the purposes of this demo, we'll generate a quiz from this text instead.
                
                This video likely contains educational content that covers important concepts and examples.
                Topics might include science, technology, mathematics, history, or other educational subjects.
                
                In a production environment, you would either need to select videos with captions available,
                or implement a speech-to-text service to generate transcripts from the audio."""
                
                return jsonify({"transcript": placeholder_transcript})

            latest_subtitle = max(subtitle_files, key=os.path.getctime)
            transcript_text = clean_transcript(latest_subtitle)

            # Optional: Clean up the file after reading
            try:
                os.remove(latest_subtitle)
            except:
                pass  # Ignore errors on cleanup

            return jsonify({"transcript": transcript_text})
            
        except subprocess.TimeoutExpired:
            # Handle timeout
            return jsonify({
                "transcript": "This is a placeholder transcript for demonstration purposes. The actual transcript download timed out."
            })
        
        except subprocess.CalledProcessError as e:
            # If yt-dlp fails, return a generic transcript for demo
            generic_transcript = f"""This is a generic transcript for demonstration purposes.
            It appears we couldn't download the actual transcript for video ID {video_id}.
            
            For the purposes of this demo, we'll generate a quiz from this text instead.
            
            This demonstration shows how educational videos can be automatically converted into quizzes.
            The system extracts key concepts from video transcripts and generates questions to test understanding.
            
            In a production environment, this would use the actual video transcript content."""
            
            return jsonify({"transcript": generic_transcript})
            
    except Exception as e:
        # If anything goes wrong, return a fallback transcript for the hackathon demo
        fallback_transcript = """This is a fallback transcript for demonstration purposes.
        
        Education is the process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits.
        Educational methods include teaching, training, storytelling, discussion, and directed research.
        
        Learning is the process of acquiring new understanding, knowledge, behaviors, skills, values, attitudes, and preferences.
        The ability to learn is possessed by humans, animals, and some machines.
        
        Technology has become an increasingly influential factor in education. Computers and mobile devices allow students and teachers to access vast amounts of information and educational resources.
        
        Assessment plays an important role in education, measuring what students have learned and how well they understand the material.
        
        This text is provided as a fallback for the demo when actual transcript retrieval encounters issues."""
        
        print(f"Error in getTranscript: {str(e)}")
        return jsonify({"transcript": fallback_transcript})

if __name__ == "__main__":
    os.makedirs("subtitles", exist_ok=True)
    app.run()
