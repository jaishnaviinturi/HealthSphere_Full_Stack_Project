import os
import google.generativeai as genai
import logging
from flask import request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY environment variable not set")
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def register_routes(app):
    @app.route('/generate-plan', methods=['POST'])
    def generate_plan():
        try:
            data = request.get_json()
            if not data:
                logger.warning("Invalid request: No input data provided")
                return jsonify({'error': 'No input data provided'}), 400

            age = data.get('age')
            gender = data.get('gender')
            height = data.get('height')
            weight = data.get('weight')
            activity_level = data.get('activityLevel')
            fitness_level = data.get('fitnessLevel')
            primary_goal = data.get('primaryGoal')
            dietary_preference = data.get('dietaryPreference') or 'none'
            plan_type = data.get('planType', 'diet')

            required_fields = ['age', 'gender', 'height', 'weight', 'activityLevel', 'fitnessLevel', 'primaryGoal']
            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                logger.warning("Missing required fields: %s", ", ".join(missing_fields))
                return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

            bmi = weight / ((height / 100) ** 2)

            if plan_type == 'diet':
                prompt = f"""
                You are a fitness and nutrition expert. Generate a personalized nutrition plan for a {age}-year-old {gender} who is {height} cm tall, weighs {weight} kg, has a BMI of {bmi:.1f}, an activity level of "{activity_level}", a fitness level of {fitness_level}/5, a primary goal of "{primary_goal}", and a dietary preference of "{dietary_preference}". 

                Provide the following sections in plain text (do not use markdown or special characters like ** or * for formatting):
                Overview: A brief summary of the user's profile and recommendations (e.g., caloric intake, focus areas).
                Sample Meal Plan: A detailed daily meal plan with breakfast, mid-morning snack, lunch, afternoon snack, dinner, and an optional evening snack.
                Water Intake: Recommended daily water intake.
                Pro Tips: 3-5 actionable tips to help achieve the goal.

                Format the response with clear section headers (e.g., "Overview", "Sample Meal Plan") separated by newlines.
                """
            else:
                prompt = f"""
                You are a fitness and nutrition expert. Generate a personalized workout plan for a {age}-year-old {gender} who is {height} cm tall, weighs {weight} kg, has a BMI of {bmi:.1f}, an activity level of "{activity_level}", a fitness level of {fitness_level}/5, and a primary goal of "{primary_goal}". 

                Provide the following sections in plain text (do not use markdown or special characters like ** or * for formatting):
                Overview: A brief summary of the user's fitness profile and workout recommendations.
                Weekly Workout Plan: A detailed weekly workout plan with exercises for each day (e.g., Monday: Cardio, Tuesday: Strength Training).
                Warm-Up and Cool-Down: Suggested warm-up and cool-down routines.
                Pro Tips: 3-5 actionable tips to help achieve the fitness goal.

                Format the response with clear section headers (e.g., "Overview", "Weekly Workout Plan") separated by newlines.
                """

            logger.info("Generating %s plan for user: age=%s, gender=%s, height=%s cm, weight=%s kg, activity=%s, fitness=%s/5, goal=%s", 
                        plan_type, age, gender, height, weight, activity_level, fitness_level, primary_goal)
            response = model.generate_content(prompt)
            plan = response.text

            logger.info("Successfully generated %s plan", plan_type)
            return jsonify({'plan': plan})

        except Exception as e:
            logger.error("Failed to generate plan: %s", str(e))
            return jsonify({'error': f'Failed to generate plan: {str(e)}'}), 500