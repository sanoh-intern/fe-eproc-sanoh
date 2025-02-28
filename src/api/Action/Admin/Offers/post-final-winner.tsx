import { toast } from "react-toastify";
import { API_Accepted_Proposal_Admin, API_Declined_Proposal_Admin } from "../../../route-api";

interface PostFinalWinnerProps {
    negotiationId: string;
}

export const postOffersAccepted = async ({ negotiationId }: PostFinalWinnerProps) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Accepted_Proposal_Admin(), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ "project_detail_id": [negotiationId] }),
        });

        const data = await response.json();

        if (response.ok && data.status === true) {
            toast.success(data.message || "Success")
            return
        } else {
            toast.error(data.message || "Error")
            return 
        }

    } catch (error : any) {
        console.error("Server error plase try again later:", error)
        toast.error("Server error plase try again later")
        return
    }
};
export const postOffersDeclined = async ({ negotiationId }: PostFinalWinnerProps) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Declined_Proposal_Admin() + negotiationId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        const data = await response.json();
        
        if (response.ok && data.status === true) {
            toast.success(data.message || "Success")
            return data.data
        } else {
            toast.error(data.message || "Error")
            return 
        }
    } catch (error : any) {
        console.error("Server error plase try again later:", error)
        toast.error("Server error plase try again later")
        return
    }
};