const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne().populate('items.product');
        
        if (!cart) {
            cart = await Cart.create({ items: [], total: 0 });
        }

        // Recalcular el total
        cart.total = cart.items.reduce((total, item) => {
            if (item.product && item.product.price) {
                return total + (item.quantity * item.product.price);
            }
            return total;
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({ message: 'Error al cargar el carrito' });
    }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log('Intentando eliminar producto con ID:', productId);

        let cart = await Cart.findOne();
        console.log('Cart encontrado:', cart);

        if (!cart) {
            console.log('No se encontró el carrito');
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log('Items en el carrito antes de eliminar:', cart.items);

        // Encontrar el índice del item
        const itemIndex = cart.items.findIndex(item => {
            console.log('Comparando item:', item.product.toString(), 'con productId:', productId);
            return item.product.toString() === productId;
        });

        console.log('Índice del item encontrado:', itemIndex);

        if (itemIndex === -1) {
            console.log('Producto no encontrado en el carrito');
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Eliminar el item
        cart.items.splice(itemIndex, 1);
        console.log('Items después de eliminar:', cart.items);

        // Guardar primero para asegurar que se eliminó el item
        await cart.save();
        console.log('Carrito guardado después de eliminar item');

        // Poblar los productos
        await cart.populate('items.product');
        console.log('Carrito poblado con productos');

        // Recalcular el total
        cart.total = cart.items.reduce((total, item) => {
            if (item.product && item.product.price) {
                return total + (item.quantity * item.product.price);
            }
            return total;
        }, 0);

        console.log('Total recalculado:', cart.total);

        // Guardar con el nuevo total
        await cart.save();
        console.log('Carrito guardado con nuevo total');

        res.json(cart);
    } catch (err) {
        console.error('Error completo al eliminar del carrito:', err);
        res.status(500).json({ 
            message: 'Error al eliminar el producto del carrito',
            error: err.message 
        });
    }
});

// Update cart item quantity
router.put('/update/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.productId;

        // Validar cantidad
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Cantidad inválida' });
        }

        // Verificar producto y stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: 'No hay suficiente stock disponible' });
        }

        let cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Actualizar cantidad
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.items[itemIndex].quantity = quantity;

        // Poblar productos y recalcular total
        await cart.populate('items.product');
        
        cart.total = cart.items.reduce((total, item) => {
            if (item.product && item.product.price) {
                return total + (item.quantity * item.product.price);
            }
            return total;
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
});

module.exports = router;
