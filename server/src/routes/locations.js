const express = require('express');
const path = require('path');
const router = express.Router();
const Location = require('../models/Location');

// Create a new location
router.post('/', async (req, res) => {
  try {
    const location = new Location({
      name: req.body.name
    });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Location name already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 