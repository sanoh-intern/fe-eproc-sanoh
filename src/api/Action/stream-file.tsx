import { API_Stream_Document } from "../route-api";

export const streamFile = async (filePath: string): Promise<string> => {
    try {
        const response = await fetch(API_Stream_Document(), {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: filePath
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob directly from the response
        const blob = await response.blob();
        
        // Create and return the blob URL
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('Error streaming file:', error);
        throw error;
    }
};
