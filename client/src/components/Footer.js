import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { Agriculture, Code, GitHub } from '@mui/icons-material';
import styles from './Footer.module.css';
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="xl">
        <Divider sx={{ mb: 2 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Agriculture color="primary" />
            <Typography variant="body2" color="text.secondary">
              AgriNex v1.0.0 - Intelligent Pesticide Sprinkling System
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Code fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                MERN Stack
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={0.5}>
              <GitHub fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Open Source
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          display="block" 
          textAlign="center"
          sx={{ mt: 1 }}
        >
          © 2024 AgriNex Team. Built with React, Node.js, Express, and MongoDB.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
