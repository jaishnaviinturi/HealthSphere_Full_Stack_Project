import os
import google.generativeai as genai
import logging
from flask import request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.error("GEMINI_API_KEY environment variable not set")
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def get_health_insurance_recommendations(user_profile):
    """
    Generate personalized health insurance recommendations.
    
    Args:
        user_profile (dict): Dictionary containing user details (age, location, etc.)
    
    Returns:
        dict: Response with status and either the plans or an error message
    """
    required_fields = ["age", "location", "health_status", "smoker", "income_level", "family_status"]
    missing_fields = [field for field in required_fields if field not in user_profile]
    if missing_fields:
        logger.warning("Missing required profile fields: %s", ", ".join(missing_fields))
        return {"status": "error", "message": f"Missing required profile fields: {', '.join(missing_fields)}"}

    prompt = f"""
    You are a health insurance expert. Based on the following user profile, dynamically generate a list of 3 suitable health insurance plan options (e.g., HMO, PPO, High-Deductible with HSA) with descriptions tailored to the user’s needs:
    - Age: {user_profile['age']}
    - Location: {user_profile['location']}
    - Health Status: {user_profile['health_status']}
    - Smoker: {user_profile['smoker']}
    - Income Level: {user_profile['income_level']}
    - Family Status: {user_profile['family_status']}
    For each plan, provide:
    1. Plan type (e.g., HMO, PPO)
    2. A short description explaining why it suits the user
    Return the response as a structured list in plain text (do not use markdown or special characters like ** or * for formatting).
    Format each plan as: "Plan Type: [type]\nDescription: [description]\n" with a newline between plans.
    """

    try:
        logger.info("Generating health insurance recommendations for user: %s", user_profile)
        response = model.generate_content(prompt)
        dynamic_plans = response.text
        logger.info("Successfully generated insurance plans")
        return {"status": "success", "plans": dynamic_plans}
    except Exception as e:
        logger.error("Error calling Gemini API: %s", str(e))
        return {"status": "error", "message": f"Error calling Gemini API: {str(e)}"}

def register_routes(app):
    @app.route('/api/health-insurance', methods=['POST'])
    def health_insurance():
        """
        Flask endpoint to handle health insurance recommendation requests.
        
        Expects JSON payload with user profile data.
        Returns JSON response with recommendations or error.
        """
        user_profile = request.get_json()
        if not user_profile:
            logger.warning("Invalid request: No data provided")
            return jsonify({"status": "error", "message": "No data provided"}), 400
        
        result = get_health_insurance_recommendations(user_profile)
        return jsonify(result)