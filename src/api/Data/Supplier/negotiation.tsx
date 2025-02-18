export type TypeNegotiationSupplier = {
    id: string
    submitDate: string
    totalAmount: number | null
    revisionNo: number | null
    status: string | null
    final: boolean 
}
interface NegotiationSupplier {
    id: string
    submitDate: string
    totalAmount: number | null
    revisionNo: number | null
    status: string | null
    final: boolean
}

const fetchNegotiationSupplier = async (offerid: string): Promise<NegotiationSupplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
        {
            id: "nego-1",
            submitDate: "2024-01-20",
            totalAmount: 600000,
            revisionNo: 1,
            status: "On Review",
            final: false,
        },
        {
            id: "nego-2",
            submitDate: "2024-01-25",
            totalAmount: 650000,
            revisionNo: 2,
            status: "Revision",
            final: false,
        },
        {
            id: "nego-3",
            submitDate: "2024-01-30",
            totalAmount: 700000,
            revisionNo: 3,
            status: "Revision",
            final: true,
        },
    ]
}

export default fetchNegotiationSupplier;