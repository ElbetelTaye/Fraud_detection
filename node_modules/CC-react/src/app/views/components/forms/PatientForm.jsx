import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  styled,
  CircularProgress,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { useDropzone } from "react-dropzone";
import { predictImage, submitFormData } from "app/apis/patients_api";
import { SimpleCard } from "app/components";
import useAuth from "app/hooks/useAuth";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { updatePatientInAPI } from "app/apis/patients_api";
import { AbnormalityDetection, PredictionResult } from "./PredictionResult";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const dropzoneStyle = {
  border: "2px dashed #007bff",
  borderRadius: "4px",
  padding: "5px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "10px",
  height: "50px",
};

function PatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageSection, setImageSection] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const { user } = useAuth();

  const initialFormData = {
    first_name: "",
    last_name: "",
    birthdate: "",
    gender: "",
    job: "job",
    email: "custom@gmail.com",
    mobile: "0974000000",
    region: "region",
    zone: "zone",
    kebele: "kebele",
    image_url: "",
    prediction: [],
    doctor_id: user.id,
  };

  const [formData, setFormData] = useState(initialFormData);

  const onDrop = (acceptedFiles) => {
    const imageFile = acceptedFiles.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      setImagePreview(imageFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const predictImageFile = async (imageFile) => {
    try {
      setIsLoading(true);
      const formData1 = new FormData();
      formData1.append("image", imageFile);
      const predictionResponse = await predictImage(formData1);
      setIsLoading(false);
      return predictionResponse;
    } catch (error) {
      console.error("Error predicting image:", error);
      return null;
    }
  };

  const handleDiagnose = async () => {
    if (imagePreview) {
      setIsLoading(true);
      const predictionResult = await predictImageFile(imagePreview);
      if (predictionResult) {
        setPrediction(predictionResult);
        const updatedFormData = {
          ...formData,
          prediction: predictionResult.predictions || [],
          image_url: predictionResult.image_url || formData.image_url,
        };
        await updatePatientInAPI(formData.id, updatedFormData);
        console.log("Patient updated successfully:", updatedFormData);
      }
      setIsLoading(false);
    }
  };

  const handleShowImageSection = async () => {
    try {
      const response = await submitFormData(formData);
      const patientId = response.id;
      setFormData((prev) => ({ ...prev, id: patientId }));
      setImageSection(true)
    } catch (error) {
      console.error("Error saving patient data:", error);
    }
  };

  return (
    <Container>
      <Stack spacing={3}>
        <SimpleCard title="Patient Details">
          {!imageSection ? (
            <ValidatorForm onSubmit={handleShowImageSection}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="first_name"
                    label="First Name"
                    onChange={handleChange}
                    value={formData.first_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="last_name"
                    label="Last Name"
                    onChange={handleChange}
                    value={formData.last_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="date"
                    name="birthdate"
                    label="Date of Birth"
                    onChange={handleChange}
                    value={formData.birthdate}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Male"
                      label="Male"
                      control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                      value="Female"
                      label="Female"
                      control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                      value="Others"
                      label="Others"
                      control={<Radio color="secondary" />}
                    />
                  </RadioGroup>
                  <TextField
                    type="text"
                    name="mobile"
                    label="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="job"
                    label="Job"
                    onChange={handleChange}
                    value={formData.job}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="region"
                    label="Region"
                    onChange={handleChange}
                    value={formData.region}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="zone"
                    label="Zone"
                    onChange={handleChange}
                    value={formData.zone}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="kebele"
                    label="Kebele"
                    onChange={handleChange}
                    value={formData.kebele}
                    validators={["required"]}
                  />
                </Grid>
              </Grid>
              <Button color="primary" variant="contained" type="submit">
                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save and Continue</Span>
              </Button>
            </ValidatorForm>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={10} xs={12} sx={{ mt: 2 }}>
                  <div {...getRootProps()} style={dropzoneStyle}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop an image here, or click to select one</p>
                  </div>
                </Grid>
                <Grid item lg={4} md={4} sm={2} xs={12} sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleDiagnose}
                    disabled={isLoading}
                  >
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Diagnose</Span>
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12} sx={{ mt: 2 }}>

                  <Box component="section" sx={{ p: 2, border: "1px dashed darkblue", borderRadius: "5px"}}>

                    {imagePreview && (
                      <Zoom>
                        <img
                          src={URL.createObjectURL(imagePreview)}
                          alt="Image Preview"
                          style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                        />
                      </Zoom>
                    )}
                  </Box>

                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12} sx={{ mt: 2 }}>
                  <Box component="section" sx={{ p: 2, border: "1px dashed darkblue", borderRadius: "5px",}}>
                    <Typography variant="h6" component="div" sx={{ marginBottom: 1, textAlign: "center" }}>
                      Diagnosis Result
                    </Typography>
                    {isLoading && (
                      <div style={{ textAlign: "center" }}>
                        <CircularProgress />
                      </div>
                    )}
                    {prediction && (
                      <>
                        <AbnormalityDetection data={prediction.predictions[0]} />
                        <PredictionResult data={prediction.predictions[0]} />
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>

            </>
          )}


        </SimpleCard>
      </Stack>
    </Container>
  );
}

export default PatientForm;
