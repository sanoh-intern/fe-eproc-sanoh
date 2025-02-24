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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error updating offers:", error)
        throw error
    }
}