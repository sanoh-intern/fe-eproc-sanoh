import { API_List_Company_Admin } from "../../route-api"

export type TypeCompanyListAdmin = {
    id: number
    user_id: number
    supplier_name: string
    bp_code: string | null
    verification_status: "verified" | "not_verified" | "profile_updated" | "complete_profile" | "under_verification"
}

export const fetchCompanyListAdmin = async (): Promise<TypeCompanyListAdmin[]> => {
    try {
        const response = await fetch(API_List_Company_Admin(), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status && result.data) {
            return result.data as TypeCompanyListAdmin[];
        } else {
            throw new Error(result.message || 'Failed to fetch company list');
        }
    } catch (error) {
        console.error('Error fetching company list:', error);
        throw error;
    }
}

export default fetchCompanyListAdmin;
