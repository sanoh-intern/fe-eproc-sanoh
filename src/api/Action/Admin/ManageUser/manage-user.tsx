import { toast } from 'react-toastify';
import { API_List_User_Admin, API_Update_Status_Admin } from '../../../route-api';
import { getRoleName } from '../../../../authentication/Role';

export async function fetchUserListAdmin() {
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
            UserID: user.user_id,
            SupplierCode: user.bp_code,
            Username: user.username,
            Name: user.name,
            Role: getRoleName(user.role),
            RoleCode: user.role,
            Status: user.status === 1 ? 'Active' : 'Deactive',
        }));

        return users;
    } catch (error) {
        console.error('Error fetching user list:', error);
        toast.error(`Fetch error: ${error}`);
        throw error;
    }
}

export async function updateUserStatusAdmin(userId: string, status: number, username: string) {
    const token = localStorage.getItem('access_token');
    try {
        const response = await toast.promise(
        fetch(`${API_Update_Status_Admin()}${userId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status.toString() }),
        }),
        {
            pending: {
                render: `Updating status for "${username}"...`,
                autoClose: 3000,
            },
            success: {
                render: `Status for "${username}" Successfully Updated to ${status === 1 ? 'Active' : 'Deactive'}`,
                autoClose: 3000,
            },
            error: {
                render({ data }) {
                    return `Failed to update status for "${username}": ${data}`;
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