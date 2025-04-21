import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
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
  IconButton,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import CategoryIcon from '../components/CategoryIcon';
import InventoryService from '../services/InventoryService';
import LocationService from '../services/LocationService';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    width: 'auto',
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    '& .MuiSvgIcon-root': {
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
  '& .MuiSvgIcon-root': {
    transition: 'margin 0.3s ease-in-out',
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
}));

const SmallAnimatedFab = styled(Fab)(({ theme }) => ({
  transition: 'width 0.3s ease-in-out',
  minWidth: '36px',
  width: '36px',
  height: '36px',
  borderRadius: '18px',
  backgroundColor: theme.palette.primary.main,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    width: 'auto',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.5),
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
  '& .MuiSvgIcon-root': {
    transition: 'margin 0.3s ease-in-out',
    marginRight: 0,
    width: '20px',
    height: '20px',
  },
  '& .button-text': {
    width: 0,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out, width 0s 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'inline-block',
    fontSize: '0.8rem',
    fontWeight: 500,
    visibility: 'hidden',
    textTransform: 'none',
  },
}));

function SortableItem({ item, handleDelete, navigate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item._id,
    data: {
      type: 'item',
      item
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e) => {
    // Only navigate if we're not clicking the delete button and not dragging
    if (!e.target.closest('button') && !isDragging) {
      navigate(`/edit-item/${item._id}`);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(item._id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      sx={{
        cursor: isDragging ? 'grabbing' : 'pointer',
        backgroundColor: 'white',
        borderRadius: '16px',
        minWidth: '300px',
        flexShrink: 0,
        boxShadow: isDragging ? 3 : 1,
        transition: 'all 0.2s ease'
      }}
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
          onClick={handleDeleteClick}
          sx={{ color: 'text.secondary' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}

function InventoryListScreen() {
  const [inventory, setInventory] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inventoryData, locationsData] = await Promise.all([
          InventoryService.getAllItems(),
          LocationService.getAllLocations()
        ]);
        setInventory(inventoryData);
        setLocations(locationsData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const handleCreateLocation = async () => {
    try {
      if (!newLocationName.trim()) {
        setError('Location name cannot be empty');
        return;
      }
      await LocationService.createLocation(newLocationName.trim());
      setNewLocationDialogOpen(false);
      setNewLocationName('');
      
      // Reload both inventory and locations
      const [inventoryData, locationsData] = await Promise.all([
        InventoryService.getAllItems(),
        LocationService.getAllLocations()
      ]);
      setInventory(inventoryData);
      setLocations(locationsData || []);
    } catch (error) {
      setError(error.message);
    }
  };

  // Group items by location
  const groupedItems = inventory.reduce((acc, item) => {
    const locationId = item.location || locations.find(loc => loc.isDefault)?._id;
    if (!acc[locationId]) {
      acc[locationId] = [];
    }
    acc[locationId].push(item);
    return acc;
  }, {});

  // Sort locations with default (Unassigned) first
  const sortedLocations = [...locations].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = async (event) => {
    const { active } = event;

    // Get the mouse position from the event
    const mouseX = active.rect.current.translated.left; // Calculate the mouse X position
    const mouseY = active.rect.current.translated.top; // Calculate the mouse Y position

    // Get the element at the mouse position
    let targetContainerElement = document.elementFromPoint(mouseX, mouseY);

    // Check if the target element is a container
    while (targetContainerElement && !targetContainerElement.hasAttribute('data-location-id')) {
        targetContainerElement = targetContainerElement.parentElement; // Traverse up the DOM
    }

    if (!targetContainerElement) {
        console.error('No target container element found for the drop target.');
        return;
    }

    // Retrieve the location ID from the container
    var targetLocationId = targetContainerElement.getAttribute('data-location-id');
    console.log('Target Location ID:', targetLocationId); // Debug log

    // Get the active item
    const activeItem = inventory.find(item => item._id === active.id);
    
    if (activeItem) {
        // Check if the target location is the same as the current location
        if (activeItem.location === targetLocationId) {
            console.warn('Dropped item back into the same container, searching for a different container.');

            // Find the nearest valid container
            let foundDifferentContainer = false;
            let sibling = targetContainerElement;

            while (sibling) {
                if (sibling.hasAttribute('data-location-id')) {
                    const newLocationId = sibling.getAttribute('data-location-id');
                    if (newLocationId !== activeItem.location) {
                        console.log('Found a different container:', newLocationId);
                        targetLocationId = newLocationId; // Update to the new location ID
                        foundDifferentContainer = true;
                        break;
                    }
                }
                sibling = sibling.nextElementSibling || sibling.parentElement; // Move to the next sibling or parent
            }

            if (!foundDifferentContainer) {
                console.error('No valid different container found.');
                return; // Exit if no valid container is found
            }
        }

        // Create the updated item with the new location
        const updatedItem = {
            ...activeItem,
            location: targetLocationId // Update the location to the new target
        };

        try {
            // Update the item in the backend
            const response = await InventoryService.updateItem(updatedItem._id, updatedItem);
            console.log('Update Response:', response); // Debug log
            
            // Update the inventory state
            setInventory(prev => 
                prev.map(item => item._id === updatedItem._id ? updatedItem : item)
            );
        } catch (error) {
            console.error('Error updating item:', error);
            setError(error.message);
        }
    }

    setActiveId(null); // Reset the active ID after the drag operation
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Inventory Items
        </Typography>
        <Zoom in={true}>
          <SmallAnimatedFab
            color="primary"
            onClick={() => setNewLocationDialogOpen(true)}
            aria-label="add new location"
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <AddLocationIcon sx={{ fontSize: '1rem' }} />
              <span className="button-text">Add new location</span>
            </Box>
          </SmallAnimatedFab>
        </Zoom>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sortedLocations.map((location, index) => (
            <Paper
              key={location._id}
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
              data-location-id={location._id}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {location.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  minHeight: '200px',
                  overflowX: 'auto',
                  pb: 1,
                  borderRadius: 1,
                  '&::-webkit-scrollbar': {
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                      background: '#555',
                    },
                  },
                }}
              >
                <SortableContext
                  id={`container-${index}`}
                  items={(groupedItems[location._id] || []).map(item => item._id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {(groupedItems[location._id] || []).map((item) => (
                    <SortableItem
                      key={item._id}
                      item={item}
                      handleDelete={handleDelete}
                      navigate={navigate}
                    />
                  ))}
                </SortableContext>
              </Box>
            </Paper>
          ))}
        </Box>
        <DragOverlay>
          {activeId ? (
            <Card
              sx={{
                backgroundColor: 'white',
                borderRadius: '16px',
                minWidth: '300px',
                flexShrink: 0,
                boxShadow: 3,
                opacity: 0.8,
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease',
              }}
            >
              {(() => {
                const activeItem = inventory.find(item => item._id === activeId);
                return activeItem ? (
                  <>
                    <CategoryIcon 
                      category={activeItem.category.name}
                      isCustom={!activeItem.category.isDefault}
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
                        {activeItem.name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 0.5,
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                      }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Quantity: {activeItem.quantity}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Price: ${activeItem.price}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Category: {activeItem.category.name}
                        </Typography>
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
                        sx={{ color: 'text.secondary' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </>
                ) : null;
              })()}
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

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
        open={newLocationDialogOpen}
        onClose={() => setNewLocationDialogOpen(false)}
      >
        <DialogTitle>Create New Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the new location.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Location Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateLocation();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLocationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateLocation} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

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
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default InventoryListScreen; 