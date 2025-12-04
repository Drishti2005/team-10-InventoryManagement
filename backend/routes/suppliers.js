/**
 * Supplier Routes - Member 2 responsibility
 */
const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get supplier by ID
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.getById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create supplier
router.post('/', async (req, res) => {
    try {
        const supplierId = await Supplier.create(req.body);
        res.status(201).json({ success: true, supplier_id: supplierId, message: 'Supplier created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update supplier
router.put('/:id', async (req, res) => {
    try {
        await Supplier.update(req.params.id, req.body);
        res.json({ success: true, message: 'Supplier updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
    try {
        await Supplier.delete(req.params.id);
        res.json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get products by supplier
router.get('/:id/products', async (req, res) => {
    try {
        const products = await Supplier.getProducts(req.params.id);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
