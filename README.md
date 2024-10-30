# Fraud Detection Project

## Project Overview
This project involves analyzing and detecting fraudulent transactions from multiple datasets:
- `Fraud_Data.csv` contains information about user transactions.
- `Credit_Card_Transactions.csv` includes anonymized credit card transaction data.
- `IpAddress_to_Country.csv` maps IP address ranges to their respective countries.

The main objective is to build a model that can identify fraudulent activities and provide insights into the factors that influence these behaviors.

## Datasets
- **Fraud Data**: Contains transaction details such as `user_id`, `signup_time`, `purchase_time`, `purchase_value`, `device_id`, `source`, `browser`, `sex`, `age`, `ip_address`, and `class` (target variable indicating fraud).
- **Credit Card Transactions**: Contains anonymized features `v1` to `v8`, `Time`, `amount`, and `class` (target variable).
- **IP Address to Country Mapping**: Contains `lower_bound_ip_address`, `upper_bound_ip_address`, and `country`.

# Credit and Fraud Detection Model Explainability

This repository contains code for training, saving, and interpreting machine learning models for credit scoring and fraud detection using explainability techniques like SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations). The project primarily focuses on evaluating deep learning models and traditional machine learning classifiers to enhance transparency and trust in model decisions.

## Project Structure
```
fraud-detection-project/
│
├── .github/workflows/
│   └── unittests.yml
│
├── .vscode/
│   └── settings.json
│
├── ceaned_data/
│   ├── preprocessed_Fraud_Data.csv
│   ├── merged_data.csv
│   ├── preprocessed_Credit_Card_Transactions.csv
│   └── preprocessed_IpAddress_to_Country.csv
│
├── data/
│   ├── Fraud_Data.csv
│   ├── Credit_Card_Transactions.csv
│   └── IpAddress_to_Country.csv
│
├── DL_saved_models/
│
├── saved_models/
│
├── notebooks/
│   ├── data_preprocessing.ipynb
│   ├── ML_model_creaditcard_data.ipynb
│   ├── ML_model_fraud_data.ipynb
│   ├── model_Building_Training.ipynb   // DL models for both credit and fraud data
│   └── __init__.py
│
├── scripts/
│   └── __init__.py
|
├── src/
│   └── __init__.py
│
├── test/
│   └── __init__.py
│
├── .gitignore
├── requirements.txt
└── README.md
```

## Notebook Overview

### Model Loading and Data Preparation
The notebook loads various pre-trained models (PyTorch and scikit-learn) for both credit scoring and fraud detection datasets. It also handles dataset preparation, removing irrelevant columns and performing train-test splits. The models are stored in a dictionary format for easy retrieval.

### Explainability Analysis
This section leverages SHAP and LIME libraries for explainability:
1. **SHAP**: Applies SHAP explainability to traditional machine learning models and deep learning models separately. The `KernelExplainer` is used for general-purpose explainability. For each model, SHAP summary plots highlight feature importance, with a specific focus on interpreting the model's predictions for fraud detection and credit risk assessment.
  
2. **LIME**: The notebook generates LIME explanations for both traditional machine learning and deep learning models, providing instance-specific feature contributions. Each LIME analysis focuses on a single sample to demonstrate how specific feature values contribute to the prediction.

### Explainability for PyTorch Models
Custom functions are implemented to compute SHAP values for PyTorch models, accommodating neural network architectures. Additionally, LIME explanations are generated for these models with a custom prediction function to handle binary classification probabilities.


## Fraud and Credit Card Detection Model API

A Flask API for serving and monitoring fraud and credit card detection models, deployed in a Docker container. This API allows users to submit data for predictions on two models:
- **Fraud Detection Model** (Decision Tree model)
- **Credit Card Detection Model** (RNN model)

### Project Structure

```
model_api/
├── models/
│   ├── DecisionTree_Fraud.joblib        # Pre-trained fraud detection model
│   └── RNN_Credit.pt                    # Pre-trained credit card model
├── serve_model.py                       # Main Flask application
├── requirements.txt                     # Python dependencies
└── Dockerfile                           # Docker 
```

## Getting Started

### Prerequisites
- Python 3.8 or above
- Libraries specified in `requirements.txt`

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/ElbetelTaye/Fraud_detection.git
   cd fraud_detection
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install required libraries**:
   ```bash
   pip install -r requirements.txt
   ```

### How to Run the Notebooks
1. Launch Jupyter Notebook:
   ```bash
   jupyter notebook
   ```
2. Open the notebooks in the `notebooks/` directory to explore each step, from data preprocessing to model training.

## Results and Findings
- Key insights about fraudulent behaviors and patterns in the data.
- Impact of different features on the likelihood of fraud.

## Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.