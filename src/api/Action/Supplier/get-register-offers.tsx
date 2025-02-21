import { API_Register_Project_Supplier } from "../../route-api";

export const getRegisterOffers = async (offersId: string) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Register_Project_Supplier() + offersId, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${token}`
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }

        if (data.status) {
            return data;
        }
    } catch (error) {
        console.error("Error updating offers:", error);
        throw error;
    }
};