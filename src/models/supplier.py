"""
Supplier Model - Member 2 responsibility
Handles supplier data structure and operations
"""

class Supplier:
    def __init__(self, supplier_id=None, name="", contact_person="", 
                 phone="", email="", address=""):
        self.supplier_id = supplier_id
        self.name = name
        self.contact_person = contact_person
        self.phone = phone
        self.email = email
        self.address = address
    
    def to_dict(self):
        """Convert supplier to dictionary"""
        return {
            'supplier_id': self.supplier_id,
            'name': self.name,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'email': self.email,
            'address': self.address
        }
    
    def __str__(self):
        return f"Supplier({self.supplier_id}, {self.name}, {self.phone})"
