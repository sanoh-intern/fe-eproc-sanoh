export const postNegotiation = async (formData: any) => {
    try {
        const response = await fetch("/api/negotiations", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error updating offers:", error)
        throw error
    }
}