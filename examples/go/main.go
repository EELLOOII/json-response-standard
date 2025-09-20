package main

import (
	"encoding/json"
	"fmt"

	"json-response-standard/response"
)

type User struct {
	Name string `json:"name"`
}

// Example
func main() {
	payload := User{Name: "John"}
	res, err := response.JSONResponse(payload, 200, "Success")
	if err != nil {
		panic(err)
	}

	b, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(b))
}
