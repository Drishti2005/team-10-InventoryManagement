
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventory_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create database if not exists
const createDatabase = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 3306
    });

    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'inventory_db'}`, (err) => {
        if (err) console.error('Error creating database:', err);
        else console.log('✅ Database ready');
        connection.end();
    });
};

// Initialize database tables
const initializeTables = () => {
    const promisePool = pool.promise();

    const createTables = async () => {
        try {
            // Suppliers table
            await promisePool.query(`
                CREATE TABLE IF NOT EXISTS suppliers (
                    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    contact_person VARCHAR(255),
                    phone VARCHAR(50),
                    email VARCHAR(255),
                    address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Products table
            await promisePool.query(`
                CREATE TABLE IF NOT EXISTS products (
                    product_id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    category VARCHAR(100),
                    price DECIMAL(10, 2),
                    quantity INT DEFAULT 0,
                    supplier_id INT,
                    reorder_level INT DEFAULT 10,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL
                )
            `);

            // Transactions table
            await promisePool.query(`
                CREATE TABLE IF NOT EXISTS transactions (
                    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
                    product_id INT,
                    transaction_type ENUM('IN', 'OUT') NOT NULL,
                    quantity INT NOT NULL,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT,
                    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
                )
            `);

            console.log('✅ Database tables initialized');
        } catch (error) {
            console.error('Error creating tables:', error);
        }
    };

    createTables();
};

module.exports = { pool: pool.promise(), createDatabase, initializeTables };
