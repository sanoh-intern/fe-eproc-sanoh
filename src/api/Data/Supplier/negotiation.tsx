import { API_Negotiation_Supplier } from "../../route-api"

export type TypeNegotiationSupplier = {
    id: string
    proposal_submit_date: string
    proposal_total_amount: number | null
    proposal_revision_no: number | null
    proposal_status: string | null
    is_final: boolean
    proposal_attach?: string | null  // URL to the attachment file
}

const fetchNegotiationSupplier = async (offerid: string) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch((API_Negotiation_Supplier()) + offerid, {
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

export default fetchNegotiationSupplier;