import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, FormControlLabel, Switch } from '@mui/material';
import { Agriculture, Refresh } from '@mui/icons-material';

const Header = ({ lastUpdate, autoRefresh, onToggleAutoRefresh }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Agriculture sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AgriNex - Intelligent Pesticide Sprinkling System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={!!autoRefresh}
                onChange={onToggleAutoRefresh}
                color="default"
              />
            }
            label={<Typography variant="caption" sx={{ color: 'white' }}>Auto refresh</Typography>}
          />
          <Refresh sx={{ fontSize: 16 }} />
          <Chip 
            label={`Last Update: ${formatTime(lastUpdate)}`}
            size="small"
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              '& .MuiChip-label': {
                fontSize: '0.75rem'
              }
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
