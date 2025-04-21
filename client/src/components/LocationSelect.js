import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import LocationService from '../services/LocationService';

function LocationSelect({ value, onChange, error, helperText }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await LocationService.getAllLocations();
        setLocations(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleCreateLocation = async () => {
    try {
      if (!newLocationName.trim()) {
        setErrorMessage('Location name cannot be empty');
        return;
      }
      const newLocation = await LocationService.createLocation(newLocationName.trim());
      setLocations(prev => [...prev, newLocation]);
      setNewLocationDialogOpen(false);
      setNewLocationName('');
      // Select the newly created location
      onChange(newLocation._id);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box>
      <Autocomplete
        value={locations.find(loc => loc._id === value) || null}
        onChange={(event, newValue) => {
          if (newValue === 'create-new') {
            setNewLocationDialogOpen(true);
          } else {
            onChange(newValue?._id || '');
          }
        }}
        options={[...locations, 'create-new']}
        getOptionLabel={(option) => {
          if (option === 'create-new') return 'Create new location...';
          return option.name;
        }}
        renderOption={(props, option) => {
          if (option === 'create-new') {
            return (
              <li {...props}>
                <Typography color="primary">Create new location...</Typography>
              </li>
            );
          }
          return <li {...props}>{option.name}</li>;
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location"
            error={error}
            helperText={helperText}
          />
        )}
      />

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

      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

export default LocationSelect; 