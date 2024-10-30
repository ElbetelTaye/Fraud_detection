import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBack from "@mui/icons-material/ArrowBack";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import PatientsRecordCard from "../PatientsRecordCard";
import { fetchPatientForDoctor, fetchPatient } from "app/apis/patients_api";
import useAppContext from "app/hooks/useAppContext";
import useAuth from "app/hooks/useAuth";
import PatientProfile from "./PatientProfile";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const PatientsRecord = () => {
  const [page, setPage] = useState(0);
  const { state } = useAppContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(false);
  const doctor = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientData = await fetchPatientForDoctor(doctor.user.id);
        setPatients(patientData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPatients();
  }, []);

  const handlePatientView = async (userId) => {
    try {
      const data = await fetchPatient(userId);
      setPatient(data);
      setViewPatient(true);
    } catch (e) {
      console.error("Error fetching patient", e);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const Severity = {
    0: "Normal",
    1: "LSIL",
    2: "HSIL",
  };

 
  const largestIndex = (predictions) => {
    if (!predictions || predictions.length === 0 || predictions[0].length === 0) {
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
  

  const handleBack = () => {
    setViewPatient(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredpatient = patients.filter((patient) =>
      String(patient.first_name+patient.last_name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <PatientsRecordCard title="Patients Record">
        {!viewPatient ? (
          <Box width="100%" overflow="auto">
            <StyledTable>
              <TableHead>
                <TableRow>
                <TableCell align="center">

<ValidatorForm>
        <TextValidator
            label="Patient Name"
            onChange={(e) => setSearchQuery(e.target.value)}
            name="id"
            value={searchQuery}
            validators={['required']}
            errorMessages={['this field is required']}
        />
    </ValidatorForm>
</TableCell>
                  <TableCell align="center">Mobile</TableCell>
                  <TableCell align="center">Left Eye</TableCell>
                  <TableCell align="center">Right Eye</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredpatient
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">
                        {patient.first_name + " " + patient.last_name}
                      </TableCell>
                      <TableCell align="center">{patient.mobile}</TableCell>
                      <TableCell align="center">
                        {Severity[largestIndex(patient.left_eye_prediction)]}
                      </TableCell><TableCell align="center">
                        {Severity[largestIndex(patient.right_eye_prediction)]}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => handlePatientView(patient.id)}
                            sx={{ "&:hover": { bgcolor: "grey.200" } }}
                          >
                            <VisibilityIcon sx={{ color: "#7c80f1" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </StyledTable>

            <TablePagination
              sx={{ px: 2 }}
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredpatient.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ "aria-label": "Next Page" }}
              backIconButtonProps={{ "aria-label": "Previous Page" }}
            />
          </Box>
        ) : (
          <>
            <Tooltip title="View">
              <IconButton
                onClick={handleBack}
                sx={{ "&:hover": { bgcolor: "grey.200", color: "#7c80f1"} }}
              >
                <ArrowBack sx={{ color: "#7c80f1" }} /> 
              </IconButton>
              Patient History
            </Tooltip>
            {patient && 
          <PatientProfile data={patient} />}
          </>
        )}
      </PatientsRecordCard>
    </Container>
  );
};

export default PatientsRecord;
