import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import axios from 'axios';

function AddItemScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [item, setItem] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
    location: ''
  });

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/inventory/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to fetch item details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!item.name || !item.quantity || !item.price || !item.category) {
        setError('Please fill in all required fields');
        return;
      }

      // Make sure quantity and price are valid numbers
      if (isNaN(item.quantity) || isNaN(item.price)) {
        setError('Quantity and price must be valid numbers');
        return;
      }

      // Convert quantity and price to numbers
      const itemData = {
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price)
      };

      let response;
      if (id) {
        // If we have an ID, use PUT to update
        response = await axios.put(`http://localhost:5000/api/inventory/${id}`, itemData);
      } else {
        // If no ID, use POST to create new
        response = await axios.post('http://localhost:5000/api/inventory', itemData);
      }
      
      console.log('Server response:', response.data);
      navigate('/inventory');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'Failed to save item. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setDeleteDialogOpen(false);
      navigate('/inventory');
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error.response?.data?.message || 'Failed to delete item. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {id ? 'Edit Item' : 'Add New Item'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={item.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={item.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={item.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={item.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Delete button (only show when editing) */}
                {id && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Item
                  </Button>
                )}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/inventory')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {id ? 'Update' : 'Add'} Item
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AddItemScreen; 