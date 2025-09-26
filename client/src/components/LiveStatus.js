import React from 'react';
import styles from './LiveStatus.module.css';
import axios from 'axios';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { BugReport, Warning, CheckCircle, Error } from '@mui/icons-material';

const LiveStatus = ({ predictions, loading }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'error';
      case 'Moderate': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High': return <Error />;
      case 'Moderate': return <Warning />;
      case 'Low': return <BugReport />;
      default: return <BugReport />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <Alert severity="info">
        No plant disease predictions available at the moment.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReport color="primary" />
        Live Plant Disease Detection Status
      </Typography>
      
      <Grid container spacing={2}>
        {predictions.map((prediction, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: prediction.severity ? getSeverityColor(prediction.severity) : 'divider'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {prediction.severity ? getSeverityIcon(prediction.severity) : <CheckCircle />}
                  <Typography variant="h6" component="div">
                    {prediction.plantId ? `Plant ${prediction.plantId}` : 'Leaf'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {prediction.status === 'Healthy' ? 'Healthy' : prediction.disease}
                </Typography>
                {prediction.status === 'Unhealthy' && (
                  <Chip 
                    label={`Severity: ${prediction.severity}`}
                    color={getSeverityColor(prediction.severity)}
                    size="small"
                  />
                )}
                {prediction.location && (
                  <Typography variant="caption" color="text.secondary">
                    Zone: {prediction.location.zone || 'Unknown'}
                  </Typography>
                )}
                {prediction.recommendation && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    {prediction.recommendation}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LiveStatus;
