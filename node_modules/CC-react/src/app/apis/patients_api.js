import axios from 'axios';

// Base URL for your API
const API_PATIENT_URL = 'http://127.0.0.1:8000/api/patients/';
const token = localStorage.getItem('token');  



// MAKE THE PREDICTION API
export const predictImage = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}predict_image/`, formData,{
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};

// TO ADD THE DATAFORM PLUGIN
export const submitFormData = async (formData) => {
  try {
    const response = await axios.post(`${API_PATIENT_URL}add/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw error;
  }
};

// FETCH THE DATA FOR EACH DOCTOR (ONLY PATIENTS SCREENED BY THE DOCTOR ITSELF)
export const fetchPatientForDoctor = async (doctor_id) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}doctor/${doctor_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients for doctor:', error);
    throw error;
  }
};

// FETCH INDIVIDUAL PATIENTS API
export const fetchPatient = async (p_id) => {
  try {
    const response = await axios.get(`${API_PATIENT_URL}${p_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};


  // UPDATE PATIENT FUNCTION IN API CALLS
  export const updatePatientInAPI = async (id, formData) => {
    try {
        const response = await axios.put(`${API_PATIENT_URL}update/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating breed:', error);
        throw error;
    }
};
