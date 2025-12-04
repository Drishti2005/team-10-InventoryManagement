/**
 * Export Routes - Member 5 responsibility
 * CSV/Excel export functionality
 */
const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Transaction = require('../models/Transaction');

// Export products to CSV
router.get('/products', async (req, res) => {
    try {
        const products = await Product.getAll();
        const fields = ['product_id', 'name', 'category', 'price', 'quantity', 'supplier_id', 'reorder_level'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(products);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export suppliers to CSV
router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        const fields = ['supplier_id', 'name', 'contact_person', 'phone', 'email', 'address'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(suppliers);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('suppliers.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export transactions to CSV
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.getAll();
        const fields = ['transaction_id', 'product_id', 'product_name', 'transaction_type', 'quantity', 'date', 'notes'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(transactions);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
