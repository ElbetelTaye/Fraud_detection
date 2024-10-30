import React from 'react';
import ModifiedAreaChart from './ModifiedAreaChart';
import useAuth from 'app/hooks/useAuth';
import { useState, useEffect } from 'react';
import { fetchPatientForDoctor } from 'app/apis/patients_api';


import { Line } from "react-chartjs-2";
const findMaxIndex = (arr) => {
    if (arr.length === 0) return -1;
  
    let maxIndex = 0; 
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }
    return maxIndex; 
  };
  const calculatePatientStatistics = (patients) => {
    let totalCount = patients.length;
    let healthyCount = 0;
    let abnormalCount = 0;
  
    patients.forEach((patient) => {
      const leftEyePrediction = patient.left_eye_prediction || [];
      const rightEyePrediction = patient.right_eye_prediction || [];
  
      const maxIndexLeft = findMaxIndex(leftEyePrediction);
      const maxIndexRight = findMaxIndex(rightEyePrediction);
  
      console.log(maxIndexLeft, maxIndexRight);
  
      const leftPredictionValue = maxIndexLeft !== -1 ? leftEyePrediction[maxIndexLeft] : -1;
      const rightPredictionValue = maxIndexRight !== -1 ? rightEyePrediction[maxIndexRight] : -1;
      if (leftPredictionValue <= 0 || rightPredictionValue <= 0) {
        healthyCount++;
      } else {
        abnormalCount++;
      }
    });
  
    return {
      totalCount,
      healthyCount,
      abnormalCount,
    };
  };


const PatientStatisticsChart = () => {

    const [patients, setPatients] = useState([]);
    const doctor = useAuth();
  
    useEffect(() => {
      const fetchPatients = async (id) => {
        try {
          const patientData = await fetchPatientForDoctor(id);
          console.log(patientData);
          setPatients(patientData);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      };
      fetchPatients(doctor.user.id);
    }, [doctor.user.id]);
  const { totalCount, healthyCount, abnormalCount } = calculatePatientStatistics(patients);

  const data = {
    labels: ["Total", "Healthy", "Abnormal"], 
    datasets: [
      {
        label: "Patients",
        data: [totalCount, healthyCount, abnormalCount],
        fill: true, // Enable filling the area under the line
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Background color of the area
        borderColor: "rgba(75, 192, 192, 1)", // Color of the line
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Patient Statistics</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default PatientStatisticsChart;
