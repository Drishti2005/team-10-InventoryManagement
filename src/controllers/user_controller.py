"""
User Controller - Authentication and User Management
"""
from src.database.db_manager import DatabaseManager
from datetime import datetime

class UserController:
    def __init__(self):
        self.db = DatabaseManager()
    
    def authenticate(self, username, password):
        """Authenticate user"""
        query = 'SELECT user_id, username, role, full_name, email FROM users WHERE username = ? AND password = ?'
        result = self.db.fetch_one(query, (username, password))
        if result:
            return {
                'success': True,
                'user_id': result[0],
                'username': result[1],
                'role': result[2],
                'full_name': result[3],
                'email': result[4]
            }
        return {'success': False, 'message': 'Invalid username or password'}
    
    def create_user(self, username, password, role, full_name, email, created_by):
        """Create new user (Admin only)"""
        try:
            query = '''INSERT INTO users (username, password, role, full_name, email, created_at, created_by)
                       VALUES (?, ?, ?, ?, ?, ?, ?)'''
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.db.execute_query(query, (username, password, role, full_name, email, date, created_by))
            return {'success': True, 'message': 'User created successfully'}
        except Exception as e:
            return {'success': False, 'message': f'Error creating user: {str(e)}'}
    
    def list_all_users(self):
        """List all users"""
        query = 'SELECT user_id, username, role, full_name, email, created_at FROM users'
        results = self.db.fetch_all(query)
        users = []
        for row in results:
            users.append({
                'user_id': row[0],
                'username': row[1],
                'role': row[2],
                'full_name': row[3],
                'email': row[4],
                'created_at': row[5]
            })
        return users
    
    def delete_user(self, user_id):
        """Delete user"""
        # Don't allow deleting admin user
        query = 'SELECT username FROM users WHERE user_id = ?'
        result = self.db.fetch_one(query, (user_id,))
        if result and result[0] == 'admin':
            return {'success': False, 'message': 'Cannot delete admin user'}
        
        query = 'DELETE FROM users WHERE user_id = ?'
        self.db.execute_query(query, (user_id,))
        return {'success': True, 'message': 'User deleted successfully'}
    
    def get_dashboard_stats(self):
        """Get dashboard statistics"""
        stats = {}
        
        # Total products
        query = 'SELECT COUNT(*) FROM products'
        result = self.db.fetch_one(query)
        stats['total_products'] = result[0] if result else 0
        
        # Total inventory value
        query = 'SELECT SUM(price * quantity) FROM products'
        result = self.db.fetch_one(query)
        stats['total_value'] = round(result[0], 2) if result and result[0] else 0
        
        # Low stock items
        query = 'SELECT COUNT(*) FROM products WHERE quantity <= reorder_level'
        result = self.db.fetch_one(query)
        stats['low_stock_count'] = result[0] if result else 0
        
        # Recent transactions (last 5)
        query = '''SELECT t.transaction_id, t.transaction_type, t.quantity, t.date, 
                   p.name, u.username
                   FROM transactions t
                   JOIN products p ON t.product_id = p.product_id
                   LEFT JOIN users u ON t.user_id = u.user_id
                   ORDER BY t.date DESC LIMIT 5'''
        results = self.db.fetch_all(query)
        stats['recent_activity'] = []
        for row in results:
            stats['recent_activity'].append({
                'transaction_id': row[0],
                'type': row[1],
                'quantity': row[2],
                'date': row[3],
                'product_name': row[4],
                'username': row[5] or 'Unknown'
            })
        
        # Top selling products (most OUT transactions)
        query = '''SELECT p.name, SUM(t.quantity) as total_sold
                   FROM transactions t
                   JOIN products p ON t.product_id = p.product_id
                   WHERE t.transaction_type = 'OUT'
                   GROUP BY p.product_id
                   ORDER BY total_sold DESC LIMIT 5'''
        results = self.db.fetch_all(query)
        stats['top_selling'] = []
        for row in results:
            stats['top_selling'].append({
                'product_name': row[0],
                'total_sold': row[1]
            })
        
        # Dead stock (no transactions in last 30 days)
        query = '''SELECT p.product_id, p.name, p.quantity, p.price
                   FROM products p
                   WHERE p.product_id NOT IN (
                       SELECT DISTINCT product_id FROM transactions
                       WHERE date >= date('now', '-30 days')
                   ) AND p.quantity > 0'''
        results = self.db.fetch_all(query)
        stats['dead_stock'] = []
        for row in results:
            stats['dead_stock'].append({
                'product_id': row[0],
                'name': row[1],
                'quantity': row[2],
                'price': row[3]
            })
        
        return stats
