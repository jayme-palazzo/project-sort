const mongoose = require('mongoose');
const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  'Electronic',
  'Food',
  'Beverage',
  'Games/Toys',
  'Clothing'
];

async function initDefaultCategories() {
  try {
    console.log('Starting default categories initialization...');
    
    for (const categoryName of DEFAULT_CATEGORIES) {
      console.log(`Initializing category: ${categoryName}`);
      
      const existingCategory = await Category.findOne({ 
        name: categoryName, 
        isDefault: true 
      });

      if (!existingCategory) {
        const category = new Category({
          name: categoryName,
          isDefault: true
        });
        await category.save();
        console.log(`Created new default category: ${categoryName}`);
      } else {
        console.log(`Default category already exists: ${categoryName}`);
      }
    }
    
    const allCategories = await Category.find({ isDefault: true });
    console.log('Current default categories:', allCategories.map(c => c.name));
    
    console.log('Default categories initialization completed successfully');
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
}

module.exports = initDefaultCategories;
