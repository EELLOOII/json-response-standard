#!/usr/bin/env python3
"""
Test suite for Python JSON Response Standard
"""

import sys
import os
import json

# Add the examples directory to the path so we can import the response module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'examples'))

from response import json_response

def test(description, test_func):
    """Simple test runner function"""
    try:
        test_func()
        print(f"[PASS] {description}")
        return True
    except Exception as error:
        print(f"[FAIL] {description}: {error}")
        return False

def run_tests():
    """Run all tests and return the number of passed tests"""
    passed_tests = 0
    total_tests = 0
    
    # Test 1: Basic response generation
    def test_basic_response():
        result = json_response({"user": "John"}, 200, "Success")
        parsed = json.loads(result)
        assert parsed["status"] == 200, "Status should be 200"
        assert parsed["message"] == "Success", "Message should be 'Success'"
        assert parsed["data"]["user"] == "John", "Data should contain user"
    
    total_tests += 1
    if test("Basic response generation", test_basic_response):
        passed_tests += 1

    # Test 2: Default values
    def test_default_values():
        result = json_response()
        parsed = json.loads(result)
        assert parsed["status"] == 200, "Default status should be 200"
        assert parsed["message"] == "", "Default message should be empty"
        assert isinstance(parsed["data"], dict), "Default data should be dict"
    
    total_tests += 1
    if test("Default values", test_default_values):
        passed_tests += 1

    # Test 3: Status validation - invalid type
    def test_status_validation_invalid_type():
        error_raised = False
        try:
            json_response({}, "invalid", "test")
        except ValueError as e:
            error_raised = True
            assert "Status must be a valid HTTP status code" in str(e), "Wrong error message for invalid status type"
        assert error_raised, "Should raise ValueError for invalid status type"
    
    total_tests += 1
    if test("Status validation - invalid type", test_status_validation_invalid_type):
        passed_tests += 1

    # Test 4: Status validation - out of range
    def test_status_validation_out_of_range():
        error_raised = False
        try:
            json_response({}, 99, "test")
        except ValueError as e:
            error_raised = True
            assert "Status must be a valid HTTP status code" in str(e), "Wrong error message for out of range status"
        assert error_raised, "Should raise ValueError for out of range status"
    
    total_tests += 1
    if test("Status validation - out of range", test_status_validation_out_of_range):
        passed_tests += 1

    # Test 5: Message validation - invalid type
    def test_message_validation_invalid_type():
        error_raised = False
        try:
            json_response({}, 200, 123)
        except TypeError as e:
            error_raised = True
            assert "Message must be a string" in str(e), "Wrong error message for invalid message type"
        assert error_raised, "Should raise TypeError for invalid message type"
    
    total_tests += 1
    if test("Message validation - invalid type", test_message_validation_invalid_type):
        passed_tests += 1

    # Test 6: None data handling
    def test_none_data_handling():
        result = json_response(None, 200, "Success")
        parsed = json.loads(result)
        assert parsed["data"] == {}, "None data should default to empty dict"
    
    total_tests += 1
    if test("None data handling", test_none_data_handling):
        passed_tests += 1

    # Test 7: Complex data structure
    def test_complex_data():
        complex_data = {
            "users": [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}],
            "meta": {"total": 2, "page": 1}
        }
        result = json_response(complex_data, 201, "Created")
        parsed = json.loads(result)
        assert parsed["status"] == 201, "Status should be 201"
        assert parsed["data"]["users"][0]["name"] == "John", "Complex data should be preserved"
    
    total_tests += 1
    if test("Complex data structure", test_complex_data):
        passed_tests += 1

    print(f"\nTests completed! {passed_tests}/{total_tests} tests passed.")
    
    if passed_tests == total_tests:
        print("[SUCCESS] All Python tests passed!")
    else:
        print(f"[WARNING] {total_tests - passed_tests} tests failed.")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
