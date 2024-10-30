import React from 'react';
import { Card, Box, styled, Grid } from "@mui/material";
import useAppContext from 'app/hooks/useAppContext';

/////////////////////////////////
const CardRoot = styled(Card)({
    height: "100%",
    padding: "20px 24px"
});

const CardTitle = styled("div")(({ subtitle }) => ({
    fontSize: "1rem",
    fontWeight: "500",
    textTransform: "capitalize",
    marginBottom: !subtitle && "16px"
}));


const PatientsRecordCard = ({ children, title, subtitle }) => {


    return (
        <CardRoot elevation={6}>
            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <CardTitle subtitle={subtitle}>{title}</CardTitle>
                </Grid>

            </Grid>
            {subtitle && <Box mb={2}>{subtitle}</Box>}
            {children}
        </CardRoot>
    );
};

export default PatientsRecordCard;
