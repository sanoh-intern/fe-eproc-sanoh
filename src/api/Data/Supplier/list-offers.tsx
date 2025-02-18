export type TypeOffers = {
    id: string
    projectName: string
    createdDate: string
    offerType: "Invited" | "Public"
    registrationDueDate: string
    status: "Open" | "Closed"
    isRegistered?: boolean
}
interface Offers {
    id: string
    projectName: string
    createdDate: string
    offerType: "Invited" | "Public"
    registrationDueDate: string
    status: "Open" | "Closed"
    isRegistered?: boolean
}

// Simulated API functions
const fetchListOffers = async (): Promise<Offers[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 25 }, (_, i) => ({
        id: `invited-${i + 1}`,
        projectName: `Invited Project ${i + 1}`,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        offerType: "Invited",
        registrationDueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        status: Math.random() > 0.3 ? "Open" : "Closed",
        isRegistered: true,
    }))
}

export default fetchListOffers;