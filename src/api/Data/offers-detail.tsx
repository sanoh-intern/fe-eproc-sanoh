import { API_Detail_Project_Supplier } from "../route-api";

export type TypeOfferDetails = {
    id: string;
    projectName: string;
    created_at: string;
    registration_due_at: string;
    project_description: string;
    project_attach: string | null;
    project_type: string;
    registration_status: string;
    project_status: string;
    project_winner?: string | null;
};


const fetchOfferDetails = async (offersId: string) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch((API_Detail_Project_Supplier()) + offersId, {
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

export default fetchOfferDetails;