import { API_List_Offer_Admin } from "../../../route-api";

export type AdminOffer = {
    id: number,
    project_name: string,
    project_type: string,
    project_status: string,
    project_created_at: string,
    project_registration_due_at: string,
    project_registration_status: string,
    project_registered_supplier: string | null | undefined | number,
    project_winner: string | null
}

// Simulated API function for admin offers
export const fetchAdminManageOffers = async () => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_List_Offer_Admin(), {
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
            return data.data;
        }
    } catch (error) {
        console.error("Error fetch offers details:", error);
        throw error;
    }
}