import { API_List_Supplier_Proposal_Admin } from "../../../route-api"

export type TypeSupplierProposal = {
    id_negotiation: string,
    id_supplier: string,
    bp_code: string | null | number,
    company_name: string,
    proposal_total_amount: number | string | null,
    proposal_revision_no?: number | string | null,
    proposal_status?: string | null,
    proposal_last_updated?: string | null,
    is_final?: boolean,
}

export type TypeFinalReview = {
    final_view_at: string | null,
    data : TypeSupplierProposal[]
}

const fetchSupplierProposals = async (offersId: string) : Promise<TypeFinalReview> => {
    const token = localStorage.getItem("access_token")
    try {
        const response = await fetch(API_List_Supplier_Proposal_Admin() + offersId, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (response.ok && data.status === true) {
            return data
        } else {
            return data.error || "Error"
        }
    } catch (error : any) {
        console.error("Error fetching supplier proposal:", error)
        return error.message || "Error"
    }
}

export default fetchSupplierProposals;