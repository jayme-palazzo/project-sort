import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import InventoryListScreen from './screens/InventoryListScreen';
import AddItemScreen from './screens/AddItemScreen';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Layout component for protected routes
function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <InventoryListScreen />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-item" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <AddItemScreen />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-item/:id" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <AddItemScreen />
                  </ProtectedLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/inventory" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 