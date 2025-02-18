export type TypeListRegisteredOffer = {
    id: string
    projectName: string
    offerType: "Public" | "Private"
    createdDate: string
    offerStatus: "Open" | "Supplier Selected"
    totalSuppliers: number
    winningSupplier: string | null
}

interface ListRegisteredOffer {
    id: string
    projectName: string
    offerType: "Public" | "Private"
    createdDate: string
    offerStatus: "Open" | "Supplier Selected"
    totalSuppliers: number
    winningSupplier: string | null
}

const fetchListRegisteredOffers = async (): Promise<ListRegisteredOffer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 10 }, (_, i) => ({
        id: `offer-${i + 1}`,
        projectName: `Project ${i + 1}`,
        offerType: Math.random() > 0.5 ? "Public" : "Private",
        createdDate: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        )
        .toISOString()
        .split("T")[0],
        offerStatus: Math.random() > 0.5 ? "Open" : "Supplier Selected",
        totalSuppliers: Math.floor(Math.random() * 50) + 1,
        winningSupplier: Math.random() > 0.7 ? `Supplier ${Math.floor(Math.random() * 100)}` : null,
    }))
}

export default fetchListRegisteredOffers;