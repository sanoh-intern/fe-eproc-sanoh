export type TypeListSupplierRegistered = {
    id: string
    bp_code: string
    company_name: string
    registration_date: string
}


const fetchListSupplierRegistered = async (offersId: string) : Promise<TypeListSupplierRegistered[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 8 }, (_, i) => ({
        id: `id-${i + 1}`,
        bp_code: `BP${2000 + i}`,
        company_name: `Supplier ${i + 1}`,
        registration_date: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        )
            .toISOString()
            .split("T")[0],
    }))
}

export default fetchListSupplierRegistered;