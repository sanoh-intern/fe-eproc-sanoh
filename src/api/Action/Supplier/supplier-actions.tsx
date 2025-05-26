import { API_Mini_Profile_Supplier } from '../../route-api';

// Define the type for mini profile data
export interface MiniProfileData {
    id: string;
    company_name: string;
    tax_id: string | null;
    company_description: string | null;
    business_field: string | null;
    sub_business_field: string | null;
    profile_verified_at: string | null;
}

// Get mini profile for supplier dashboard
export const getMiniProfile = async (): Promise<{
    success: boolean;
    data?: MiniProfileData;
    message: string;
}> => {
    try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
            return {
                success: false,
                message: 'No access token found. Please login again.'
            };
        }

        const response = await fetch(API_Mini_Profile_Supplier(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                data: result.data,
                message: result.message || 'Mini profile loaded successfully.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to load mini profile.'
            };
        }
    } catch (error) {
        console.error('Error fetching mini profile:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};
