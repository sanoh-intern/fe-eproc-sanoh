import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function useFetch(url: string, method = "GET", body = null) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem("access_token"); // Ambil token dari Local Storage

    const fetchData = useCallback(() => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const headers: { [key: string]: string } = {
        "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`; // Tambahkan token jika ada
        }

        const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        };

        fetch(url, options)
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((result) => {
            if (result.status) {
            // Jika API mengembalikan status true (berhasil)
            setData(result.data);
            setMessage(result.message || "Berhasil");
            } else {
            // Jika API mengembalikan status false (gagal)
            setError(result.error || "Terjadi kesalahan");
            toast.error(`Error: ${Array.isArray(result.error) ? result.error.join(", ") : result.error}`);
            }
        })
        .catch((err) => {
            setError(err.message);
            toast.error(`Error: ${err.message}`); // Menampilkan error dengan Toastify
        })
        .finally(() => setLoading(false));
    }, [url, method, body, token]);

    useEffect(() => {
        if (method === "GET") {
        fetchData();
        }
    }, [fetchData, method]);

    return { data, loading, error, message, refetch: fetchData };
}

export default useFetch;
