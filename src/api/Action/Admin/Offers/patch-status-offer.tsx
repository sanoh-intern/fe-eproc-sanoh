import { API_Update_Status_Offer_Admin } from "../../../route-api";

interface PatchStatusOfferProps {
    offersId: string;
}

export const PatchStatusOffer = async ({ offersId }: PatchStatusOfferProps ) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Update_Status_Offer_Admin() + offersId, {
            method: "PATCH",
            headers: { 
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to update last viewed:", error);
        throw error;
    }
};