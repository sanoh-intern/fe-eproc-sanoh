export const postCreateOffers = async (payload: any) => {
    try {
        const response = await fetch("/api/offers/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating offers:", error);
        throw error;
    }
};