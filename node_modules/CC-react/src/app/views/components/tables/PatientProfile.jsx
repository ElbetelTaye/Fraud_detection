import React from "react";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "200px",
  },
}));

const PatientProfile = ({ data }) => {
  const classes = useStyles();

  const Severity = {
    0: "Normal",
    1: "LSIL",
    2: "HSIL",
  };

  const largestIndex = (predictions) => {
    if (!predictions || predictions.length === 0 || !predictions[0] || predictions[0].length === 0) {
      return -1;
    }

    let largestIndex = 0;
    for (let i = 1; i < predictions[0].length; i++) {
      if (predictions[0][i] > predictions[0][largestIndex]) {
        largestIndex = i;
      }
    }
    return largestIndex;
  };


  // Base URL for media files
  const mediaBaseUrl = 'http://localhost:8000/media/raw/';

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2} justifyContent="flex">

          <Grid item xs={12} sm={6} md={6} lg={6}>

            <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>

              {data.image_url && (
                <>
                  <Typography align="center" style={{ maxWidth: "80%", maxHeight: "80%" }}>
                    Image
                  </Typography>
                  <Zoom>
                    <img
                      src={`${mediaBaseUrl}${data.image_url.split('\\').pop()}`}
                      alt="Image" style={{ maxWidth: "100%", maxHeight: "100%" }}
                      className={classes.image}
                    />
                  </Zoom>

                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>
              <Grid container spacing={2} justifyContent="flex" >
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Typography variant="h6" align="left" gutterBottom style={{ color: '#191970' }}>
                    {`${data.first_name} ${data.last_name}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`${data.gender}, ${data.birthdate}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Email: ${data.email}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Mobile: ${data.mobile}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Job: ${data.job}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>

                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Region: ${data.region}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Zone: ${data.zone}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Kebele: ${data.kebele}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Screening Date: ${data.record_date}`}
                  </Typography>
                  <Typography variant="subtitle1" align="left" gutterBottom>
                    {`Severity Level: ${Severity[largestIndex(data.prediction)] ? Severity[largestIndex(data.prediction)] : "Not Scanned"}`}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PatientProfile;
