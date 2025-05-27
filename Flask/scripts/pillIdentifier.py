from flask import Blueprint, request, jsonify
from google.generativeai import GenerativeModel, configure
import os
import base64
from werkzeug.utils import secure_filename

# Initialize Blueprint
pill_identifier = Blueprint('pill_identifier', __name__)

# Configure Google Generative AI
configure(api_key=os.getenv('GEMINI_API_KEY'))

# Disclaimer text
DISCLAIMER = "\n\nIMPORTANT: This information is for educational purposes only and should not be considered medical advice. Always consult a qualified healthcare professional before starting, stopping, or changing any medication. They can provide personalized advice based on your specific medical history and current conditions."

# Allowed image MIME types
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png'}

# Maximum file size (e.g., 10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes

@pill_identifier.route('/api/pill/image', methods=['POST'])
def analyze_image():
    try:
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({'error': 'Invalid or empty file'}), 400

        # Validate file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File size exceeds 10MB limit'}), 400
        file.seek(0)  # Reset file pointer

        # Validate MIME type using Flask's mimetype
        mime_type = file.mimetype
        if mime_type not in ALLOWED_MIME_TYPES:
            return jsonify({'error': f'Unsupported file type. Only {", ".join(ALLOWED_MIME_TYPES)} are allowed'}), 400

        # Read and encode file content
        file_content = file.read()
        base64_content = base64.b64encode(file_content).decode('utf-8')

        # Initialize the model
        model = GenerativeModel('gemini-1.5-flash')

        # Define a more specific prompt
        prompt = (
            "Analyze the provided image of a pill or medication. Identify the medication based on visual characteristics such as shape, color, size, and any imprints or markings. "
            "Provide the following information in natural language, formatted in paragraphs without numbered lists or bullet points: "
            "the medication name and its generic name, its primary uses and purpose, common side effects, important precautions, and typical dosage. "
            "If the pill cannot be identified, clearly state that the identification was unsuccessful and suggest consulting a healthcare professional or pharmacist."
        )

        # Generate content
        result = model.generate_content([
            {
                'inline_data': {
                    'mime_type': mime_type,
                    'data': base64_content
                }
            },
            prompt
        ])

        # Check if the API returned valid content
        if not result or not result.text:
            return jsonify({'error': 'Unable to identify the pill. Please try a clearer image or consult a pharmacist.'}), 400

        response = result.text + DISCLAIMER
        return jsonify({'result': response})

    except ValueError as ve:
        print(f"ValueError in image analysis: {str(ve)}")
        return jsonify({'error': 'Invalid image data or API issue. Please try again.'}), 400
    except Exception as e:
        print(f"Error in image analysis: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

@pill_identifier.route('/api/pill/search', methods=['POST'])
def search_pill():
    try:
        data = request.get_json()
        search_text = data.get('searchText')
        if not search_text or not search_text.strip():
            return jsonify({'error': 'No search text provided'}), 400

        # Sanitize input
        search_text = search_text.strip()

        # Initialize the model
        model = GenerativeModel('gemini-1.5-flash')

        # Define the prompt with improved clarity
        prompt = (
            f"Provide detailed information about the medication {search_text} in natural language. "
            "Include its generic name, primary uses and purpose, common side effects, important precautions, and typical dosage. "
            "Format the response in paragraphs without numbered lists or bullet points. "
            "If the medication is not recognized, clearly state that the medication could not be identified and suggest consulting a healthcare professional."
        )

        # Generate content
        result = model.generate_content(prompt)
        
        # Check if the API returned valid content
        if not result or not result.text:
            return jsonify({'error': 'Unable to find information about the medication. Please check the name and try again.'}), 400

        response = result.text + DISCLAIMER
        return jsonify({'result': response})

    except ValueError as ve:
        print(f"ValueError in search: {str(ve)}")
        return jsonify({'error': 'Invalid input or API issue. Please try again.'}), 400
    except Exception as e:
        print(f"Error searching medication: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

def register_routes(app):
    app.register_blueprint(pill_identifier)