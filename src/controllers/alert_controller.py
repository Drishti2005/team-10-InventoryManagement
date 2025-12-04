"""
Alert Controller - Low Stock Alerts and Notifications
"""
from src.database.db_manager import DatabaseManager
from datetime import datetime

class AlertController:
    def __init__(self):
        self.db = DatabaseManager()
    
    def get_low_stock_alerts(self):
        """Get all low stock alerts"""
        query = '''SELECT p.product_id, p.name, p.sku, p.quantity, p.reorder_level, 
                   p.category, p.brand, s.name as supplier_name
                   FROM products p
                   LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
                   WHERE p.quantity <= p.reorder_level
                   ORDER BY p.quantity ASC'''
        results = self.db.fetch_all(query)
        
        alerts = []
        for row in results:
            severity = 'critical' if row[3] == 0 else 'warning'
            alerts.append({
                'product_id': row[0],
                'name': row[1],
                'sku': row[2],
                'quantity': row[3],
                'reorder_level': row[4],
                'category': row[5],
                'brand': row[6],
                'supplier_name': row[7] or 'No Supplier',
                'severity': severity,
                'message': 'OUT OF STOCK' if row[3] == 0 else 'LOW STOCK'
            })
        return alerts
    
    def get_out_of_stock_products(self):
        """Get products that are completely out of stock"""
        query = '''SELECT product_id, name, sku, category, brand 
                   FROM products WHERE quantity = 0'''
        results = self.db.fetch_all(query)
        
        products = []
        for row in results:
            products.append({
                'product_id': row[0],
                'name': row[1],
                'sku': row[2],
                'category': row[3],
                'brand': row[4]
            })
        return products
    
    def check_and_create_alerts(self):
        """Check for low stock and create alert records"""
        # This can be expanded to send emails or push notifications
        alerts = self.get_low_stock_alerts()
        return {
            'total_alerts': len(alerts),
            'critical_alerts': len([a for a in alerts if a['severity'] == 'critical']),
            'warning_alerts': len([a for a in alerts if a['severity'] == 'warning']),
            'alerts': alerts
        }
