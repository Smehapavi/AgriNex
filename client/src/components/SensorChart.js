import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const SensorChart = ({ sensorHistory }) => {
  if (!sensorHistory || sensorHistory.length === 0) {
    return (
      <Paper sx={{ p: 2, height: 300 }}>
        <Typography variant="h6" gutterBottom>
          Sensor Trends
        </Typography>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="100%"
        >
          <Typography color="text.secondary">
            No sensor data available for chart
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Format data for the chart
  const chartData = sensorHistory.map(sensor => ({
    time: new Date(sensor.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    moisture: sensor.soilMoisture,
    temperature: sensor.temperature,
    humidity: sensor.humidity,
    nitrogen: sensor.npkLevels?.nitrogen,
    phosphorus: sensor.npkLevels?.phosphorus,
    potassium: sensor.npkLevels?.potassium
  }));

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Sensor Trends (Last 24 Hours)
      </Typography>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="moisture" 
            stroke="#2e7d32" 
            strokeWidth={2}
            name="Soil Moisture (%)"
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#ff6f00" 
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line 
            type="monotone" 
            dataKey="humidity" 
            stroke="#1976d2" 
            strokeWidth={2}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SensorChart;
