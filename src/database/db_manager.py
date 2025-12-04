"""
Database Manager - Member 4 responsibility
Handles database connection and operations
"""
import sqlite3
import os

class DatabaseManager:
    def __init__(self, db_name="data/inventory.db"):
        self.db_name = db_name
        self._ensure_data_directory()
    
    def _ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        os.makedirs("data", exist_ok=True)
    
    def get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_name)
    
    def initialize_database(self):
        """Create database tables"""
        # TODO: Member 4 - Implement table creation
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Products table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                sku TEXT UNIQUE NOT NULL,
                category TEXT,
                brand TEXT,
                price REAL,
                quantity INTEGER,
                supplier_id INTEGER,
                reorder_level INTEGER,
                barcode TEXT,
                location TEXT,
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
            )
        ''')
        
        # Suppliers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS suppliers (
                supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                contact_person TEXT,
                phone TEXT,
                email TEXT,
                address TEXT
            )
        ''')
        
        # Transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                transaction_type TEXT,
                quantity INTEGER,
                date TEXT,
                notes TEXT,
                user_id INTEGER,
                FOREIGN KEY (product_id) REFERENCES products(product_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        ''')
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                full_name TEXT,
                email TEXT,
                created_at TEXT,
                created_by INTEGER
            )
        ''')
        
        conn.commit()
        
        # Create default admin user if not exists
        cursor.execute('SELECT COUNT(*) FROM users WHERE username = ?', ('admin',))
        if cursor.fetchone()[0] == 0:
            from datetime import datetime
            cursor.execute('''
                INSERT INTO users (username, password, role, full_name, email, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', ('admin', 'admin123', 'admin', 'System Administrator', 'admin@inventory.com', 
                  datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            
            cursor.execute('''
                INSERT INTO users (username, password, role, full_name, email, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', ('staff', 'staff123', 'staff', 'Warehouse Staff', 'staff@inventory.com', 
                  datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
            
            conn.commit()
        
        conn.close()
    
    def execute_query(self, query, params=()):
        """Execute a query"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        lastrowid = cursor.lastrowid
        conn.close()
        return lastrowid
    
    def fetch_one(self, query, params=()):
        """Fetch one result"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        result = cursor.fetchone()
        conn.close()
        return result
    
    def fetch_all(self, query, params=()):
        """Fetch all results"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        return results
