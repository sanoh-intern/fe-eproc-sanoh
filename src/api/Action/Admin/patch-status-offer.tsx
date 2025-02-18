interface PatchStatusOfferProps {
    offersId: string;
}

export const PatchStatusOffer = async ({ offersId }: PatchStatusOfferProps ) => {
    try {
        const response = await fetch("/api/proposals/last-viewed", {
            method: "PATCH",
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