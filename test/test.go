package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	response "github.com/EELLOOII/json-response-standard/go-lib/examples"
)

type Response = response.Response

var passedTests = 0
var totalTests = 0

func test(description string, testFunc func() error) {
	totalTests++
	err := testFunc()
	if err != nil {
		fmt.Printf("[FAIL] %s: %s\n", description, err.Error())
	} else {
		fmt.Printf("[PASS] %s\n", description)
		passedTests++
	}
}

func main() {
	// Test 1: Basic response generation
	test("Basic response generation", func() error {
		data := map[string]interface{}{"user": "John"}
		result, err := response.JsonResponse(data, 200, "Success")
		if err != nil {
			return fmt.Errorf("unexpected error: %v", err)
		}

		var parsed Response
		if err := json.Unmarshal([]byte(result), &parsed); err != nil {
			return fmt.Errorf("failed to parse JSON: %v", err)
		}

		if parsed.Status != 200 {
			return fmt.Errorf("status should be 200, got %d", parsed.Status)
		}
		if parsed.Message != "Success" {
			return fmt.Errorf("message should be 'Success', got '%s'", parsed.Message)
		}

		dataMap, ok := parsed.Data.(map[string]interface{})
		if !ok {
			return fmt.Errorf("data should be a map")
		}
		if dataMap["user"] != "John" {
			return fmt.Errorf("data should contain user 'John'")
		}
		return nil
	})

	// Test 2: Default values
	test("Default values", func() error {
		result, err := response.JsonResponse(nil, 200, "")
		if err != nil {
			return fmt.Errorf("unexpected error: %v", err)
		}

		var parsed Response
		if err := json.Unmarshal([]byte(result), &parsed); err != nil {
			return fmt.Errorf("failed to parse JSON: %v", err)
		}

		if parsed.Status != 200 {
			return fmt.Errorf("default status should be 200, got %d", parsed.Status)
		}
		if parsed.Message != "" {
			return fmt.Errorf("default message should be empty, got '%s'", parsed.Message)
		}
		if parsed.Data != nil {
			return fmt.Errorf("nil data should remain nil in JSON")
		}
		return nil
	})

	// Test 3: Status validation - out of range (low)
	test("Status validation - out of range (low)", func() error {
		_, err := response.JsonResponse(map[string]interface{}{}, 99, "test")
		if err == nil {
			return fmt.Errorf("should return error for out of range status")
		}
		if !strings.Contains(err.Error(), "status must be a valid HTTP status code") {
			return fmt.Errorf("wrong error message for out of range status: %s", err.Error())
		}
		return nil
	})

	// Test 4: Status validation - out of range (high)
	test("Status validation - out of range (high)", func() error {
		_, err := response.JsonResponse(map[string]interface{}{}, 600, "test")
		if err == nil {
			return fmt.Errorf("should return error for out of range status")
		}
		if !strings.Contains(err.Error(), "status must be a valid HTTP status code") {
			return fmt.Errorf("wrong error message for out of range status: %s", err.Error())
		}
		return nil
	})

	// Test 5: Nil data handling
	test("Nil data handling", func() error {
		result, err := response.JsonResponse(nil, 200, "Success")
		if err != nil {
			return fmt.Errorf("unexpected error: %v", err)
		}

		var parsed Response
		if err := json.Unmarshal([]byte(result), &parsed); err != nil {
			return fmt.Errorf("failed to parse JSON: %v", err)
		}

		if parsed.Data != nil {
			return fmt.Errorf("nil data should remain nil")
		}
		return nil
	})

	// Test 6: Complex data structure
	test("Complex data structure", func() error {
		complexData := map[string]interface{}{
			"users": []map[string]interface{}{
				{"id": 1, "name": "John"},
				{"id": 2, "name": "Jane"},
			},
			"meta": map[string]interface{}{
				"total": 2,
				"page":  1,
			},
		}
		result, err := response.JsonResponse(complexData, 201, "Created")
		if err != nil {
			return fmt.Errorf("unexpected error: %v", err)
		}

		var parsed Response
		if err := json.Unmarshal([]byte(result), &parsed); err != nil {
			return fmt.Errorf("failed to parse JSON: %v", err)
		}

		if parsed.Status != 201 {
			return fmt.Errorf("status should be 201, got %d", parsed.Status)
		}

		dataMap, ok := parsed.Data.(map[string]interface{})
		if !ok {
			return fmt.Errorf("data should be a map")
		}

		users, ok := dataMap["users"].([]interface{})
		if !ok {
			return fmt.Errorf("users should be an array")
		}

		firstUser, ok := users[0].(map[string]interface{})
		if !ok {
			return fmt.Errorf("first user should be a map")
		}

		if firstUser["name"] != "John" {
			return fmt.Errorf("complex data should be preserved")
		}
		return nil
	})

	// Test 7: Empty object data
	test("Empty object data", func() error {
		result, err := response.JsonResponse(map[string]interface{}{}, 204, "No Content")
		if err != nil {
			return fmt.Errorf("unexpected error: %v", err)
		}

		var parsed Response
		if err := json.Unmarshal([]byte(result), &parsed); err != nil {
			return fmt.Errorf("failed to parse JSON: %v", err)
		}

		dataMap, ok := parsed.Data.(map[string]interface{})
		if !ok {
			return fmt.Errorf("data should be a map")
		}
		if len(dataMap) != 0 {
			return fmt.Errorf("empty data should remain empty")
		}
		return nil
	})

	// Test 8: Valid status code boundaries
	test("Valid status code boundaries", func() error {
		// Test lower boundary
		_, err := response.JsonResponse(nil, 100, "Continue")
		if err != nil {
			return fmt.Errorf("status 100 should be valid: %v", err)
		}

		// Test upper boundary
		_, err = response.JsonResponse(nil, 599, "Custom")
		if err != nil {
			return fmt.Errorf("status 599 should be valid: %v", err)
		}
		return nil
	})

	// Summary
	fmt.Printf("\nTests completed! %d/%d tests passed.\n", passedTests, totalTests)

	if passedTests == totalTests {
		fmt.Println("[SUCCESS] All Go tests passed!")
		os.Exit(0)
	} else {
		fmt.Printf("[WARNING] %d tests failed.\n", totalTests-passedTests)
		os.Exit(1)
	}
}
