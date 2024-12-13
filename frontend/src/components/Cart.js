import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Box,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showSnackbar('Error al cargar el carrito', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleConfirmDelete = (productId) => {
    setProductToDelete(productId);
    setOpenConfirmDialog(true);
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${productId}`, {
        quantity,
      });
      fetchCart();
      showSnackbar('Carrito actualizado exitosamente');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showSnackbar('Error al actualizar la cantidad', 'error');
    }
  };

  const removeItem = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productToDelete}`);
      setOpenConfirmDialog(false);
      fetchCart();
      showSnackbar('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing item:', error);
      showSnackbar('Error al eliminar el producto', 'error');
    }
  };

  const handleCheckout = () => {
    // Aquí iría la lógica para procesar el pedido
    showSnackbar('¡Gracias por tu compra!');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
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
        Carrito de Compras
      </Typography>

      {cart.items.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/"
            sx={{
              mt: 2,
              fontFamily: 'Playfair Display',
              textTransform: 'none',
            }}
          >
            Continuar Comprando
          </Button>
        </Box>
      ) : (
        <>
          {cart.items.map((item) => (
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
                      src={item.product.imageUrl}
                      alt={item.product.name}
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
                      ${item.product.price} por unidad
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
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
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
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
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
                        onClick={() => handleConfirmDelete(item.product._id)}
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontFamily: 'Playfair Display' }}
              >
                Total:
              </Typography>
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontFamily: 'Playfair Display' }}
              >
                ${cart.total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleCheckout}
              sx={{
                py: 2,
                fontFamily: 'Playfair Display',
                textTransform: 'none',
                fontSize: '1.2rem',
              }}
            >
              Proceder al Pago
            </Button>
          </Box>
        </>
      )}

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este producto del carrito?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={removeItem} color="error" variant="contained">
            Eliminar
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

export default Cart;
