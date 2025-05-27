from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create the main Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://health-sphere-frontend.vercel.app"]}})

# Import routes from scripts
from scripts import chatbot, disaesePrediction, fitness, insurance, pillRemainder, report, pillIdentifier

# Register routes
chatbot.register_routes(app)
disaesePrediction.register_routes(app)
fitness.register_routes(app)
insurance.register_routes(app)
pillRemainder.register_routes(app)
report.register_routes(app)
pillIdentifier.register_routes(app)

# Add a root route for testing
@app.route('/')
def home():
    return "Hello from HealthSphere Backend!"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)