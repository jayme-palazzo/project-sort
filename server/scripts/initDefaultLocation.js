const Location = require('../src/models/Location');

async function initDefaultLocation() {
  try {
    // Check if Unassigned location exists
    const existingLocation = await Location.findOne({ name: 'Unassigned' });
    
    if (!existingLocation) {
      // Create Unassigned location if it doesn't exist
      const unassignedLocation = new Location({
        name: 'Unassigned',
        isDefault: true
      });
      
      await unassignedLocation.save();
      console.log('Default Unassigned location created');
    } else {
      console.log('Default Unassigned location already exists');
    }
  } catch (error) {
    console.error('Error initializing default location:', error);
    throw error;
  }
}

module.exports = initDefaultLocation; 