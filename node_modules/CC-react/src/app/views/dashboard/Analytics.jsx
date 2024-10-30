import { Fragment } from "react";
import { styled } from "@mui/material";
import StatCards from "./shared/StatCards";
import { DoctorDoughnut } from "./shared/DoughnutDoctor";
import PatientStatisticsChart from "./shared/PatientStatisticCard";
// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));



export default function Analytics() {
  return (
    <Fragment>
      <ContentBox className="analytics">
        <StatCards />
        <DoctorDoughnut />
        {/* <PatientStatisticsChart/> */}
      </ContentBox>
    </Fragment>
  );
}
