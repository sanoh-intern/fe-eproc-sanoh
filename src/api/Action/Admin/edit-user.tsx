import { toast } from 'react-toastify';
import { API_Create_User_Admin } from '../../route-api';

export async function editUserAdmin(payload: any, resetForm: () => void) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(API_Create_User_Admin(), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            toast.success('User successfully created!');
            resetForm();
        } else {
            const errorMessage = result.error?.email
                ? result.error.email.join(', ')
                : result.message;
            toast.error(`Failed to create user: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error during user creation:', error);
        toast.error('An error occurred while creating the user.');
    }
}