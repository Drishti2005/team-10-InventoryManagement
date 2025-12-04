/**
 * Transaction Routes - Member 3 responsibility
 */
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.getAll();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transactions by product
router.get('/product/:productId', async (req, res) => {
    try {
        const transactions = await Transaction.getByProduct(req.params.productId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add stock (IN)
router.post('/stock-in', async (req, res) => {
    try {
        const { product_id, quantity, notes } = req.body;
        await Transaction.addStock(product_id, quantity, notes);
        res.json({ success: true, message: `Added ${quantity} units to stock` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove stock (OUT)
router.post('/stock-out', async (req, res) => {
    try {
        const { product_id, quantity, notes } = req.body;
        await Transaction.removeStock(product_id, quantity, notes);
        res.json({ success: true, message: `Removed ${quantity} units from stock` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get stock trends for charts
router.get('/trends/:days?', async (req, res) => {
    try {
        const days = req.params.days || 30;
        const trends = await Transaction.getStockTrends(days);
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
