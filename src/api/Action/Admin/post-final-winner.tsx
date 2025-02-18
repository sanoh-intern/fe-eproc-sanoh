interface PostFinalWinnerProps {
    negotiationId: string;
}

export const postOffersAccepted = async ({ negotiationId }: PostFinalWinnerProps) => {
    try {
        const response = await fetch('/api/proposals/accept', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ negotiationId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error posting the final winner:', error);
        throw error;
    }
};
export const postOffersDeclined = async ({ negotiationId }: PostFinalWinnerProps) => {
    try {
        const response = await fetch('/api/proposals/declined', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ negotiationId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error posting the final winner:', error);
        throw error;
    }
};