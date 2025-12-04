const { pool } = require('../config/database');

class Supplier {
    // Get all suppliers
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY supplier_id DESC');
        return rows;
    }

    // Get supplier by ID
    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id]);
        return rows[0];
    }

    // Create new supplier
    static async create(supplierData) {
        const { name, contact_person, phone, email, address } = supplierData;
        const [result] = await pool.query(
            'INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
            [name, contact_person || '', phone || '', email || '', address || '']
        );
        return result.insertId;
    }

    // Update supplier
    static async update(id, supplierData) {
        const fields = [];
        const values = [];

        Object.keys(supplierData).forEach(key => {
            if (['name', 'contact_person', 'phone', 'email', 'address'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(supplierData[key]);
            }
        });

        if (fields.length === 0) return false;

        values.push(id);
        await pool.query(`UPDATE suppliers SET ${fields.join(', ')} WHERE supplier_id = ?`, values);
        return true;
    }

    // Delete supplier
    static async delete(id) {
        await pool.query('DELETE FROM suppliers WHERE supplier_id = ?', [id]);
        return true;
    }

    // Get products by supplier
    static async getProducts(supplierId) {
        const [rows] = await pool.query('SELECT * FROM products WHERE supplier_id = ?', [supplierId]);
        return rows;
    }
}

module.exports = Supplier;
