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
            return {
                status: true,
                message: "Final winner posted successfully",
            };
        } else {
            return {
                status: false,
                message: "Error posting final winner",
                error: data.error || "Error",
            };
        }

    } catch (error : any) {
        console.error("Error", error)
        return {
            status: false,
            message: "Error",
            error: error.message || "Error"
        }
    }
};
export const postOffersDeclined = async ({ negotiationId }: PostFinalWinnerProps) => {
    try {
        const response = await fetch(API_Declined_Proposal_Admin() + negotiationId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (response.ok && data.status === true) {
            return {
                status: true,
                message: "Final winner posted successfully",
            };

        } else {
            return {
                status: false,
                message: "Error posting final winner",
                error: data.error || "Error",
            };
        }
    } catch (error : any) {
        console.error("Error", error)
        return {
            status: false,
            message: "Error",
            error: error.message || "Error"
        }
    }
};