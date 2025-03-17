import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook for making API requests
 * @param url API endpoint URL
 * @param method HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param body Request body (object for JSON or FormData)
 * @param bodyType Body format - 'json' or 'formdata'
 * @returns Object with data, loading state, error, message, and refetch function
 */
function useFetch(url: string, method = "GET", body: any = null, bodyType: 'json' | 'formdata' = 'json') {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | string[] | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const token = localStorage.getItem("access_token");

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);
        setMessage(null);

        // Prepare headers based on body type
        const headers: Record<string, string> = {};
        
        // Only set Content-Type if we have a body
        if (body) {
            // For FormData, don't set Content-Type as the browser will set it automatically
            // with the correct boundary
            if (bodyType !== 'formdata') {
                headers["Content-Type"] = "application/json";
            }
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Prepare the request body based on bodyType
        let requestBody: any = null;
        if (body) {
            if (bodyType === 'json') {
                requestBody = JSON.stringify(body);
            } else {
                // For 'formdata', use the body as is if it's already FormData
                // or create a new FormData from the object
                if (body instanceof FormData) {
                    requestBody = body;
                } else {
                    requestBody = new FormData();
                    Object.entries(body).forEach(([key, value]) => {
                        requestBody.append(key, value);
                    });
                }
            }
        }

        const options: RequestInit = {
            method,
            headers,
            body: requestBody,
        };

        fetch(url, options)
            .then((response) => {
                // Store status code for handling specific HTTP errors
                const statusCode = response.status;
                
                // Try to parse the response as JSON regardless of status code
                return response.json().then(data => {
                    // Add the status code to the response for error handling
                    return { ...data, statusCode };
                }).catch(() => {
                    // If JSON parsing fails, create a synthetic response
                    throw new Error(`HTTP error! Status: ${statusCode}, could not parse response`);
                });
            })
            .then((result) => {
                // Check if we have a successful API response (status: true)
                if (result.status === true) {
                    setData(result.data);
                    setMessage(result.message || "Success");
                } else {
                    // API returned status: false
                    setError(result.error || "An error occurred");
                    toast.error(`Error: ${Array.isArray(result.error) ? result.error.join(", ") : result.error || "Unknown error"}`);
                }
                
                // Handle specific HTTP status codes if needed
                if (result.statusCode >= 400) {
                    let errorMsg = `HTTP Error: ${result.statusCode}`;
                    
                    if (result.statusCode === 401) {
                        errorMsg = "Unauthorized. Please log in again.";
                        // Optional: Redirect to login or refresh token
                    } else if (result.statusCode === 403) {
                        errorMsg = "Forbidden. You don't have permission to access this resource.";
                    } else if (result.statusCode === 404) {
                        errorMsg = "Resource not found.";
                    } else if (result.statusCode === 500) {
                        errorMsg = "Server error. Please try again later.";
                    }
                    
                    setError(errorMsg);
                    toast.error(errorMsg);
                }
            })
            .catch((err) => {
                setError(err.message);
                toast.error(`Error: ${err.message}`);
            })
            .finally(() => setLoading(false));
    }, [url, method, body, bodyType, token]);

    useEffect(() => {
        // Automatically fetch data only for GET requests
        if (method === "GET") {
            fetchData();
        }
    }, [fetchData, method]);

    return { data, loading, error, message, refetch: fetchData };
}

export default useFetch;