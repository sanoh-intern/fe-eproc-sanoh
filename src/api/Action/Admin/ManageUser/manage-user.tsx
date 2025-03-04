import { toast } from 'react-toastify';
import { API_List_User_Admin, API_Update_Status_Admin } from '../../../route-api';

export type TypeUser = {
    UserID: string;
    NPWP: string;
    Email: string;
    SupplierCode: string;
    VerificationStatus : string;
    CompanyName: string;
    Role: string;
    Status: string;
}
export async function fetchUserListAdmin(): Promise<TypeUser[]> {
    const token = localStorage.getItem('access_token');
    try {
        const response = await fetch(API_List_User_Admin(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        // Map the API data to your expected user object structure
        const users = result.data.map((user: any) => ({
            UserID: user.id,
            NPWP: user.id_tax,
            SupplierCode: user.bp_code,
            VerificationStatus : user.verification_status,
            Email: user.email,
            CompanyName: user.company_name,
            Role: user.role,
            Status: user.account_status,
        }));
        console.log('User list:', users);

        return users;
    } catch (error) {
        console.error('Error fetching user list:', error);
        toast.error(`Fetch error: ${error}`);
        throw error;
    }
}

export async function updateUserStatusAdmin(userId: string, status: string, companyName: string) {
    const token = localStorage.getItem('access_token');
    try {
        const response = await toast.promise(
        fetch(`${API_Update_Status_Admin()}${userId}`, {
            method: 'PATCH',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        }),
        {
            pending: {
                render: `Updating status for "${companyName}"...`,
                autoClose: 3000,
            },
            success: {
                render: `Status for "${companyName}" Successfully Updated to ${status === "1" ? 'Active' : 'Deactive'}`,
                autoClose: 3000,
            },
            error: {
                render({ data }) {
                    return `Failed to update status for "${companyName}": ${data}`;
            },
                autoClose: 3000,
            },
        }
        );

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user status:', error);
        toast.error(`Error updating status: ${error}`);
        throw error;
    }
}