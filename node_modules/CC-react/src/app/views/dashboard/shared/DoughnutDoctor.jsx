import { Card, Grid, useTheme } from "@mui/material";
import DoughnutChart from "./Doughnut";
import useAuth from "app/hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchPatientForDoctor } from "app/apis/patients_api";

const findMaxIndex = (arr) => {
  if (!arr || arr.length === 0) return -1; // Check if the array is null or empty

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
  let normalCount = 0;
  let lsilCount = 0;
  let hsilCount = 0;

  patients.forEach((patient) => {
    const prediction = patient.prediction || []; // Default to empty array if null
    const maxIndex = findMaxIndex(prediction);

    // Classification based on max index: 0 for Normal, 1 for LSIL, 2 for HSIL
    if (maxIndex === 0) {
      normalCount++;
    } else if (maxIndex === 1) {
      lsilCount++;
    } else if (maxIndex === 2) {
      hsilCount++;
    }
  });

  return {
    totalCount,
    normalCount,
    lsilCount,
    hsilCount,
  };
};

export const DoctorDoughnut = () => {
  const { palette } = useTheme();
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

  const { totalCount, normalCount, lsilCount, hsilCount } = calculatePatientStatistics(patients);

  const resultDistribution = {
    Normal: normalCount,
    LSIL: lsilCount,
    HSIL: hsilCount,
  };

  const genderDistribution = patients.reduce((acc, person) => {
    acc[person.gender] = (acc[person.gender] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card sx={{ px: 3, py: 2, mb: 3, textAlign: "center" }}>
            <DoughnutChart
              title="Patient Gender Distributions"
              record={genderDistribution}
              height="300px"
              color={[
                palette.primary.dark,
                palette.primary.main,
                palette.primary.light,
              ]}
            />
          </Card>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Card sx={{ px: 3, py: 2, mb: 3, textAlign: "center" }}>
            <DoughnutChart
              title="Patients Summary"
              record={resultDistribution}
              height="300px"
              color={[
                palette.primary.dark,
                palette.primary.main,
                palette.primary.light,
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
