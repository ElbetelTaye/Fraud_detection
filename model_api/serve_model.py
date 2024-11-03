from flask import Flask, request, jsonify, send_from_directory
import torch
import joblib
import torch.nn.functional as F
import numpy as np
from model_definitions import RNNModel
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(
    filename='app.log', 
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

input_size = 194  # Define input size for the CNN model

# Load the credit card fraud detection model
creditcard_model = joblib.load('model_api/models/Decision_Tree.joblib')

# Initialize and load the CNN model for fraud detection
fraud_model = RNNModel(input_size)
fraud_model.load_state_dict(torch.load('model_api/models/RNN_Fraud.pt'))
fraud_model.eval()


@app.route('/')
def home():
    app.logger.info("Home endpoint accessed")
    return "Model API for Fraud and Credit Card Detection is running!"

@app.route('/predict/creditcard', methods=['POST'])
def predict_creditcard():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        prediction = creditcard_model.predict(features)
        
        app.logger.info(f"Credit prediction request received with data: {data}")
        app.logger.info(f"Credit prediction result: {prediction[0]}")
        
        return jsonify({'prediction': prediction[0]})
    except Exception as e:
        app.logger.error(f"Error in credit prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/fraud', methods=['POST'])
def predict_fraud():
    try:
        data = request.json['data']
        input_tensor = torch.tensor(data, dtype=torch.float32)
        
        # Reshape input if needed to match model's input expectations
        if input_tensor.ndim == 1:
            input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension if missing
        
        with torch.no_grad():
            output = fraud_model(input_tensor)
            probabilities = F.softmax(output, dim=1).numpy().tolist()
        
        app.logger.info(f"Fraud prediction request received with data: {data}")
        app.logger.info(f"Fraud prediction probabilities: {probabilities}")
        
        return jsonify({'fraud_predictions': probabilities})
    except Exception as e:
        app.logger.error(f"Error in fraud prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)  # Corrected comment syntax
