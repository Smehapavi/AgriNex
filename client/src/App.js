import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import Header from './components/Header';
import LiveStatus from './components/LiveStatus';
import SensorPanel from './components/SensorPanel';
import SensorChart from './components/SensorChart';
import SprayControl from './components/SprayControl';
import HistoryLogs from './components/HistoryLogs';
import Footer from './components/Footer';
import { apiService } from './services/apiService';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // Green for agriculture theme
    },
    secondary: {
      main: '#ff6f00', // Orange for alerts
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  const [predictions, setPredictions] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [sensorHistory, setSensorHistory] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch all data
  const fetchAllData = async () => {
  try {
    setLoading(true);
    const [predictionsData, sensorsData, sensorsHistoryData, historyData] = await Promise.all([
      apiService.getPredictions(),
      apiService.getSensors(),
      apiService.getSensorsHistory(24),
      apiService.getHistory()
    ]);

    // Transform predictions to match your component
    const formattedPredictions = predictionsData.map(p => ({
      disease: p.disease,
      severity: p.severity,
      status: p.status,
      timestamp: p.timestamp
    }));

    setPredictions(formattedPredictions);
    setSensorData(sensorsData);
    setSensorHistory(sensorsHistoryData);
    setHistoryLogs(historyData);
    setLastUpdate(new Date());
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};


  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh every 8 seconds (toggleable)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchAllData, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle spray command
  const handleSprayCommand = async (sprayData) => {
    try {
      await apiService.sendSprayCommand(sprayData);
      // Refresh data after spray command
      fetchAllData();
    } catch (error) {
      console.error('Error sending spray command:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header 
          lastUpdate={lastUpdate} 
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
        />
        
        <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
          <Grid container spacing={3}>
            {/* Live Status - Top Row */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <LiveStatus predictions={predictions} loading={loading} />
              </Paper>
            </Grid>

            {/* Sensor Panel and Spray Control - Second Row */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <SensorPanel sensorData={sensorData} loading={loading} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <SprayControl 
                  onSprayCommand={handleSprayCommand}
                  predictions={predictions}
                  sensorData={sensorData}
                />
              </Paper>
            </Grid>

            {/* Sensor Chart - Third Row */}
            <Grid item xs={12}>
              <SensorChart sensorHistory={sensorHistory} />
            </Grid>

            {/* History Logs - Bottom Row */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <HistoryLogs logs={historyLogs} loading={loading} />
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
