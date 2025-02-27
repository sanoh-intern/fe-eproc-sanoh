import { API_Post_Proposal_Supplier } from "../../route-api"

export const postNegotiation = async (formData: any) => {
    const token = localStorage.getItem("access_token")
    try {
        const response = await fetch(API_Post_Proposal_Supplier(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const data = await response.json()

        if (response.ok && data.status === true) {
            return {
                status: true,
                message: "Add Negotiation Successful",
                data: data.data
            };
        } else {
            return {
                status: false,
                message: "Error Add Negotiation",
                error: data.error || "Error"
            };
        }
    } catch (error: any) {
        console.error("Error updating offers:", error)
        return {
            status: false,
            message: "Error Add Negotiation",
            error: error.message || "Error"
        };
    }
}