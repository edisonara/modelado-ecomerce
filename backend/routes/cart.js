const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('items.product');
        if (!cart) {
            const newCart = await Cart.create({ items: [], total: 0 });
            return res.json(newCart);
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne();
        
        if (!cart) {
            cart = await Cart.create({ items: [], total: 0 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.total = cart.items.reduce((total, item) => {
            return total + (item.quantity * product.price);
        }, 0);

        cart.updatedAt = Date.now();
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update cart item
router.put('/update/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne();
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === req.params.productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        const products = await Product.find({
            '_id': { $in: cart.items.map(item => item.product) }
        });

        cart.total = cart.items.reduce((total, item) => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            return total + (item.quantity * product.price);
        }, 0);

        cart.updatedAt = Date.now();
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== req.params.productId
        );

        const products = await Product.find({
            '_id': { $in: cart.items.map(item => item.product) }
        });

        cart.total = cart.items.reduce((total, item) => {
            const product = products.find(p => p._id.toString() === item.product.toString());
            return total + (item.quantity * product.price);
        }, 0);

        cart.updatedAt = Date.now();
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
