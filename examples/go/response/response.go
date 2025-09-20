package response

import "errors"

type Response struct {
	Data    any    `json:"data"`
	Status  int    `json:"status"`
	Message string `json:"message"`
}

func JSONResponse(data any, status int, message string) (Response, error) {
	if status < 100 || status > 599 {
		return Response{}, errors.New("status must be a valid HTTP status code (100-599)")
	}

	return Response{
		Data:    data,
		Status:  status,
		Message: message,
	}, nil
}
