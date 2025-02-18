export type TypeListSupplierRegistered = {
    id: string
    bpcode: string
    companyName: string
    registrationDate: string
}

interface ListSupplierRegistered {
    id: string
    bpcode: string
    companyName: string
    registrationDate: string
}

const fetchListSupplierRegistered = async (offersId: string): Promise<ListSupplierRegistered[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 8 }, (_, i) => ({
        id: `id-${i + 1}`,
        bpcode: `BP${2000 + i}`,
        companyName: `Supplier ${i + 1}`,
        registrationDate: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        )
            .toISOString()
            .split("T")[0],
    }))
}

export default fetchListSupplierRegistered;