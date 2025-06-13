import { 
    API_Register, 
    API_Resend_Password,
    API_STEP1_OTP_Mail_Reset_Password,
    API_STEP2_Verify_OTP_Reset_Password,
    API_STEP3_Reset_Password, 
} from '../../route-api';

// Register new user
export const registerUser = async (payload: {
    tax_id: string;
    company_name: string;
    email: string;
}) => {
    try {
        const response = await fetch(API_Register(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                data: result.data,
                message: result.message || 'Registration successful! Please check your email for your password.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Registration failed. Please try again.',
                errors: result.error || result.errors
            };
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return {
            success: false,
            message: 'Network error. Please try again.',
            errors: null
        };
    }
};

// Resend password after registration
export const resendPassword = async (payload: {
    email: string;
}) => {
    try {
        const response = await fetch(API_Resend_Password(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                message: result.message || 'Password resent. Please check your email.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to resend password. Please try again.'
            };
        }
    } catch (error) {
        console.error('Error during password resend:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};

// Send OTP for password reset (forgot password)
export const sendResetPasswordOTP = async (payload: {
    email: string;
}) => {
    try {
        const response = await fetch(API_STEP1_OTP_Mail_Reset_Password(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                message: result.message || 'Verification code sent to your email.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to send verification code. Please try again.'
            };
        }
    } catch (error) {
        console.error('Error during OTP send:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};

// Verify OTP for password reset
export const verifyResetOTP = async (payload: {
    token: string;
    email: string;
}) => {
    try {
        const response = await fetch(API_STEP2_Verify_OTP_Reset_Password(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                message: result.message || 'Verification code confirmed.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Invalid verification code. Please try again.'
            };
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};

// Reset password with verified OTP
export const resetPassword = async (payload: {
    token: string;
    new_password: string;
}) => {
    try {
        const response = await fetch(API_STEP3_Reset_Password(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status) {
            return {
                success: true,
                message: result.message || 'Password reset successfully. You can now login with your new password.'
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to reset password. Please try again.'
            };
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
};
