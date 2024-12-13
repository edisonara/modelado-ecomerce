import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Error al cargar los productos', 'error');
    }
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= selectedProduct?.stock) {
      setQuantity(value);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId: selectedProduct._id,
        quantity: quantity,
      });
      handleCloseDialog();
      showSnackbar('Producto agregado al carrito exitosamente');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showSnackbar('Error al agregar al carrito', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        align="center"
        color="primary"
        gutterBottom
        sx={{
          fontFamily: 'Playfair Display',
          mb: 6,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 2,
        }}
      >
        Premium Collection
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                borderRadius: 2,
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="primary"
                  sx={{ fontFamily: 'Playfair Display' }}
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock disponible: {product.stock}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleOpenDialog(product)}
                  disabled={product.stock === 0}
                  sx={{
                    fontFamily: 'Playfair Display',
                    textTransform: 'none',
                  }}
                >
                  {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para agregar al carrito */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display' }}>
          Agregar al Carrito
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {selectedProduct?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Precio: ${selectedProduct?.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock disponible: {selectedProduct?.stock}
            </Typography>
            <TextField
              fullWidth
              label="Cantidad"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{
                min: 1,
                max: selectedProduct?.stock,
              }}
              sx={{ mt: 2 }}
            />
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Total: ${selectedProduct?.price * quantity}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={addToCart}
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
          >
            Agregar al Carrito
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductList;
