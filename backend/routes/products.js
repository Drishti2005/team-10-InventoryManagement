/**
 * Product Routes - Member 1 responsibility
 */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        const productId = await Product.create(req.body);
        res.status(201).json({ success: true, product_id: productId, message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search products
router.get('/search/:keyword', async (req, res) => {
    try {
        const products = await Product.search(req.params.keyword);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get low stock products
router.get('/alerts/low-stock', async (req, res) => {
    try {
        const products = await Product.getLowStock();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get category statistics
router.get('/stats/categories', async (req, res) => {
    try {
        const stats = await Product.getByCategory();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
