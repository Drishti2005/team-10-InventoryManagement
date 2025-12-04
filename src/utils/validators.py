"""
Validators - Member 4 responsibility
Input validation utilities
"""
import re

class Validator:
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        # TODO: Member 4 - Implement email validation
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone(phone):
        """Validate phone number"""
        # TODO: Member 4 - Implement phone validation
        pass
    
    @staticmethod
    def validate_positive_number(value):
        """Validate positive number"""
        # TODO: Member 4 - Implement number validation
        pass
    
    @staticmethod
    def validate_not_empty(value):
        """Validate non-empty string"""
        # TODO: Member 4 - Implement empty check
        pass
