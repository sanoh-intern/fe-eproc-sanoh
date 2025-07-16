import { toast } from "react-toastify"
import { API_History_Proposal_Admin } from "../../../route-api"

export type TypeNegotiationData = {
    id: string
    proposal_submit_date: string
    proposal_total_amount: number
    proposal_revision_no: number
    proposal_status: string | null
    is_final?: boolean
    proposal_attach?: string | null  // Path to the attachment file
    message?: string
}

const fetchNegotiationData = async (negotiationId: string, supplierId: string  ) => {
    const token = localStorage.getItem("access_token")
    try {
        const response = await fetch(`${API_History_Proposal_Admin()}${negotiationId}/${supplierId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (response.ok && data.status === true) {
            if (!data.data) {
                toast.error(data.message || "Error")
                return
            }
            return data
        } else {
            toast.error(data.message || "Error")
            return 
        }
    } catch (error : any) {
        console.error("Server error plase try again later:", error)
        toast.error("Server error plase try again later")
        return
    }
}

export default fetchNegotiationData;