# 📦 Inventory Management System

A modern web-based system to track, manage, and update stock levels for businesses.

## 🌟 Features
- **Product Management** - Add, update, delete, and view products
- **Supplier Management** - Track supplier information and contacts
- **Stock Tracking** - Record stock IN/OUT transactions
- **Low Stock Alerts** - Automatic alerts for products needing reorder
- **Transaction History** - Complete audit trail of all stock movements
- **Modern Web Interface** - Beautiful, responsive design
- **Real-time Updates** - Instant data refresh

## 🚀 Quick Start

### Option 1: Automatic (Windows)
Double-click `INSTALL_AND_RUN.bat`

### Option 2: Manual
```cmd
pip install Flask Flask-CORS
python add_sample_data.py  # Optional: adds test data
python main.py
```

Then open: **http://localhost:5000**

## 📸 Screenshots

The application includes:
- **Products Tab**: Manage inventory with stock status indicators
- **Suppliers Tab**: Track supplier contacts and information
- **Transactions Tab**: Record and view stock movements
- **Reports Tab**: View low stock alerts and analytics

## 🛠️ Technology Stack

- **Backend**: Python 3.8+, Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite
- **API**: RESTful API design

## Team Members & Responsibilities

### Member 1: Product Management Module
- `src/models/product.py` - Product data model
- `src/controllers/product_controller.py` - Product CRUD operations
- `tests/test_product.py` - Product module tests

### Member 2: Supplier Management Module
- `src/models/supplier.py` - Supplier data model
- `src/controllers/supplier_controller.py` - Supplier CRUD operations
- `tests/test_supplier.py` - Supplier module tests

### Member 3: Transaction & Stock Management Module
- `src/models/transaction.py` - Transaction data model
- `src/controllers/transaction_controller.py` - Transaction operations
- `tests/test_transaction.py` - Transaction module tests

### Member 4: Database & Utilities
- `src/database/db_manager.py` - Database connection and setup
- `src/utils/validators.py` - Input validation utilities
- `tests/test_database.py` - Database tests

### Member 5: UI & Reports Module
- `src/ui/menu.py` - Main menu interface
- `src/reports/report_generator.py` - Generate reports
- `tests/test_ui.py` - UI tests

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory-management-system
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

## Git Workflow for Team Members

1. Create your branch:
```bash
git checkout -b feature/your-module-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "Add: your feature description"
```

3. Push to GitHub:
```bash
git push origin feature/your-module-name
```

4. Create a Pull Request on GitHub

## Project Structure
```
inventory-management-system/
├── src/
│   ├── models/
│   ├── controllers/
│   ├── database/
│   ├── ui/
│   ├── utils/
│   └── reports/
├── tests/
├── data/
├── docs/
├── main.py
├── requirements.txt
└── README.md
```
