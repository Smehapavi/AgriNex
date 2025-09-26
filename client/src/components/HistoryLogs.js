import React, { useState } from 'react';
import styles from './HistoryLogs.module.css';
import axios from 'axios';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  BugReport,
  Speed,
  WaterDrop,
  Refresh,
  Visibility
} from '@mui/icons-material';

const HistoryLogs = ({ logs, loading }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'prediction': return <BugReport />;
      case 'sensor': return <Speed />;
      case 'spray': return <WaterDrop />;
      default: return <Visibility />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prediction': return 'primary';
      case 'sensor': return 'info';
      case 'spray': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = logs.filter(log => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return log.type === 'prediction';
    if (tabValue === 2) return log.type === 'sensor';
    if (tabValue === 3) return log.type === 'spray';
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Alert severity="info">
        No history logs available at the moment.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Refresh color="primary" />
          System History Logs
        </Typography>
        <Tooltip title="Auto-refreshes every 8 seconds">
          <IconButton size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`All (${logs.length})`} />
        <Tab label={`Predictions (${logs.filter(l => l.type === 'prediction').length})`} />
        <Tab label={`Sensors (${logs.filter(l => l.type === 'sensor').length})`} />
        <Tab label={`Sprays (${logs.filter(l => l.type === 'spray').length})`} />
      </Tabs>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Status/Value</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Chip
                    icon={getTypeIcon(log.type)}
                    label={log.type?.toUpperCase() || 'UNKNOWN'}
                    color={getTypeColor(log.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {log.type === 'prediction' && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Plant {log.plantId} - {log.diseaseName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Confidence: {log.confidence}%
                      </Typography>
                    </Box>
                  )}
                  {log.type === 'sensor' && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Sensor Reading
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Moisture: {log.soilMoisture}% | Temp: {log.temperature}°C
                      </Typography>
                    </Box>
                  )}
                  {log.type === 'spray' && (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Nozzle {log.nozzleId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.pesticideType} - {log.mode} mode
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {log.type === 'prediction' && (
                    <Chip
                      label={log.severity?.toUpperCase()}
                      color={getSeverityColor(log.severity)}
                      size="small"
                    />
                  )}
                  {log.type === 'sensor' && (
                    <Chip
                      label={`${log.humidity}% humidity`}
                      color="info"
                      size="small"
                    />
                  )}
                  {log.type === 'spray' && (
                    <Chip
                      label={log.status?.toUpperCase()}
                      color={log.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {log.location?.zone && (
                    <Typography variant="caption" color="text.secondary">
                      Zone {log.location.zone}
                    </Typography>
                  )}
                  {log.location?.coordinates && (
                    <Typography variant="caption" color="text.secondary">
                      ({log.location.coordinates.x}, {log.location.coordinates.y})
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistoryLogs;
