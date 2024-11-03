from dash import Dash, html, dcc
import plotly.express as px
import pandas as pd
from flask import Flask
from datetime import datetime
import socket
import struct

# Initialize Flask app
server = Flask(__name__)

# Initialize Dash app
app = Dash(__name__, server=server)

# Helper function to convert IP to integer
def ip_to_int(ip):
    try:
        return struct.unpack("!I", socket.inet_aton(ip))[0]
    except socket.error:
        return None  # Handle invalid IPs gracefully

# Load datasets
def load_data():
    fraud_data = pd.read_csv('C:/Users/elbet/OneDrive/Desktop/Ten/week8&9/github/Fraud_detection/Data/cleaned_data/Preprocessed_Fraud_Data.csv')
    credit_data = pd.read_csv('C:/Users/elbet/OneDrive/Desktop/Ten/week8&9/github/Fraud_detection/Data/cleaned_data/Preprocessed_Creditcard_Data')
    ip_country = pd.read_csv('C:/Users/elbet/OneDrive/Desktop/Ten/week8&9/github/Fraud_detection/Data/cleaned_data/Preprocessed_IpAddress_to_Country')
    return fraud_data, credit_data, ip_country

# Data processing functions
def process_ecommerce_data(fraud_data, ip_country):
    fraud_data_cleaned = fraud_data.copy()
    ip_country_cleaned = ip_country.copy()

    fraud_data_cleaned['signup_time'] = pd.to_datetime(fraud_data_cleaned['signup_time'])
    fraud_data_cleaned['purchase_time'] = pd.to_datetime(fraud_data_cleaned['purchase_time'])
    fraud_data_cleaned['purchase_day'] = fraud_data_cleaned['purchase_time'].dt.day_name()
    fraud_data_cleaned['purchase_hour'] = fraud_data_cleaned['purchase_time'].dt.hour
    fraud_data_cleaned['ip_int'] = fraud_data_cleaned['ip_address'].apply(lambda x: ip_to_int(str(int(x))) if pd.notna(x) else None)
    
    ip_country_cleaned['lower_bound_ip_address'] = ip_country_cleaned['lower_bound_ip_address'].astype('int64')
    ip_country_cleaned['upper_bound_ip_address'] = ip_country_cleaned['upper_bound_ip_address'].astype('int64')
    fraud_data_cleaned['ip_int'] = fraud_data_cleaned['ip_int'].astype('int64')
    
    ip_country_cleaned.sort_values('lower_bound_ip_address', inplace=True)
    fraud_data_with_country = pd.merge_asof(
        fraud_data_cleaned.sort_values('ip_int'),
        ip_country_cleaned[['lower_bound_ip_address', 'upper_bound_ip_address', 'country']],
        left_on='ip_int',
        right_on='lower_bound_ip_address',
        direction='backward'
    )
    fraud_data_with_country = fraud_data_with_country[
        (fraud_data_with_country['ip_int'] >= fraud_data_with_country['lower_bound_ip_address']) &
        (fraud_data_with_country['ip_int'] <= fraud_data_with_country['upper_bound_ip_address'])
    ]
    fraud_data_with_country.drop(['lower_bound_ip_address', 'upper_bound_ip_address'], axis=1, inplace=True)
    
    return fraud_data_with_country

def create_summary_stats(fraud_data, credit_data):
    ecom_stats = {
        'total_transactions': len(fraud_data),
        'fraud_cases': fraud_data['class'].sum(),
        'fraud_percentage': (fraud_data['class'].sum() / len(fraud_data) * 100).round(2)
    }
    credit_stats = {
        'total_transactions': len(credit_data),
        'fraud_cases': credit_data['Class'].sum(),
        'fraud_percentage': (credit_data['Class'].sum() / len(credit_data) * 100).round(2)
    }
    return ecom_stats, credit_stats

# Load and process data
fraud_data, credit_data, ip_country = load_data()
fraud_data_processed = process_ecommerce_data(fraud_data, ip_country)
ecom_stats, credit_stats = create_summary_stats(fraud_data_processed, credit_data)

# Create the dashboard layout
app.layout = html.Div([
    # Navigation bar
    html.Div([
        html.H1('Fraud Detection Dashboard', className='nav-title'),
        html.P('fraud analytics and insights', className='nav-subtitle')
    ], className='navbar'),

    # Main content container
    html.Div([
        # Summary Statistics Cards
        html.Div([
            html.Div([
                html.Div([
                    html.I(className='fas fa-shopping-cart stat-icon'),
                    html.Div([
                        html.H3('E-commerce Transactions'),
                        html.Div([
                            html.P([
                                html.Span('Total Transactions: ', className='stat-label'),
                                html.Span(f"{ecom_stats['total_transactions']:,}", className='stat-value')
                            ]),
                            html.P([
                                html.Span('Fraud Cases: ', className='stat-label'),
                                html.Span(f"{ecom_stats['fraud_cases']:,}", className='stat-value fraud-value')
                            ]),
                            html.P([
                                html.Span('Fraud Percentage: ', className='stat-label'),
                                html.Span(f"{ecom_stats['fraud_percentage']}%", className='stat-value fraud-value')
                            ])
                        ], className='stat-details')
                    ])
                ], className='stat-card')
            ], className='col-md-6'),

            html.Div([
                html.Div([
                    html.I(className='fas fa-credit-card stat-icon'),
                    html.Div([
                        html.H3('Credit Card Transactions'),
                        html.Div([
                            html.P([
                                html.Span('Total Transactions: ', className='stat-label'),
                                html.Span(f"{credit_stats['total_transactions']:,}", className='stat-value')
                            ]),
                            html.P([
                                html.Span('Fraud Cases: ', className='stat-label'),
                                html.Span(f"{credit_stats['fraud_cases']:,}", className='stat-value fraud-value')
                            ]),
                            html.P([
                                html.Span('Fraud Percentage: ', className='stat-label'),
                                html.Span(f"{credit_stats['fraud_percentage']}%", className='stat-value fraud-value')
                            ])
                        ], className='stat-details')
                    ])
                ], className='stat-card')
            ], className='col-md-6')
        ], className='row stats-container'),

        # Other Sections like Charts can be included below...
    ], className='main-content')
])

if __name__ == "__main__":
    app.run_server(host="0.0.0.0", port=8080, debug=False)
