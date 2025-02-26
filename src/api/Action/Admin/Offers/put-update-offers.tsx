import { API_Update_Offer_Admin } from "../../../route-api";

export const putEditOffers = async (formData: any, offerId: any) => {
    const token = localStorage.getItem("access_token")
        try {
            const response = await fetch(`${API_Update_Offer_Admin()}${offerId}?_method=PUT`, {
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
};