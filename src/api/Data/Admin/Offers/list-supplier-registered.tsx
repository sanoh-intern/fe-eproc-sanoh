import { API_List_Supplier_Registered_Admin } from "../../../route-api"

export type TypeListSupplierRegistered = {
    id_user: string
    bp_code: string
    company_name: string
    registered_at: string
}

const fetchListSupplierRegistered = async (offersId: string) : Promise<TypeListSupplierRegistered> => {
    const token = localStorage.getItem("access_token")
    try {
        const response = await fetch(API_List_Supplier_Registered_Admin() + offersId, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (response.ok && data.status === true) {
            return data.data
        } else {
            return data.error || "Error"
            
        }
    } catch (error : any) {
        console.error("Error fetching supplier registered:", error)
        return error.message || "Error"
    }
}

export default fetchListSupplierRegistered;