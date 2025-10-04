// Package examples provides a standard JSON response format
package examples

import (
    "encoding/json"
    "fmt"
)

// Response defines the structure of the JSON output.
type Response struct {
    Status  int         `json:"status"`
    Message string      `json:"message"`
    Data    interface{} `json:"data"`
}

// JsonResponse creates a formatted JSON response string with zero dependencies.
// It validates the inputs and returns a JSON string or an error.
func JsonResponse(data interface{}, status int, message string) (string, error) {
    if status < 100 || status > 599 {
        return "", fmt.Errorf("status must be a valid HTTP status code (100-599)")
    }

    response := Response{
        Status:  status,
        Message: message,
        Data:    data,
    }

    jsonString, err := json.MarshalIndent(response, "", "  ")
    if err != nil {
        return "", fmt.Errorf("failed to marshal JSON: %w", err)
    }

    return string(jsonString), nil
}
