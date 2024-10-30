import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Card, CardContent, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
// PredictionResult Component
const PredictionResult = ({ data}) => {
    const values = {
        0: 'Normal',
        1: 'LSIL',
        2: 'HSIL',
    };
    const maxIndex = data.indexOf(Math.max(...data));
    const result = values[maxIndex];

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Severity Level
                </Typography>
                <Typography variant="h7" color="#E4D00A" sx={{ display: 'flex', alignItems: 'center'}}>
                   <ArrowForwardIosIcon sx={{color:'#E4D00A', marginRight: 1, height:'20px' }}/> {result}
                </Typography>
            </CardContent>
        </Card>
    );
};

// AbnormalityDetection Component
const AbnormalityDetection = ({ data = [0] }) => {    
    // Ensure 'data' is an array
    if (!Array.isArray(data)) {
        console.error("AbnormalityDetection: 'data' prop should be an array.");
        return null;
    }

    const maxIndex = data.indexOf(Math.max(...data));
    const abnormal = maxIndex > 0;

    return (
        <Card variant="outlined" sx={{ margin: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Abnormality Detection
                </Typography>
                <Typography variant="body1">
                    {abnormal ? (
                        <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                            <ReportIcon sx={{ color: 'red', marginRight: 1 }} />
                            Abnormality has been detected.
                        </div>
                    ) : (
                        <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                            <ReportIcon sx={{ color: 'green', marginRight: 1 }} />
                            No abnormality detected.
                        </div>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
};



export { PredictionResult, AbnormalityDetection };
