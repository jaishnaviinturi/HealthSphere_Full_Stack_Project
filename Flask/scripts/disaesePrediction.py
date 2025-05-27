import os
os.environ["CUDA_VISIBLE_DEVICES"] = ""  # Disable GPU usage
import numpy as np
import tensorflow as tf
import tensorflow.lite as tflite
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model
import gdown
import logging
import requests
import gc
import psutil
from flask import request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directory to store models in the backend
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Dictionary of model names and their Google Drive direct download links
MODEL_URLS = {
    "Brain_tumor_best_model.h5": "https://drive.google.com/file/d/1-9l5RmFQHnfKxJ9V2GjZ-HlIvAkWgvde/view?usp=sharing",
    "chest_xray_model.tflite": "https://drive.google.com/file/d/15qUKEYV01ANpPzsGEzo0PYYfsTTJZhP6/view?usp=sharing",
    "Vgg16(2).tflite": "https://drive.google.com/file/d/1S4HsS1QcGMD7jZajncPXAzNTXDT5YLXj/view?usp=sharing"
}

# Minimum expected file size for models (in MB)
MIN_MODEL_SIZE_MB = 5

# Mapping of model types to model files and their types
MODEL_FILES = {
    'eye': {'file': 'Vgg16(2).tflite', 'type': 'tflite'},
    'chest': {'file': 'chest_xray_model.tflite', 'type': 'tflite'},
    'brain': {'file': 'Brain_tumor_best_model.h5', 'type': 'h5'}
}

# Cache for loaded models
MODEL_CACHE = {}

# Function to log memory usage
def log_memory_usage():
    process = psutil.Process(os.getpid())
    mem_info = process.memory_info()
    memory_mb = mem_info.rss / (1024 * 1024)  # Convert bytes to MB
    logger.info(f"Current memory usage: {memory_mb:.2f} MB")

# Check if Google Drive link is accessible
def is_url_accessible(url):
    try:
        response = requests.head(url, allow_redirects=True, timeout=10)
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Failed to access URL {url}: {str(e)}")
        return False

# Download a model if it doesn’t exist locally
def download_model(model_name):
    model_path = os.path.join(MODEL_DIR, model_name)
    if os.path.exists(model_path):
        file_size = os.path.getsize(model_path) / (1024 * 1024)  # Size in MB
        if file_size < MIN_MODEL_SIZE_MB:
            logger.info(f"Removing small file {model_name} ({file_size:.2f} MB)")
            os.remove(model_path)
    
    if not os.path.exists(model_path):
        url = MODEL_URLS.get(model_name)
        if not url:
            logger.error(f"No URL found for {model_name}")
            raise ValueError(f"No URL found for {model_name}")
        if not is_url_accessible(url):
            logger.error(f"Google Drive URL for {model_name} is not accessible")
            raise ValueError(f"Google Drive URL for {model_name} is not accessible")
        logger.info(f"Downloading {model_name} from {url}...")
        try:
            gdown.download(url, model_path, quiet=False, fuzzy=True)
            file_size = os.path.getsize(model_path) / (1024 * 1024)  # Size in MB
            logger.info(f"Successfully downloaded {model_name} (Size: {file_size:.2f} MB)")
            if file_size < MIN_MODEL_SIZE_MB:
                logger.error(f"Downloaded file {model_name} is too small ({file_size:.2f} MB)")
                os.remove(model_path)
                raise ValueError(f"Downloaded file {model_name} is too small")
        except Exception as e:
            logger.error(f"Failed to download {model_name}: {str(e)}")
            raise
    return model_path

# Load model based on type
def load_model_for_type(model_type):
    if model_type not in MODEL_FILES:
        raise ValueError(f"Invalid model type: {model_type}")

    model_info = MODEL_FILES[model_type]
    model_name = model_info['file']
    model_path = download_model(model_name)

    if model_type in MODEL_CACHE:
        logger.info(f"Using cached model for {model_type}")
        return MODEL_CACHE[model_type]

    if model_info['type'] == 'h5':
        logger.info(f"Loading .h5 model for {model_type} from {model_path}...")
        model = load_model(model_path)
        MODEL_CACHE[model_type] = {'type': 'h5', 'model': model}
    else:  # tflite
        logger.info(f"Loading .tflite model for {model_type} from {model_path}...")
        interpreter = tflite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        MODEL_CACHE[model_type] = {
            'type': 'tflite',
            'interpreter': interpreter,
            'input_details': interpreter.get_input_details(),
            'output_details': interpreter.get_output_details()
        }
    return MODEL_CACHE[model_type]

# Labels and image sizes for each model type
labels = {
    'eye': ['Age-Related Macular Degeneration', 'Branch Retinal Vein Occlusion',
            'Diabetic Neuropathy', 'Diabetic Retinopathy', 'Macular Hole', 'Myopia',
            'Optic Disc Cupping', 'Optic Disc Edema', 'Optic Disc Pigmentation',
            'Total Scleral Neurodegeneration'],
    'chest': ['NORMAL', 'PNEUMONIA'],
    'brain': ['glioma_tumor', 'no_tumor', 'meningioma_tumor', 'pituitary_tumor']
}

image_sizes = {
    'eye': (128, 128),
    'chest': (256, 256),
    'brain': (150, 150)
}

def preprocess_image(image_path, model_type):
    """Loads and preprocesses image for model prediction."""
    try:
        img = load_img(image_path, target_size=image_sizes[model_type], color_mode='rgb')
        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        # Apply normalization only for eye and chest (.tflite models)
        # Do NOT normalize for brain (.h5 model) as per original working code
        if model_type in ['eye', 'chest']:
            img = img / 255.0  # Normalize to [0, 1] for .tflite models
        return img
    except Exception as e:
        logger.error("Error preprocessing image for %s: %s", model_type, str(e))
        raise

def register_routes(app):
    @app.route('/health', methods=['GET'])
    def health_check():
        """Simple health check endpoint."""
        log_memory_usage()
        logger.info("Health check endpoint accessed")
        return jsonify({'status': 'OK', 'message': 'HealthSphere Disease Prediction Service is running', 'available_models': list(MODEL_FILES.keys())})

    @app.route('/predict', methods=['POST'])
    def predict():
        log_memory_usage()
        if 'image' not in request.files or 'model' not in request.form:
            logger.warning("Invalid request: Missing image or model type")
            return jsonify({'error': 'Missing image or model type'}), 400
        
        image_file = request.files['image']
        model_type = request.form['model']

        if model_type not in MODEL_FILES:
            logger.warning("Invalid model type: %s", model_type)
            return jsonify({'error': f'Invalid model type. Available models: {list(MODEL_FILES.keys())}'}), 400

        image_path = "temp.jpg"
        try:
            image_file.save(image_path)
            logger.info("Image saved at: %s for %s", image_path, model_type)
        except Exception as e:
            logger.error("Failed to save image: %s", str(e))
            return jsonify({'error': f'Failed to save image: {str(e)}'}), 500

        try:
            # Load the model (cached if already loaded)
            model_data = load_model_for_type(model_type)
            logger.info("Model loaded for %s", model_type)

            # Preprocess image
            img = preprocess_image(image_path, model_type)

            # Run inference based on model type
            if model_data['type'] == 'h5':
                model = model_data['model']
                prediction = model.predict(img)
            else:  # tflite
                interpreter = model_data['interpreter']
                input_details = model_data['input_details']
                output_details = model_data['output_details']
                interpreter.set_tensor(input_details[0]['index'], img)
                interpreter.invoke()
                prediction = interpreter.get_tensor(output_details[0]['index'])

            logger.info("Raw prediction for %s: %s", model_type, prediction)
            predicted_index = np.argmax(prediction)
            predicted_label = labels[model_type][predicted_index]

            # Clean up
            os.remove(image_path)
            logger.info("Temporary image removed for %s", model_type)

            # Free up memory (optional, since we cache models)
            gc.collect()
            log_memory_usage()
            
            return jsonify({'prediction': predicted_label})
        except Exception as e:
            if os.path.exists(image_path):
                os.remove(image_path)
            logger.error("Prediction failed for %s: %s", model_type, str(e))
            return jsonify({'error': f'Prediction failed for {model_type}: {str(e)}'}), 500