export type TypeSupplierProposal = {
    lastViewed: string | null,
    data: {
        id: string,
        bpcode: string,
        companyName: string,
        totalAmount: number,
        revisionNo: number,
        lastStatus?: string | null,
        lastUploadAt: string,
        isFinal?: boolean,
    }[]
}

interface SupplierProposal {
    lastViewed: string | null,
    data: {
        id: string,
        bpcode: string,
        companyName: string,
        totalAmount: number,
        revisionNo: number,
        lastStatus?: string | null,
        lastUploadAt: string,
        isFinal?: boolean,
    }[]
}

const fetchSupplierProposals = async (offersId: string): Promise<SupplierProposal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 10 }, (_) => ({
        lastViewed: null,
        data: Array.from({ length: 10 }, (_, i) => ({
            id: `id-${i + 1}`,
            bpcode: `bpcode-${i + 1}`,
            companyName: `Company ${i + 1}`,
            totalAmount: Math.floor(Math.random() * 1000000),
            revisionNo: Math.floor(Math.random() * 10),
            lastStatus: Math.random() > 0.8 ? "Accepted" : Math.random() > 0.6 ? "Declined" : Math.random() > 0.4 ? "On Review" : Math.random() > 0.2 ? "On Review Final" : "Not Uploaded",
            lastUploadAt: new Date(
                Date.now() - Math.floor(Math.random() * 10000000000)
            )
            .toISOString()
            .split("T")[0],
            isFinal: Math.random() > 0.5 ? true : false,
        })),
    }))
}

export default fetchSupplierProposals;