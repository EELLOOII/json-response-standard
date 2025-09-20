export interface JsonResponseData {
    [key: string]: any;
}

export interface JsonResponseFormat {
    status: number;
    message: string;
    data: JsonResponseData;
}

/**
 * Generate a standardized JSON response
 * @param data - Response payload (object or null)
 * @param status - HTTP-like status code (100-599)
 * @param message - Human-readable status message
 * @returns JSON string with standardized format
 * @throws Error if status code is invalid or message is not a string
 */
export function jsonResponse(
    data?: JsonResponseData,
    status?: number,
    message?: string
): string;
