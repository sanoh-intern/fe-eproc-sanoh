import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

function useFetch(url: string, method = "GET", body: any = null, bodyType = "json") {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const token = localStorage.getItem("access_token");

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const headers: { [key: string]: string } = {
            "Content-Type": bodyType === "formdata" ? "multipart/form-data" : "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        let requestBody: BodyInit | null = null;
        if (body) {
            requestBody = bodyType === "json" ? JSON.stringify(body) : body;
        }

        const options = {
            method,
            headers,
            body: requestBody,
        };

        fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    // Handle specific HTTP error codes
                    const errorMessage = `HTTP error! Status: ${response.status}`;
                    throw new Error(errorMessage);
                }
                return response.json();
            })
            .then((result) => {
                if (result.status) {
                    // If API response status is true (success)
                    setData(result.data);
                    setMessage(result.message || "Success");
                } else {
                    // If API response status is false (error)
                    setError(result.error || "An error occurred");
                    toast.error(`Error: ${Array.isArray(result.error) ? result.error.join(", ") : result.error}`);
                }
            })
            .catch((err) => {
                setError(err.message);
                toast.error(`Error: ${err.message}`);
            })
            .finally(() => setLoading(false));
    }, [url, method, body, bodyType, token]);

    useEffect(() => {
        if (method === "GET") {
            fetchData();
        }
    }, [fetchData, method]);

    return { data, loading, error, message, refetch: fetchData };
}

export default useFetch;
