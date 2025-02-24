import { toast } from "react-toastify"
import { API_Project_Private_Supplier, API_Project_Public_Supplier } from "../../route-api"

export type TypeOffers = {
    id: string
    project_name: string
    created_at: string
    project_type: string
    registration_due_at: string
    registration_status: string
    is_regis?: boolean
}

export const fetchPublicOffers = async () => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Project_Public_Supplier(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status) {
            return data.data;
        } else {
            if (data.error) {
                const errors = Object.values(data.error).flat().join(" ");
                toast.error(errors);
            } else {
                toast.error(data.message);
            }
            return false;
        }
    } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
    }
}
export const fetchPrivateOffers = async () => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Project_Private_Supplier(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status) {
            return data.data;
        } else {
            if (data.error) {
                const errors = Object.values(data.error).flat().join(" ");
                toast.error(errors);
            } else {
                toast.error(data.message);
            }
            return false;
        }
    } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
    }
}
