"""
Transaction Model - Member 3 responsibility
Handles transaction data structure and operations
"""
from datetime import datetime

class Transaction:
    def __init__(self, transaction_id=None, product_id=None, 
                 transaction_type="", quantity=0, date=None, notes=""):
        self.transaction_id = transaction_id
        self.product_id = product_id
        self.transaction_type = transaction_type  # 'IN' or 'OUT'
        self.quantity = quantity
        self.date = date or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.notes = notes
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        return {
            'transaction_id': self.transaction_id,
            'product_id': self.product_id,
            'transaction_type': self.transaction_type,
            'quantity': self.quantity,
            'date': self.date,
            'notes': self.notes
        }
    
    def __str__(self):
        return f"Transaction({self.transaction_id}, {self.transaction_type}, Qty: {self.quantity})"
