const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories (including defaults and user's custom categories)
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { isDefault: true },
        { createdBy: req.user.id }
      ]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new custom category
router.post('/', auth, async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      isDefault: false,
      createdBy: req.user.id
    });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete custom category (only if created by user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
