import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import HomeScreen from './screens/HomeScreen';
import InventoryListScreen from './screens/InventoryListScreen';
import AddItemScreen from './screens/AddItemScreen';
import Navbar from './components/Navbar';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/inventory" element={<InventoryListScreen />} />
          <Route path="/add-item" element={<AddItemScreen />} />
          <Route path="/edit-item/:id" element={<AddItemScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 