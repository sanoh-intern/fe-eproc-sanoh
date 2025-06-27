import { API_List_Request_Verification_Admin, API_Approve_Verification_Admin } from "../../route-api"

export type TypeVerificationRequest = {
    verification_id: number
    user_id: number
    tax_id: string
    comapany_name: string
    request_date: string
}

export type TypeApprovalRequest = {
    status: "Accepted" | "Declined"
    bp_code?: string
    message?: string
}

export const fetchVerificationRequests = async (): Promise<TypeVerificationRequest[]> => {
    try {
        const response = await fetch(API_List_Request_Verification_Admin(), {
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
            return result.data as TypeVerificationRequest[];
        } else {
            throw new Error(result.message || 'Failed to fetch verification requests');
        }
    } catch (error) {
        console.error('Error fetching verification requests:', error);
        throw error;
    }
}

export const approveVerification = async (userId: number, approvalData: TypeApprovalRequest): Promise<void> => {
    try {
        const response = await fetch(API_Approve_Verification_Admin() + userId, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(approvalData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.status) {
            throw new Error(result.message || 'Failed to process verification');
        }
    } catch (error) {
        console.error('Error processing verification:', error);
        throw error;
    }
}

export default fetchVerificationRequests;
