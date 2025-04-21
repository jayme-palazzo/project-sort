import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  // Get the first letter of the username for the avatar
  const getInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Brand */}
        <InventoryIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/inventory"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1
          }}
        >
          Prism
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/inventory"
            startIcon={<InventoryIcon />}
          >
            Inventory
          </Button>

          {/* User Menu */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 2 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'secondary.main',
                fontSize: '0.875rem'
              }}
            >
              {getInitial()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem sx={{ pointerEvents: 'none' }}>
              <Typography variant="body2" color="textSecondary">
                Signed in as
              </Typography>
            </MenuItem>
            <MenuItem sx={{ pointerEvents: 'none' }}>
              <Typography variant="body1" fontWeight="medium">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 