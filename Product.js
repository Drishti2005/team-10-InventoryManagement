
const { pool } = require('../config/database');

class Product {
    // Get all products
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY product_id DESC');
        return rows;
    }

    // Get product by ID
    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [id]);
        return rows[0];
    }

    // Create new product
    static async create(productData) {
        const { name, category, price, quantity, supplier_id, reorder_level } = productData;
        const [result] = await pool.query(
            'INSERT INTO products (name, category, price, quantity, supplier_id, reorder_level) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, price, quantity, supplier_id || null, reorder_level || 10]
        );
        return result.insertId;
    }

    // Update product
    static async update(id, productData) {
        const fields = [];
        const values = [];

        Object.keys(productData).forEach(key => {
            if (['name', 'category', 'price', 'quantity', 'supplier_id', 'reorder_level'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(productData[key]);
            }
        });

        if (fields.length === 0) return false;

        values.push(id);
        await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`, values);
        return true;
    }

    // Delete product
    static async delete(id) {
        await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
        return true;
    }

    // Search products
    static async search(keyword) {
        const [rows] = await pool.query(
            'SELECT * FROM products WHERE name LIKE ? OR category LIKE ?',
            [`%${keyword}%`, `%${keyword}%`]
        );
        return rows;
    }

    // Get low stock products
    static async getLowStock() {
        const [rows] = await pool.query('SELECT * FROM products WHERE quantity <= reorder_level');
        return rows;
    }

    // Get products by category
    static async getByCategory() {
        const [rows] = await pool.query(
            'SELECT category, COUNT(*) as count, SUM(quantity) as total_quantity FROM products GROUP BY category'
        );
        return rows;
    }
}

module.exports = Product;
