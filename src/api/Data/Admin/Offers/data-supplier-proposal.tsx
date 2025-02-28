export type TypeSupplierDataOffers = {
    bpcode: string
    companyName: string
    registrationDate: string
}

interface SupplierDataOffers {
    bpcode: string
    companyName: string
    registrationDate: string
}

const fetchSupplierDataOffers = async (negotiationId: string): Promise<SupplierDataOffers[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 1 }, (_, i) => ({
        bpcode: `BP${2000 + i}`,
        companyName: `Supplier ${i + 1}`,
        registrationDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
        )
        .toISOString()
        .split("T")[0],
    }))
}

export default fetchSupplierDataOffers;