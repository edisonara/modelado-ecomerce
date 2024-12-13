import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import InventoryIcon from '@mui/icons-material/Inventory';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <LocalBarIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontFamily: 'Playfair Display',
            letterSpacing: 1,
          }}
        >
          Luxury Spirits
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/admin/products"
            startIcon={<InventoryIcon />}
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              fontFamily: 'Playfair Display',
            }}
          >
            Gestionar Productos
          </Button>
          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            sx={{ color: 'primary.main' }}
          >
            <Badge color="secondary" variant="dot">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
