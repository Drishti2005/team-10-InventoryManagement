"""
Supplier Controller - Member 2 responsibility
Handles supplier CRUD operations
"""
from src.models.supplier import Supplier
from src.database.db_manager import DatabaseManager

class SupplierController:
    def __init__(self):
        self.db = DatabaseManager()
    
    def add_supplier(self, name, contact_person, phone, email, address):
        """Add a new supplier"""
        query = '''INSERT INTO suppliers (name, contact_person, phone, email, address)
                   VALUES (?, ?, ?, ?, ?)'''
        supplier_id = self.db.execute_query(query, (name, contact_person, phone, email, address))
        return {'success': True, 'supplier_id': supplier_id, 'message': 'Supplier added successfully'}
    
    def get_supplier(self, supplier_id):
        """Get supplier by ID"""
        query = 'SELECT * FROM suppliers WHERE supplier_id = ?'
        result = self.db.fetch_one(query, (supplier_id,))
        if result:
            return {
                'supplier_id': result[0], 'name': result[1], 'contact_person': result[2],
                'phone': result[3], 'email': result[4], 'address': result[5]
            }
        return None
    
    def update_supplier(self, supplier_id, **kwargs):
        """Update supplier details"""
        fields = []
        values = []
        for key, value in kwargs.items():
            if key in ['name', 'contact_person', 'phone', 'email', 'address']:
                fields.append(f"{key} = ?")
                values.append(value)
        
        if fields:
            values.append(supplier_id)
            query = f"UPDATE suppliers SET {', '.join(fields)} WHERE supplier_id = ?"
            self.db.execute_query(query, tuple(values))
            return {'success': True, 'message': 'Supplier updated successfully'}
        return {'success': False, 'message': 'No valid fields to update'}
    
    def delete_supplier(self, supplier_id):
        """Delete a supplier"""
        query = 'DELETE FROM suppliers WHERE supplier_id = ?'
        self.db.execute_query(query, (supplier_id,))
        return {'success': True, 'message': 'Supplier deleted successfully'}
    
    def list_all_suppliers(self):
        """List all suppliers"""
        query = 'SELECT * FROM suppliers'
        results = self.db.fetch_all(query)
        suppliers = []
        for row in results:
            suppliers.append({
                'supplier_id': row[0], 'name': row[1], 'contact_person': row[2],
                'phone': row[3], 'email': row[4], 'address': row[5]
            })
        return suppliers
    
    def get_supplier_products(self, supplier_id):
        """Get all products from a supplier"""
        query = 'SELECT * FROM products WHERE supplier_id = ?'
        results = self.db.fetch_all(query, (supplier_id,))
        products = []
        for row in results:
            products.append({
                'product_id': row[0], 'name': row[1], 'category': row[2],
                'price': row[3], 'quantity': row[4], 'supplier_id': row[5],
                'reorder_level': row[6]
            })
        return products
