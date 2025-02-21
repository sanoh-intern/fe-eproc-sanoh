import { toast } from "react-toastify";
import { API_Create_Offer_Admin } from "../../../route-api";
export const postCreateOffers = async (payload: any) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Create_Offer_Admin(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status) {
            toast.success("Offer created successfully!");
            return true;
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
        console.error("Error updating offers:", error);
        toast.error("Error updating offers");
        throw error;
    }
};