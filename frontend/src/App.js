import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductManagement from './components/ProductManagement';
import Cart from './components/Cart';
import AlcoholConsumption from './components/AlcoholConsumption';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c9b037', // Gold color for luxury feel
    },
    secondary: {
      main: '#b28704',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/alcohol-consumption" element={<AlcoholConsumption />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
