import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management System
        </Typography>
        <Typography variant="body1" paragraph>
          Manage your inventory items efficiently with our comprehensive system
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            onClick={() => navigate('/inventory')}
            size="large"
          >
            View Inventory
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-item')}
            size="large"
          >
            Add New Item
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default HomeScreen; 