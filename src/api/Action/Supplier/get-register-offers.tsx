export const getRegisterOffers = async (offersId: string) => {
    try {
        const response = await fetch(`/api/offers/update/${offersId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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