export type TypeSupplierProposal = {
    last_viewed: string | null,
    data: {
        id_negotiation: string,
        id_supplier: string,
        bp_code: string | null | number,
        company_name: string,
        proposal_last_amount: number | string | null,
        proposal_revision_no?: number | string | null,
        proposal_status?: string | null,
        proposal_last_updated?: string | null,
        is_final?: boolean,
    }[]
}

const fetchSupplierProposals = async (offersId: string) : Promise<TypeSupplierProposal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 10 }, (_) => ({
        last_viewed: null,
        data: Array.from({ length: 10 }, (_, i) => ({
            id_negotiation: (i + 1).toString(),
            id_supplier: (i + 1).toString(),
            bp_code: `bpcode-${i + 1}`,
            company_name: `Company ${i + 1}`,
            proposal_last_amount: Math.floor(Math.random() * 1000000),
            proposal_revision_no: Math.floor(Math.random() * 10),
            proposal_status: Math.random() > 0.8 ? "Accepted" : Math.random() > 0.6 ? "Declined" : Math.random() > 0.4 ? "On Review" : Math.random() > 0.2 ? "On Review Final" : "Not Uploaded",
            proposal_last_updated: new Date(
                Date.now() - Math.floor(Math.random() * 10000000000)
            )
                .toISOString()
                .split("T")[0],
            is_final: Math.random() > 0.5 ? true : false,
        })).map(item => ({ ...item, id: item.id_negotiation.toString() })),
    }))
}

export default fetchSupplierProposals;