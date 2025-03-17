import { toast } from 'react-toastify';
import { API_Create_User_Admin, API_Edit_User_Admin, API_Update_User_Admin } from '../../../route-api';

export async function createUserAdmin(payload: any, resetForm: () => void) {
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

export async function editUserAdmin(payload: any, userId: string, navigate: any) {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_Update_User_Admin()}${userId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok && result.status) {
            toast.success("User successfully updated!");
            setTimeout(() => {
                navigate("/manage-user");
            }, 1000);
        } else {
            toast.error(result.message || "Failed to update user");
        }
    } catch (error) {
        console.error("Error during user update:", error);
        toast.error("An error occurred while updating the user.");
    }
}

export const fetchUserDataAdmin = async (userId: string) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(`${API_Edit_User_Admin()}${userId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }

        const dataResponse = await response.json();
        return dataResponse.data;

    } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(`Error fetching user data: ${error.message}`);
        return null;
    }
};