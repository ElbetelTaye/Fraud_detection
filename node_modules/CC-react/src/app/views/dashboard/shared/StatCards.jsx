import { Box, Card, Grid, styled } from "@mui/material";
import { Group } from "@mui/icons-material";
import { Small } from "app/components/Typography";
import { fetchPatientForDoctor } from "app/apis/patients_api";
import useAuth from "app/hooks/useAuth";
import { useEffect, useState } from "react";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

export default function StatCards() {
  const [patients, setPatients] = useState([]);
  const {user} = useAuth();

  const fetchPatients = async (id) => {
    try {
      const patientData = await fetchPatientForDoctor(id);
      setPatients(patientData);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients(user.id);
  }, [user.id]);

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
    console.log("patients:", patients);
    let totalCount = patients?.length || 0;
    let healthyCount = 0;
    let abnormalCount = 0;

    patients.forEach((patient) => {
        const leftEyePrediction = patient.left_eye_prediction || []; // Default to empty array if null
        const rightEyePrediction = patient.right_eye_prediction || []; // Default to empty array if null

        const maxIndexLeft = findMaxIndex(leftEyePrediction);
        const maxIndexRight = findMaxIndex(rightEyePrediction);

        console.log(maxIndexLeft, maxIndexRight);

        // Ensure we only check valid indices before accessing the values
        const leftPredictionValue = maxIndexLeft !== -1 ? leftEyePrediction[maxIndexLeft] : -1;
        const rightPredictionValue = maxIndexRight !== -1 ? rightEyePrediction[maxIndexRight] : -1;

        // Assuming that a healthy prediction value is less than or equal to 0
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


console.log(patients)
  const records = calculatePatientStatistics(patients);
  const cardList = [
    { name: "Total Patients", amount: records.totalCount, Icon: Group },
    { name: "Normal Patients", amount: records.healthyCount, Icon: Group },
    { name: "Abnormal Patients", amount: records.abnormalCount, Icon: Group },
  ];

  return (
    <Grid container spacing={4} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name }) => (
        <Grid item xs={12} md={4} lg={4} key={name}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon" />
              <Box ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
