const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

// Get user's inventory items
router.get('/', auth, async (req, res) => {
  try {
    const items = await Inventory.find({ user: req.user.id })
      .populate('category');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inventory item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('category');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new inventory item
router.post('/', auth, async (req, res) => {
  try {
    const item = new Inventory({
      ...req.body,
      user: req.user.id
    });
    const newItem = await item.save();
    await newItem.populate('category');
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('category');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
