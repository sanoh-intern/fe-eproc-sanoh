import { API_List_Registered_Offer_Admin } from "../../../route-api"

export type TypeListRegisteredOffer = {
    id: number
    project_name: string
    project_type: string
    project_created_at: string
    project_registration_status: string
    project_registered_supplier: number | null | undefined | string
    project_winner: string | null
    project_registration_due_at: string
    project_status: string
}


const fetchListRegisteredOffers = async () => {
    const token = localStorage.getItem("access_token")
    try {
        const response = await fetch(API_List_Registered_Offer_Admin(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching list registered offers:", error)
        throw error
    }
}

export default fetchListRegisteredOffers;