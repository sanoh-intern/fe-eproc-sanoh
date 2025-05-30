import { API_Stream_Document } from "../route-api";

export const streamFile = async (filePath: string): Promise<string> => {
    try {
        console.log('Streaming file:', filePath);
        console.log('API endpoint:', API_Stream_Document());
        
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

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response content-type:', response.headers.get('content-type'));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }        // Return the blob URL for viewing/downloading
        const blob = await response.blob();
        console.log('Blob size:', blob.size);
        console.log('Blob type:', blob.type);
        
        // Test if blob has content
        if (blob.size === 0) {
            console.warn('Warning: Blob is empty (size 0)');
            throw new Error('Received empty file');
        }
        
        // For PDFs, ensure the correct MIME type
        let finalBlob = blob;
        if (blob.type !== 'application/pdf' && (blob.type === '' || blob.type === 'application/octet-stream')) {
            console.log('Converting blob to PDF MIME type');
            finalBlob = new Blob([blob], { type: 'application/pdf' });
        }
        
        // Check if it's actually a PDF or expected file type
        if (finalBlob.type && !finalBlob.type.includes('pdf') && !finalBlob.type.includes('image') && !finalBlob.type.includes('application')) {
            console.warn('Warning: Unexpected blob type:', finalBlob.type);
        }
        
        const url = URL.createObjectURL(finalBlob);
        console.log('Created blob URL:', url);
        
        // Test the blob URL by trying to access it
        try {
            const testResponse = await fetch(url);
            console.log('Blob URL test response status:', testResponse.status);
        } catch (testError) {
            console.error('Error testing blob URL:', testError);
        }
        
        return url;
    } catch (error) {
        console.error('Error streaming file:', error);
        throw error;
    }
};
