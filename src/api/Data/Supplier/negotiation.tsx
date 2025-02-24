export type TypeNegotiationSupplier = {
    id: string
    proposal_submit_date: string
    poposal_total_amount: number | null
    proposal_revision_no: number | null
    proposal_status: string | null
    isFinal: boolean
}
interface NegotiationSupplier {
    id: string
    proposal_submit_date: string
    poposal_total_amount: number | null
    proposal_revision_no: number | null
    proposal_status: string | null
    isFinal: boolean
}

const fetchNegotiationSupplier = async (offerid: string): Promise<NegotiationSupplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
        {
            id: "nego-1",
            proposal_submit_date: "2024-01-20",
            poposal_total_amount: 600000,
            proposal_revision_no: 1,
            proposal_status: "On Review",
            isFinal: false,
        },
        {
            id: "nego-2",
            proposal_submit_date: "2024-01-25",
            poposal_total_amount: 650000,
            proposal_revision_no: 2,
            proposal_status: "Revision",
            isFinal: false,
        },
        {
            id: "nego-3",
            proposal_submit_date: "2024-01-30",
            poposal_total_amount: 700000,
            proposal_revision_no: 3,
            proposal_status: "Revision",
            isFinal: true,
        },
    ]
}

export default fetchNegotiationSupplier;