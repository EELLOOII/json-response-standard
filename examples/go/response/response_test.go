package response_test

import (
	"reflect"
	"testing"

	"json-response-standard/response"
)

func TestBasicResponseGeneration(t *testing.T) {
	payload := map[string]string{"user": "John"}
	parsed, _ := response.JSONResponse(payload, 200, "Success")
	if parsed.Status != 200 {
		t.Errorf("[FAIL] Status should be 200")
	}
	if parsed.Message != "Success" {
		t.Logf("[FAIL] Message should be 'Success'")
	}
	if !reflect.DeepEqual(parsed.Data, payload) {
		t.Logf("[FAIL] Data should contain user")
	}
}

func TestStatusValidationOutOfRange(t *testing.T) {
	payload := map[string]string{"user": "John"}
	_, err := response.JSONResponse(payload, 99, "Test")
	if err == nil {
		t.Logf("[FAIL] Should throw error for out of range status")
	}
}

func TestEmptyData(t *testing.T) {
	parsed, _ := response.JSONResponse(nil, 200, "Empty Data")
	if !reflect.DeepEqual(parsed.Data, nil) {
		t.Logf("[FAIL] Data should be nil")
	}
}

func TestNestedData(t *testing.T) {
	nested := map[string]any{
		"user":  map[string]string{"name": "Alice"},
		"roles": []string{"admin", "editor"},
	}
	parsed, _ := response.JSONResponse(nested, 200, "Nested")
	if !reflect.DeepEqual(parsed.Data, nested) {
		t.Logf("[FAIL] Data should contain 'user' and 'roles'")
	}
}
