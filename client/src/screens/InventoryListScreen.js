import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Fab,
  Zoom,
  Paper,
  styled,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '../components/CategoryIcon';
import InventoryService from '../services/InventoryService';

const AnimatedFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  transition: 'width 0.3s ease-in-out',
  minWidth: '56px',
  width: '56px',
  height: '56px',
  borderRadius: '28px',
  backgroundColor: theme.palette.primary.main,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease-in-out',
    marginRight: 0,
    width: '24px',
    height: '24px',
  },
  '& .button-text': {
    width: 0,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out, width 0s 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    fontSize: '0.875rem',
    fontWeight: 500,
    visibility: 'hidden',
    textTransform: 'none',
  },
  '&:hover': {
    width: 'auto',
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      transform: 'rotate(90deg)',
      marginRight: theme.spacing(1),
    },
    '& .button-text': {
      width: 'auto',
      opacity: 1,
      visibility: 'visible',
      marginLeft: theme.spacing(0.5),
      transition: 'opacity 0.2s ease-in-out, width 0s',
    },
  },
  '&:active': {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[6],
  },
}));

const InventoryContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
  minHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  minHeight: '400px',
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: '64px',
    marginBottom: theme.spacing(2),
    opacity: 0.5,
  },
}));

function InventoryListScreen() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await InventoryService.getAllItems();
      setInventory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await InventoryService.deleteItem(itemToDelete);
      setInventory(prev => prev.filter(item => item._id !== itemToDelete));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2">
          Inventory Items
        </Typography>
      </Box>

      <InventoryContainer elevation={0}>
        {inventory.length === 0 ? (
          <EmptyState>
            <Typography variant="h6" color="textSecondary" sx={{ opacity: 0.7 }}>
              Inventory is empty
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ opacity: 0.5 }}>
              Click the + button to add your first item
            </Typography>
          </EmptyState>
        ) : (
          <Grid container spacing={3}>
            {inventory.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme => theme.shadows[4],
                    },
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/edit-item/${item._id}`)}
                >
                  <CategoryIcon 
                    category={item.category.name}
                    isCustom={!item.category.isDefault}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    pt: 0,
                    pb: 1,
                    px: 2,
                    '&:last-child': { pb: 1 }
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      mb: 1
                    }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 0.5,
                      color: 'text.secondary',
                      fontSize: '0.875rem'
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Price: ${item.price}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        Category: {item.category.name}
                      </Typography>
                      {item.location && (
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Location: {item.location}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ 
                    justifyContent: 'flex-end', 
                    p: 1,
                    pt: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    minHeight: '36px'
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item._id)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </InventoryContainer>

      <Zoom in={true}>
        <AnimatedFab
          color="primary"
          onClick={() => navigate('/add-item')}
          aria-label="add new item"
          size="large"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <AddIcon />
            <span className="button-text">Add new item</span>
          </Box>
        </AnimatedFab>
      </Zoom>

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
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default InventoryListScreen; 