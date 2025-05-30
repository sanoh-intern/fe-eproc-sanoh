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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Return the blob URL for viewing/downloading
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error streaming file:', error);
        throw error;
    }
};
