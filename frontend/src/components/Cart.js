import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Divider,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      console.log('Cart response:', response.data);
      
      if (response.data && Array.isArray(response.data.items)) {
        // Validar y limpiar los datos del carrito
        const validCart = {
          ...response.data,
          items: response.data.items.filter(item => 
            item && 
            item.product && 
            item.product._id &&
            typeof item.product.price === 'number' &&
            !isNaN(item.product.price)
          ).map(item => ({
            ...item,
            product: {
              ...item.product,
              price: Number(item.product.price) || 0,
              stock: Number(item.product.stock) || 0
            }
          }))
        };

        // Recalcular el total
        validCart.total = validCart.items.reduce((sum, item) => 
          sum + (Number(item.product.price) * item.quantity), 0
        );

        console.log('Validated cart:', validCart);
        setCart(validCart);
      } else {
        console.log('No valid items array in response:', response.data);
        setCart({ items: [], total: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showSnackbar('Error al cargar el carrito', 'error');
      setCart({ items: [], total: 0 });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, newQuantity, stock) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('Updating quantity:', { productId, newQuantity, stock });

      if (newQuantity < 1) {
        showSnackbar('La cantidad debe ser mayor a 0', 'error');
        return;
      }

      if (newQuantity > stock) {
        showSnackbar('No hay suficiente stock disponible', 'error');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/cart/update/${productId}`, {
        quantity: newQuantity
      });

      console.log('Update response:', response.data);
      
      if (response.data && Array.isArray(response.data.items)) {
        setCart(response.data);
        showSnackbar('Cantidad actualizada correctamente', 'success');
      } else {
        console.error('Invalid response format:', response.data);
        showSnackbar('Error al actualizar la cantidad', 'error');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showSnackbar(
        error.response?.data?.message || 'Error al actualizar la cantidad',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      setIsLoading(true);
      console.log('Intentando eliminar producto:', productId);

      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data) {
        setCart(response.data);
        showSnackbar('Producto eliminado del carrito', 'success');
      }
    } catch (error) {
      console.error('Error completo al eliminar:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      showSnackbar(`Error al eliminar el producto: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
      setDeleteConfirmOpen(false);
      setSelectedProductId(null);
    }
  };

  const DeleteConfirmDialog = () => (
    <Dialog
      open={deleteConfirmOpen}
      onClose={() => setDeleteConfirmOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"¿Eliminar producto del carrito?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que deseas eliminar este producto del carrito?
          {selectedProductId && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              ID del producto: {selectedProductId}
            </Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setDeleteConfirmOpen(false)} 
          color="primary"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => handleDelete(selectedProductId)}
          color="error"
          autoFocus
          disabled={isLoading}
        >
          {isLoading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Playfair Display' }}>
        Carrito de Compras
      </Typography>

      {cart.items.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Tu carrito está vacío
          </Typography>
        </Box>
      ) : (
        <>
          {cart.items && cart.items.map((item) => {
            if (!item.product) return null;

            return (
              <Card
                key={item.product._id}
                sx={{
                  mb: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <img
                        src={item.product.imageUrl || '/placeholder-image.jpg'}
                        alt={item.product.name || 'Producto'}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontFamily: 'Playfair Display' }}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.product.price.toFixed(2)} por unidad
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock disponible: {item.product.stock}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.product.stock)}
                          disabled={item.quantity <= 1 || isLoading}
                          color="primary"
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          sx={{
                            minWidth: '40px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.product.stock)}
                          disabled={item.quantity >= item.product.stock || isLoading}
                          color="primary"
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            setSelectedProductId(item.product._id);
                            setDeleteConfirmOpen(true);
                          }}
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          disabled={isLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display' }}>
              Total:
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              ${cart.total.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Proceder al Pago
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <DeleteConfirmDialog />
    </Box>
  );
}

export default Cart;
