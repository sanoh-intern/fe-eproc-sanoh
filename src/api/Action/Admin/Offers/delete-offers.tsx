import { API_Delete_Offer_Admin } from "../../../route-api";

interface DeleteOffersProps {
    offersId: string;
}

export const deleteOffers = async ({ offersId }: DeleteOffersProps ) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Delete_Offer_Admin() + offersId, {
            method: "DELETE",
            headers: { 
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ offersId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to delete offer:", error);
        throw error;
    }
};