# Fraud Detection Project

## Project Overview
This project involves analyzing and detecting fraudulent transactions using multiple datasets:
- `Fraud_Data.csv` contains information about user transactions.
- `Credit_Card_Transactions.csv` includes anonymized credit card transaction data.
- `IpAddress_to_Country.csv` maps IP address ranges to their respective countries.

The main objective is to build a model that can identify fraudulent activities and provide insights into the factors that influence these behaviors.

## Datasets
- **Fraud Data**: Contains transaction details such as `user_id`, `signup_time`, `purchase_time`, `purchase_value`, `device_id`, `source`, `browser`, `sex`, `age`, `ip_address`, and `class` (target variable indicating fraud).
- **Credit Card Transactions**: Contains anonymized features `v1` to `v8`, `Time`, `amount`, and `class` (target variable).
- **IP Address to Country Mapping**: Contains `lower_bound_ip_address`, `upper_bound_ip_address`, and `country`.

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
├── notebooks/
│   ├── data_preprocessing.ipynb
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

## Tasks Overview
1. **Handle Missing Values**: Impute missing values or drop them as necessary.
2. **Data Cleaning**: Remove duplicates, correct data types, and ensure data integrity.
3. **Exploratory Data Analysis (EDA)**: Perform univariate and bivariate analyses to gain insights into the data.
4. **Merge Datasets**: Convert IP addresses to integer format and merge `Fraud_Data.csv` with `IpAddress_to_Country.csv` for geolocation analysis.
5. **Feature Engineering**: Create features like transaction frequency, velocity, and time-based features such as `hour_of_day` and `day_of_week`.
6. **Normalization and Scaling**: Normalize numerical features for better model performance.
7. **Encode Categorical Features**: Convert categorical features into numerical formats for model training.

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

### Data Preprocessing
- Refer to `data_preprocessing.ipynb` for steps taken to clean the data, handle missing values, and perform data type conversions.

### Exploratory Data Analysis (EDA)
- `eda.ipynb` contains visualizations and statistical summaries for univariate and bivariate analyses.

### Feature Engineering
- Detailed steps to create new features are found in `feature_engineering.ipynb`.

## Results and Findings
- Key insights about fraudulent behaviors and patterns in the data.
- Impact of different features on the likelihood of fraud.

## Future Work
- Incorporate additional features.
- Deploy the model using a web framework like FastAPI for real-time predictions.

## Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
