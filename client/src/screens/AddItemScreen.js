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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryService from '../services/InventoryService';
import CategoryService from '../services/CategoryService';
import { useAuth } from '../context/AuthContext';

function AddItemScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: null,
    location: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newCategoryDialog, setNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories and item data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await CategoryService.getCategories();
        setCategories(categoriesData);

        // If editing, fetch item data
        if (id) {
          const itemData = await InventoryService.getItem(id);
          setItem({
            ...itemData,
            category: categoriesData.find(c => c._id === itemData.category._id)
          });
        }
      } catch (error) {
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    if (!item.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!item.quantity || item.quantity < 0) {
      setError('Quantity must be a positive number');
      return false;
    }
    if (!item.price || item.price < 0) {
      setError('Price must be a positive number');
      return false;
    }
    if (!item.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!validateForm()) return;

    try {
      setSaving(true);
      const itemData = {
        ...item,
        category: item.category._id,
        quantity: Number(item.quantity),
        price: Number(item.price)
      };

      if (id) {
        await InventoryService.updateItem(id, itemData);
      } else {
        await InventoryService.createItem(itemData);
      }
      navigate('/inventory');
    } catch (error) {
      setError(error.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      const newCategory = await CategoryService.createCategory(newCategoryName);
      setCategories(prev => [...prev, newCategory]);
      setItem(prev => ({ ...prev, category: newCategory }));
      setNewCategoryDialog(false);
      setNewCategoryName('');
    } catch (error) {
      setError(error.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await CategoryService.deleteCategory(categoryToDelete._id);
      setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete._id));
      if (item.category?._id === categoryToDelete._id) {
        setItem(prev => ({ ...prev, category: null }));
      }
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      setError(error.message || 'Failed to delete category');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to determine if we should show field errors
  const shouldShowError = (field) => {
    return hasSubmitted && !field;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
                error={shouldShowError(item.name.trim())}
                helperText={shouldShowError(item.name.trim()) ? 'Name is required' : ''}
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
                error={shouldShowError(item.quantity) || (hasSubmitted && item.quantity < 0)}
                helperText={
                  shouldShowError(item.quantity) 
                    ? 'Quantity is required' 
                    : hasSubmitted && item.quantity < 0 
                      ? 'Quantity must be a positive number' 
                      : ''
                }
                inputProps={{ min: 0 }}
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
                error={shouldShowError(item.price) || (hasSubmitted && item.price < 0)}
                helperText={
                  shouldShowError(item.price) 
                    ? 'Price is required' 
                    : hasSubmitted && item.price < 0 
                      ? 'Price must be a positive number' 
                      : ''
                }
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                value={item.category}
                onChange={(event, newValue) => {
                  if (newValue === 'create-new') {
                    setNewCategoryDialog(true);
                  } else {
                    setItem(prev => ({ ...prev, category: newValue }));
                  }
                }}
                options={[...categories, 'create-new']}
                getOptionLabel={(option) => {
                  if (option === 'create-new') return 'Create new category...';
                  return option.name;
                }}
                renderOption={(props, option, state) => {
                  const { key, ...otherProps } = props;
                  
                  if (option === 'create-new') {
                    return (
                      <li key={key} {...otherProps}>
                        <AddIcon sx={{ mr: 1 }} />
                        Create new category...
                      </li>
                    );
                  }
                  
                  return (
                    <li key={key} {...otherProps}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            size="small"
                            label={option.isDefault ? 'Default' : 'Custom'}
                            color={option.isDefault ? 'primary' : 'secondary'}
                            sx={{ mr: 1 }}
                          />
                          {option.name}
                        </Box>
                        {!option.isDefault && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryToDelete(option);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    required
                    error={shouldShowError(item.category)}
                    helperText={shouldShowError(item.category) ? 'Please select a category' : ''}
                  />
                )}
                isOptionEqualToValue={(option, value) => {
                  if (option === 'create-new') return false;
                  return option._id === value?._id;
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={item.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/inventory')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      {id ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    id ? 'Update Item' : 'Add Item'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* New Category Dialog */}
      <Dialog 
        open={newCategoryDialog} 
        onClose={() => setNewCategoryDialog(false)}
      >
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your new category. This will be available for your future items.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            error={!newCategoryName.trim()}
            helperText={!newCategoryName.trim() ? 'Category name cannot be empty' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCategoryDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateCategory} 
            color="primary"
            disabled={!newCategoryName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setCategoryToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCategory}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddItemScreen; 