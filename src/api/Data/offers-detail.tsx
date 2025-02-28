import { toast } from "react-toastify";
import { API_Detail_Offer } from "../route-api";

export type TypeOfferDetails = {
    project_name: string;
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
        const response = await fetch((API_Detail_Offer()) + offersId, {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${token}`
            },
        });

        const data = await response.json();

        if (response.ok && data.status === true) {
            if (!data.data) {
                toast.error(data.message || "Error")
                return
            }
            return data.data
        } else {
            toast.error(data.error || "Error")
            return 
        }
    } catch (error) {
        console.error("Server error plase try again later:", error)
        toast.error("Server error plase try again later")
        return
    }
}

export default fetchOfferDetails;