import React from 'react';
import styles from './SensorPanel.module.css';
import axios from 'axios';

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  WaterDrop,
  Thermostat,
  Air,
  Cloud,
  Speed,
  Compress
} from '@mui/icons-material';

const SensorPanel = ({ sensorData, loading }) => {
  const getMoistureColor = (value) => {
    if (value < 30) return 'error';
    if (value < 60) return 'warning';
    return 'success';
  };

  const getTemperatureColor = (value) => {
    if (value < 10 || value > 35) return 'error';
    if (value < 15 || value > 30) return 'warning';
    return 'success';
  };

  const getHumidityColor = (value) => {
    if (value < 30 || value > 80) return 'error';
    if (value < 40 || value > 70) return 'warning';
    return 'success';
  };

  const getNPKColor = (value) => {
    if (value < 20) return 'error';
    if (value < 40) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sensorData || Object.keys(sensorData).length === 0) {
    return (
      <Alert severity="info">
        No sensor data available at the moment.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Speed color="primary" />
        Real-time Sensor Readings
      </Typography>
      
      <Grid container spacing={2}>
        {/* Soil Moisture */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <WaterDrop color="primary" />
                <Typography variant="h6">Soil Moisture</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <LinearProgress
                    variant="determinate"
                    value={sensorData.soilMoisture || 0}
                    color={getMoistureColor(sensorData.soilMoisture)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="h6">
                  {sensorData.soilMoisture || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Temperature */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Thermostat color="primary" />
                <Typography variant="h6">Temperature</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((sensorData.temperature || 0) * 2, 100)}
                    color={getTemperatureColor(sensorData.temperature)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="h6">
                  {sensorData.temperature || 0}°C
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Humidity */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Air color="primary" />
                <Typography variant="h6">Humidity</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <LinearProgress
                    variant="determinate"
                    value={sensorData.humidity || 0}
                    color={getHumidityColor(sensorData.humidity)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="h6">
                  {sensorData.humidity || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weather */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Cloud color="primary" />
                <Typography variant="h6">Weather</Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip 
                  label={sensorData.weather?.condition || 'Unknown'}
                  color="primary"
                  variant="outlined"
                />
                {sensorData.weather?.windSpeed && (
                  <Typography variant="body2" color="text.secondary">
                    Wind: {sensorData.weather.windSpeed} km/h
                  </Typography>
                )}
                {sensorData.weather?.pressure && (
                  <Typography variant="body2" color="text.secondary">
                    Pressure: {sensorData.weather.pressure} hPa
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* NPK Levels */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Compress color="primary" />
                <Typography variant="h6">NPK Levels</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">Nitrogen</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={sensorData.npkLevels?.nitrogen || 0}
                      color={getNPKColor(sensorData.npkLevels?.nitrogen)}
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />
                    <Typography variant="h6">
                      {sensorData.npkLevels?.nitrogen || 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">Phosphorus</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={sensorData.npkLevels?.phosphorus || 0}
                      color={getNPKColor(sensorData.npkLevels?.phosphorus)}
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />
                    <Typography variant="h6">
                      {sensorData.npkLevels?.phosphorus || 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">Potassium</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={sensorData.npkLevels?.potassium || 0}
                      color={getNPKColor(sensorData.npkLevels?.potassium)}
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />
                    <Typography variant="h6">
                      {sensorData.npkLevels?.potassium || 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SensorPanel;
