import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Science,
  Autorenew,
  Build,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const SprayControl = ({ onSprayCommand, predictions, sensorData }) => {
  const [mode, setMode] = useState('auto');
  const [selectedNozzle, setSelectedNozzle] = useState('nozzle-1');
  const [selectedPesticide, setSelectedPesticide] = useState('fungicide');
  const [isSpraying, setIsSpraying] = useState(false);

  const nozzles = [
    { id: 'nozzle-1', name: 'Nozzle 1 (Zone A)' },
    { id: 'nozzle-2', name: 'Nozzle 2 (Zone B)' },
    { id: 'nozzle-3', name: 'Nozzle 3 (Zone C)' },
    { id: 'nozzle-4', name: 'Nozzle 4 (Zone D)' }
  ];

  const pesticides = [
    { id: 'fungicide', name: 'Fungicide' },
    { id: 'herbicide', name: 'Herbicide' },
    { id: 'insecticide', name: 'Insecticide' },
    { id: 'fertilizer', name: 'Fertilizer' }
  ];

  // Auto mode recommendation logic
  const getAutoRecommendation = () => {
    const criticalPredictions = predictions.filter(p => p.severity === 'critical' || p.severity === 'high');
    const lowMoisture = sensorData.soilMoisture < 30;
    const highHumidity = sensorData.humidity > 80;
    
    if (criticalPredictions.length > 0) {
      return {
        shouldSpray: true,
        reason: `Critical disease detected: ${criticalPredictions[0].diseaseName}`,
        recommendedPesticide: 'fungicide',
        severity: 'error'
      };
    }
    
    if (lowMoisture) {
      return {
        shouldSpray: true,
        reason: 'Low soil moisture detected',
        recommendedPesticide: 'fertilizer',
        severity: 'warning'
      };
    }
    
    if (highHumidity) {
      return {
        shouldSpray: false,
        reason: 'High humidity - spraying not recommended',
        severity: 'info'
      };
    }
    
    return {
      shouldSpray: false,
      reason: 'All conditions normal - no spraying needed',
      severity: 'success'
    };
  };

  const handleSpray = async () => {
    setIsSpraying(true);
    try {
      await onSprayCommand({
        nozzleId: selectedNozzle,
        pesticideType: selectedPesticide,
        mode: mode
      });
    } catch (error) {
      console.error('Spray command failed:', error);
    } finally {
      setIsSpraying(false);
    }
  };

  const autoRecommendation = getAutoRecommendation();

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Science color="primary" />
        Spray Control System
      </Typography>

      {/* Mode Selection */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'auto'}
                onChange={(e) => setMode(e.target.checked ? 'auto' : 'manual')}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {mode === 'auto' ? <Autorenew /> : <Build />}
                <Typography variant="h6">
                  {mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Auto Mode */}
      {mode === 'auto' && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Recommendation
            </Typography>
            <Alert 
              severity={autoRecommendation.severity}
              sx={{ mb: 2 }}
            >
              {autoRecommendation.reason}
            </Alert>
            
            {autoRecommendation.shouldSpray ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Recommended Action: Spray {autoRecommendation.recommendedPesticide}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Science />}
                  onClick={handleSpray}
                  disabled={isSpraying}
                  sx={{ mt: 1 }}
                >
                  {isSpraying ? 'Spraying...' : 'Execute Auto Spray'}
                </Button>
              </Box>
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircle color="success" />
                <Typography variant="body2" color="text.secondary">
                  No spraying required at this time
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manual Spray Control
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Nozzle</InputLabel>
                  <Select
                    value={selectedNozzle}
                    label="Select Nozzle"
                    onChange={(e) => setSelectedNozzle(e.target.value)}
                  >
                    {nozzles.map((nozzle) => (
                      <MenuItem key={nozzle.id} value={nozzle.id}>
                        {nozzle.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Pesticide Type</InputLabel>
                  <Select
                    value={selectedPesticide}
                    label="Pesticide Type"
                    onChange={(e) => setSelectedPesticide(e.target.value)}
                  >
                    {pesticides.map((pesticide) => (
                      <MenuItem key={pesticide.id} value={pesticide.id}>
                        {pesticide.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Science />}
                  onClick={handleSpray}
                  disabled={isSpraying}
                  fullWidth
                >
                  {isSpraying ? 'Spraying...' : 'Execute Manual Spray'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Current Status */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Chip 
                label={`Active Nozzles: ${nozzles.length}`}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Chip 
                label={`Mode: ${mode.toUpperCase()}`}
                color={mode === 'auto' ? 'primary' : 'secondary'}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SprayControl;
