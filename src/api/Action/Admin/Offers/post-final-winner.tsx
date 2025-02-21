import { API_Select_Winner_Offer_Admin } from "../../../route-api";

interface PostFinalWinnerProps {
    negotiationId: string;
}

export const postOffersAccepted = async ({ negotiationId }: PostFinalWinnerProps) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Select_Winner_Offer_Admin(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ "project_detail_id": negotiationId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error posting the final winner:', error);
        throw error;
    }
};
export const postOffersDeclined = async ({ negotiationId }: PostFinalWinnerProps) => {
    try {
        const response = await fetch('/api/proposals/declined', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ negotiationId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error posting the final winner:', error);
        throw error;
    }
};