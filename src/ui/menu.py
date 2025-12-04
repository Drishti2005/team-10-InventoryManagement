"""
Main Menu - Member 5 responsibility
User interface and menu system
"""
from src.controllers.product_controller import ProductController
from src.controllers.supplier_controller import SupplierController
from src.controllers.transaction_controller import TransactionController

class MainMenu:
    def __init__(self):
        self.product_ctrl = ProductController()
        self.supplier_ctrl = SupplierController()
        self.transaction_ctrl = TransactionController()
    
    def run(self):
        """Run the main menu loop"""
        # TODO: Member 5 - Implement main menu
        while True:
            self.display_main_menu()
            choice = input("\nEnter your choice: ")
            
            if choice == '1':
                self.product_menu()
            elif choice == '2':
                self.supplier_menu()
            elif choice == '3':
                self.transaction_menu()
            elif choice == '4':
                self.reports_menu()
            elif choice == '5':
                print("Thank you for using Inventory Management System!")
                break
            else:
                print("Invalid choice. Please try again.")
    
    def display_main_menu(self):
        """Display main menu"""
        # TODO: Member 5 - Implement menu display
        print("\n" + "=" * 50)
        print("MAIN MENU")
        print("=" * 50)
        print("1. Product Management")
        print("2. Supplier Management")
        print("3. Stock Transactions")
        print("4. Reports")
        print("5. Exit")
    
    def product_menu(self):
        """Product management menu"""
        # TODO: Member 5 - Implement product menu
        pass
    
    def supplier_menu(self):
        """Supplier management menu"""
        # TODO: Member 5 - Implement supplier menu
        pass
    
    def transaction_menu(self):
        """Transaction menu"""
        # TODO: Member 5 - Implement transaction menu
        pass
    
    def reports_menu(self):
        """Reports menu"""
        # TODO: Member 5 - Implement reports menu
        pass
