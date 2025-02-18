interface DeleteOffersProps {
    offersId: string;
}

export const deleteOffers = async ({ offersId }: DeleteOffersProps ) => {
    try {
        const response = await fetch("/api/proposals/last-viewed", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offersId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to update last viewed:", error);
        throw error;
    }
};