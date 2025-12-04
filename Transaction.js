const { pool } = require('../config/database');

class Transaction {
    // Get all transactions
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT t.*, p.name as product_name 
            FROM transactions t 
            LEFT JOIN products p ON t.product_id = p.product_id 
            ORDER BY t.date DESC
        `);
        return rows;
    }

    // Get transactions by product
    static async getByProduct(productId) {
        const [rows] = await pool.query(
            'SELECT * FROM transactions WHERE product_id = ? ORDER BY date DESC',
            [productId]
        );
        return rows;
    }

    // Add stock (IN transaction)
    static async addStock(productId, quantity, notes = '') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert transaction
            await connection.query(
                'INSERT INTO transactions (product_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?)',
                [productId, 'IN', quantity, notes]
            );

            // Update product quantity
            await connection.query(
                'UPDATE products SET quantity = quantity + ? WHERE product_id = ?',
                [quantity, productId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Remove stock (OUT transaction)
    static async removeStock(productId, quantity, notes = '') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Check if enough stock
            const [product] = await connection.query(
                'SELECT quantity FROM products WHERE product_id = ?',
                [productId]
            );

            if (!product[0] || product[0].quantity < quantity) {
                throw new Error('Insufficient stock');
            }

            // Insert transaction
            await connection.query(
                'INSERT INTO transactions (product_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?)',
                [productId, 'OUT', quantity, notes]
            );

            // Update product quantity
            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE product_id = ?',
                [quantity, productId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get stock trends (for charts)
    static async getStockTrends(days = 30) {
        const [rows] = await pool.query(`
            SELECT DATE(date) as date, 
                   SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE 0 END) as stock_in,
                   SUM(CASE WHEN transaction_type = 'OUT' THEN quantity ELSE 0 END) as stock_out
            FROM transactions 
            WHERE date >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(date)
            ORDER BY date
        `, [days]);
        return rows;
    }
}

module.exports = Transaction;
