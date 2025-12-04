"""
Add sample data to test the application
"""
from src.database.db_manager import DatabaseManager
from src.controllers.product_controller import ProductController
from src.controllers.supplier_controller import SupplierController
from src.controllers.transaction_controller import TransactionController

def add_sample_data():
    print("Initializing database...")
    db = DatabaseManager()
    db.initialize_database()
    
    product_ctrl = ProductController()
    supplier_ctrl = SupplierController()
    transaction_ctrl = TransactionController()
    
    print("\nAdding sample suppliers...")
    supplier1 = supplier_ctrl.add_supplier(
        "Tech Supplies Inc", "John Doe", "555-0101", "john@techsupplies.com", "123 Tech Street"
    )
    supplier2 = supplier_ctrl.add_supplier(
        "Office Depot", "Jane Smith", "555-0102", "jane@officedepot.com", "456 Office Ave"
    )
    supplier3 = supplier_ctrl.add_supplier(
        "Electronics World", "Bob Johnson", "555-0103", "bob@electronicsworld.com", "789 Electronics Blvd"
    )
    print("✓ Added 3 suppliers")
    
    print("\nAdding sample products...")
    product1 = product_ctrl.add_product("Laptop", "LAP-001", "Electronics", "Dell", 999.99, 15, 1, 5, "123456789012", "A1-01")
    product2 = product_ctrl.add_product("Mouse", "MOU-001", "Electronics", "Logitech", 29.99, 50, 1, 10, "123456789013", "A1-02")
    product3 = product_ctrl.add_product("Keyboard", "KEY-001", "Electronics", "Logitech", 79.99, 30, 1, 10, "123456789014", "A1-03")
    product4 = product_ctrl.add_product("Monitor", "MON-001", "Electronics", "Samsung", 299.99, 8, 3, 5, "123456789015", "A2-01")
    product5 = product_ctrl.add_product("USB Cable", "USB-001", "Accessories", "Generic", 9.99, 100, 2, 20, "123456789016", "B1-01")
    product6 = product_ctrl.add_product("Desk Chair", "CHR-001", "Furniture", "IKEA", 199.99, 3, 2, 5, "123456789017", "C1-01")
    product7 = product_ctrl.add_product("Notebook", "NOT-001", "Stationery", "Moleskine", 4.99, 200, 2, 50, "123456789018", "B2-01")
    product8 = product_ctrl.add_product("Pen Set", "PEN-001", "Stationery", "Parker", 12.99, 75, 2, 25, "123456789019", "B2-02")
    print("✓ Added 8 products")
    
    print("\nAdding sample transactions...")
    transaction_ctrl.add_stock(1, 5, "Initial stock")
    transaction_ctrl.add_stock(2, 20, "Restocking")
    transaction_ctrl.remove_stock(3, 10, "Sold to customer")
    transaction_ctrl.add_stock(4, 2, "New shipment")
    transaction_ctrl.remove_stock(5, 15, "Office use")
    print("✓ Added 5 transactions")
    
    print("\n" + "="*50)
    print("✅ Sample data added successfully!")
    print("="*50)
    print("\nYou can now run the application:")
    print("  python main.py")
    print("\nThen open: http://localhost:5000")
    print("="*50)

if __name__ == "__main__":
    add_sample_data()
