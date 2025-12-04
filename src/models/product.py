"""
Product Model - Member 1 responsibility
Handles product data structure and operations
"""

class Product:
    def __init__(self, product_id=None, name="", sku="", category="", brand="", 
                 price=0.0, quantity=0, supplier_id=None, reorder_level=10, 
                 barcode="", location=""):
        self.product_id = product_id
        self.name = name
        self.sku = sku
        self.category = category
        self.brand = brand
        self.price = price
        self.quantity = quantity
        self.supplier_id = supplier_id
        self.reorder_level = reorder_level
        self.barcode = barcode
        self.location = location
    
    def to_dict(self):
        """Convert product to dictionary"""
        return {
            'product_id': self.product_id,
            'name': self.name,
            'sku': self.sku,
            'category': self.category,
            'brand': self.brand,
            'price': self.price,
            'quantity': self.quantity,
            'supplier_id': self.supplier_id,
            'reorder_level': self.reorder_level,
            'barcode': self.barcode,
            'location': self.location
        }
    
    def is_low_stock(self):
        """Check if product is low on stock"""
        return self.quantity <= self.reorder_level
    
    def __str__(self):
        return f"Product({self.product_id}, {self.name}, Qty: {self.quantity})"
