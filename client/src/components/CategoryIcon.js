import React from 'react';
import {
  Devices as ElectronicIcon,
  Restaurant as FoodIcon,
  LocalDrink as BeverageIcon,
  Casino as GamesIcon,
  Checkroom as ClothingIcon,
  Settings as CustomIcon
} from '@mui/icons-material';
import { Box } from '@mui/material';

const iconStyle = {
  fontSize: '64px', // Large icon size
  color: '#1976d2', // Primary blue color
};

const categoryIcons = {
  'Electronic': ElectronicIcon,
  'Food': FoodIcon,
  'Beverage': BeverageIcon,
  'Games/Toys': GamesIcon,
  'Clothing': ClothingIcon,
};

function CategoryIcon({ category, isCustom }) {
  const IconComponent = isCustom ? CustomIcon : categoryIcons[category] || CustomIcon;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '120px'
    }}>
      <IconComponent sx={iconStyle} />
    </Box>
  );
}

export default CategoryIcon;
