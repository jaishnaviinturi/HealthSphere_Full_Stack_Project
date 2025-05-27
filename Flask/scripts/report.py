import fitz
import google.generativeai as gemini
import json
import os
import pytesseract
from PIL import Image
import re
import logging
from flask import request, jsonify
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Tesseract path
tesseract_cmd = os.getenv("TESSERACT_CMD")
if tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
else:
    logger.warning("TESSERACT_CMD environment variable not set; assuming Tesseract is in system PATH")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY environment variable not set")
    raise ValueError("GEMINI_API_KEY environment variable not set")
gemini.configure(api_key=GEMINI_API_KEY)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        logger.info("Successfully extracted text from PDF: %s", pdf_path)
        return text
    except Exception as e:
        logger.error("Error extracting text from PDF %s: %s", pdf_path, str(e))
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def extract_text_from_image(image_path):
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        logger.info("Successfully extracted text from image: %s", image_path)
        return text
    except Exception as e:
        logger.error("OCR Error for image %s: %s", image_path, str(e))
        raise Exception(f"OCR Error: {str(e)}")

def analyze_medical_report(text):
    prompt = f"""
    You are a highly advanced medical analysis AI. Analyze the following medical report and provide a detailed summary, including:
    - Identified medical metrics (e.g., Blood Glucose, Cholesterol, CBC, Platelets, Blood Pressure, Oxygen Level, Hemoglobin, etc.)
    - Comparison with standard ranges (for all metrics, using reliable medical sources like UMLS, SNOMED CT).
    - Any abnormal findings with recommendations for further actions.
    - If specific ranges are not provided, use general medical knowledge to determine the normal ranges.

    Medical Report:
    {text}

    Provide the analysis in a structured JSON format with the following keys:
    - Metrics
    - Analysis
    - Recommendations
    """
    
    try:
        model = gemini.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config={
                "max_output_tokens": 3000,
                "temperature": 0.2
            }
        )
        response_text = response.text.strip()
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            cleaned_json = json_match.group(0)
            try:
                analysis = json.loads(cleaned_json)
                logger.info("Successfully analyzed medical report")
                return analysis
            except json.JSONDecodeError as e:
                logger.error("Failed to parse cleaned JSON: %s. Raw response: %s", str(e), cleaned_json)
                raise Exception(f"Failed to parse cleaned JSON: {str(e)}. Raw response: {cleaned_json}")
        else:
            logger.error("No valid JSON found in response: %s", response_text)
            raise Exception(f"No valid JSON found in response: {response_text}")
    except Exception as e:
        logger.error("Error analyzing medical report: %s", str(e))
        raise

def register_routes(app):
    @app.route('/analyze-report', methods=['POST'])
    def analyze_report():
        try:
            if 'file' not in request.files:
                logger.warning("No file part in the request")
                return jsonify({'error': 'No file part in the request'}), 400
            
            file = request.files['file']
            if file.filename == '':
                logger.warning("No file selected")
                return jsonify({'error': 'No file selected'}), 400
                
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                temp_path = os.path.join('uploads', filename)
                os.makedirs('uploads', exist_ok=True)
                file.save(temp_path)
                logger.info("Saved file to: %s", temp_path)
                
                try:
                    file_extension = filename.rsplit('.', 1)[1].lower()
                    if file_extension == 'pdf':
                        extracted_text = extract_text_from_pdf(temp_path)
                    else:
                        extracted_text = extract_text_from_image(temp_path)
                    
                    analysis = analyze_medical_report(extracted_text)
                    return jsonify({
                        'analysis': analysis,
                        'source_type': 'pdf' if file_extension == 'pdf' else 'image'
                    }), 200
                    
                finally:
                    # Ensure the temporary file is removed even if an error occurs
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                        logger.info("Removed temporary file: %s", temp_path)
                    
            else:
                logger.warning("Invalid file type: %s", file.filename)
                return jsonify({'error': 'Invalid file type. Please upload a PDF or image (PNG/JPG/JPEG)'}), 400
                
        except Exception as e:
            logger.error("Error in analyze_report: %s", str(e))
            return jsonify({'error': str(e)}), 500