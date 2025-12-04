"""
Product Controller - Member 1 responsibility
Handles product CRUD operations
"""
from src.models.product import Product
from src.database.db_manager import DatabaseManager

class ProductController:
    def __init__(self):
        self.db = DatabaseManager()
    
    def add_product(self, name, sku, category, brand, price, quantity, supplier_id, reorder_level=10, barcode="", location=""):
        """Add a new product"""
        from datetime import datetime
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        query = '''INSERT INTO products (name, sku, category, brand, price, quantity, supplier_id, reorder_level, barcode, location, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'''
        try:
            product_id = self.db.execute_query(query, (name, sku, category, brand, price, quantity, supplier_id, reorder_level, barcode, location, now, now))
            return {'success': True, 'product_id': product_id, 'message': 'Product added successfully'}
        except Exception as e:
            return {'success': False, 'message': f'Error: {str(e)}'}
    
    def get_product(self, product_id):
        """Get product by ID"""
        query = 'SELECT * FROM products WHERE product_id = ?'
        result = self.db.fetch_one(query, (product_id,))
        if result:
            return {
                'product_id': result[0], 'name': result[1], 'sku': result[2],
                'category': result[3], 'brand': result[4], 'price': result[5],
                'quantity': result[6], 'supplier_id': result[7], 'reorder_level': result[8],
                'barcode': result[9], 'location': result[10]
            }
        return None
    
    def update_product(self, product_id, **kwargs):
        """Update product details"""
        from datetime import datetime
        fields = []
        values = []
        allowed_fields = ['name', 'sku', 'category', 'brand', 'price', 'quantity', 'supplier_id', 'reorder_level', 'barcode', 'location']
        
        for key, value in kwargs.items():
            if key in allowed_fields:
                fields.append(f"{key} = ?")
                values.append(value)
        
        if fields:
            fields.append("updated_at = ?")
            values.append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            values.append(product_id)
            query = f"UPDATE products SET {', '.join(fields)} WHERE product_id = ?"
            self.db.execute_query(query, tuple(values))
            return {'success': True, 'message': 'Product updated successfully'}
        return {'success': False, 'message': 'No valid fields to update'}
    
    def delete_product(self, product_id):
        """Delete a product"""
        query = 'DELETE FROM products WHERE product_id = ?'
        self.db.execute_query(query, (product_id,))
        return {'success': True, 'message': 'Product deleted successfully'}
    
    def list_all_products(self):
        """List all products"""
        query = 'SELECT * FROM products ORDER BY name'
        results = self.db.fetch_all(query)
        products = []
        for row in results:
            products.append({
                'product_id': row[0], 'name': row[1], 'sku': row[2],
                'category': row[3], 'brand': row[4], 'price': row[5],
                'quantity': row[6], 'supplier_id': row[7], 'reorder_level': row[8],
                'barcode': row[9], 'location': row[10]
            })
        return products
    
    def search_products(self, keyword):
        """Search products by name, SKU, category, brand, or barcode"""
        query = '''SELECT * FROM products 
                   WHERE name LIKE ? OR sku LIKE ? OR category LIKE ? 
                   OR brand LIKE ? OR barcode LIKE ?'''
        search_term = f'%{keyword}%'
        results = self.db.fetch_all(query, (search_term, search_term, search_term, search_term, search_term))
        products = []
        for row in results:
            products.append({
                'product_id': row[0], 'name': row[1], 'sku': row[2],
                'category': row[3], 'brand': row[4], 'price': row[5],
                'quantity': row[6], 'supplier_id': row[7], 'reorder_level': row[8],
                'barcode': row[9], 'location': row[10]
            })
        return products
    
    def get_low_stock_products(self):
        """Get products with low stock"""
        query = 'SELECT * FROM products WHERE quantity <= reorder_level ORDER BY quantity ASC'
        results = self.db.fetch_all(query)
        products = []
        for row in results:
            products.append({
                'product_id': row[0], 'name': row[1], 'sku': row[2],
                'category': row[3], 'brand': row[4], 'price': row[5],
                'quantity': row[6], 'supplier_id': row[7], 'reorder_level': row[8],
                'barcode': row[9], 'location': row[10]
            })
        return products
    
    def get_products_by_category(self):
        """Get products grouped by category"""
        query = '''SELECT category, COUNT(*) as count, SUM(quantity) as total_quantity
                   FROM products GROUP BY category ORDER BY count DESC'''
        results = self.db.fetch_all(query)
        categories = []
        for row in results:
            categories.append({
                'category': row[0] or 'Uncategorized',
                'product_count': row[1],
                'total_quantity': row[2]
            })
        return categories
    
    def get_top_products_by_quantity(self, limit=5):
        """Get top products by quantity"""
        query = f'SELECT * FROM products ORDER BY quantity DESC LIMIT {limit}'
        results = self.db.fetch_all(query)
        products = []
        for row in results:
            products.append({
                'product_id': row[0], 'name': row[1], 'sku': row[2],
                'category': row[3], 'brand': row[4], 'price': row[5],
                'quantity': row[6], 'supplier_id': row[7], 'reorder_level': row[8],
                'barcode': row[9], 'location': row[10]
            })
        return products
