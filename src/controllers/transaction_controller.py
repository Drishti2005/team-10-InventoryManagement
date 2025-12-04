"""
Transaction Controller - Member 3 responsibility
Handles transaction and stock operations
"""
from src.models.transaction import Transaction
from src.database.db_manager import DatabaseManager

class TransactionController:
    def __init__(self):
        self.db = DatabaseManager()
    
    def add_stock(self, product_id, quantity, notes=""):
        """Add stock (IN transaction)"""
        from datetime import datetime
        # Add transaction record
        query = '''INSERT INTO transactions (product_id, transaction_type, quantity, date, notes)
                   VALUES (?, ?, ?, ?, ?)'''
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.db.execute_query(query, (product_id, 'IN', quantity, date, notes))
        
        # Update product quantity
        update_query = 'UPDATE products SET quantity = quantity + ? WHERE product_id = ?'
        self.db.execute_query(update_query, (quantity, product_id))
        return {'success': True, 'message': f'Added {quantity} units to stock'}
    
    def remove_stock(self, product_id, quantity, notes=""):
        """Remove stock (OUT transaction)"""
        from datetime import datetime
        # Check if enough stock
        check_query = 'SELECT quantity FROM products WHERE product_id = ?'
        result = self.db.fetch_one(check_query, (product_id,))
        if result and result[0] >= quantity:
            # Add transaction record
            query = '''INSERT INTO transactions (product_id, transaction_type, quantity, date, notes)
                       VALUES (?, ?, ?, ?, ?)'''
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.db.execute_query(query, (product_id, 'OUT', quantity, date, notes))
            
            # Update product quantity
            update_query = 'UPDATE products SET quantity = quantity - ? WHERE product_id = ?'
            self.db.execute_query(update_query, (quantity, product_id))
            return {'success': True, 'message': f'Removed {quantity} units from stock'}
        return {'success': False, 'message': 'Insufficient stock'}
    
    def get_transaction_history(self, product_id=None):
        """Get transaction history"""
        if product_id:
            query = 'SELECT * FROM transactions WHERE product_id = ? ORDER BY date DESC'
            results = self.db.fetch_all(query, (product_id,))
        else:
            query = 'SELECT * FROM transactions ORDER BY date DESC'
            results = self.db.fetch_all(query)
        
        transactions = []
        for row in results:
            transactions.append({
                'transaction_id': row[0], 'product_id': row[1], 'transaction_type': row[2],
                'quantity': row[3], 'date': row[4], 'notes': row[5]
            })
        return transactions
    
    def get_stock_level(self, product_id):
        """Get current stock level"""
        query = 'SELECT quantity FROM products WHERE product_id = ?'
        result = self.db.fetch_one(query, (product_id,))
        return result[0] if result else 0
    
    def adjust_stock(self, product_id, new_quantity, notes=""):
        """Adjust stock to specific quantity"""
        query = 'UPDATE products SET quantity = ? WHERE product_id = ?'
        self.db.execute_query(query, (new_quantity, product_id))
        return {'success': True, 'message': f'Stock adjusted to {new_quantity} units'}
