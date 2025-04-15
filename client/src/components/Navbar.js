import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <InventoryIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Inventory Management
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/inventory">
            Inventory
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-item">
            Add Item
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 