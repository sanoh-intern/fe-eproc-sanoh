export type TypeNegotiationData = {
    id: string
    submitDate: string
    totalAmount: number
    revisionNo: number
    status: string | null
    isFinal?: boolean
}
interface NegotiationData {
    id: string
    submitDate: string
    totalAmount: number
    revisionNo: number
    status: string | null
    isFinal?: boolean
    
}

const fetchNegotiationData = async (negotiationId: string): Promise<NegotiationData []> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return [
        
        {
            id: "prop-1",
            submitDate: "2024-01-10 10:00",
            totalAmount: 500000,
            revisionNo: 1,
            status: null,
            isFinal: false
        },
        {
            id: "prop-2",
            submitDate: "2024-01-15 14:30",
            totalAmount: 550000,
            revisionNo: 2,
            status: "Accepted",
            isFinal: true
        },
    ]
}

export default fetchNegotiationData;