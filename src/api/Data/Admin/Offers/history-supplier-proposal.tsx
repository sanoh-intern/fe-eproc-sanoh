import { API_History_Proposal_Admin } from "../../../route-api"

export type TypeNegotiationData = {
    id: string
    submitDate: string
    totalAmount: number
    revisionNo: number
    status: string | null
    isFinal?: boolean
}

type TypeNegotiation = {
    data?: TypeNegotiationData,
    status?: boolean,
    message?: string,
    error?: string
}

const fetchNegotiationData = async (negotiationId: string, supplierId: string  ): Promise<TypeNegotiation > => {
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
            return {
                status: true,
                message: data.message,
                data: data.data
            }
        } else {
            return {
                status: false,
                message: data.massage,
                error: data.error || "Error"
            }
        }
        } catch (error : any) {
            console.error("Error fetching supplier registered:", error)
            return {
                status: false,
                message: "Error",
                error: error.message || "Error"
            }
        }
}

export default fetchNegotiationData;