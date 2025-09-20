import json
from typing import Any, Dict, Union

def json_response(data: Union[Dict[str, Any], None] = None, status: int = 200, message: str = "") -> str:
    """
    Generate a standardized JSON response.
    
    Args:
        data: Response payload (dict or None)
        status: HTTP-like status code (100-599)
        message: Human-readable status message
        
    Returns:
        JSON string with standardized format
        
    Raises:
        ValueError: If status code is invalid
        TypeError: If message is not a string
    """
    if not isinstance(status, int) or status < 100 or status > 599:
        raise ValueError('Status must be a valid HTTP status code (100-599)')
    
    if not isinstance(message, str):
        raise TypeError('Message must be a string')
    
    response = {
        "status": status,
        "message": message,
        "data": data or {}
    }
    return json.dumps(response, indent=2)

# Example
if __name__ == "__main__":
    print(json_response({"user": "John"}, 200, "Success"))
