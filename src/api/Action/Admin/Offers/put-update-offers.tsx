import { API_Update_Offer_Admin } from "../../../route-api";

export const putEditOffers = async (payload: any) => {
    try {
        const response = await fetch(`${API_Update_Offer_Admin()}?_method=PUT`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating offers:", error);
        throw error;
    }
};