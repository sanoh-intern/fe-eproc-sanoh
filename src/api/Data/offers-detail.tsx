export type TypeOfferDetails = {
    id: string;
    projectName: string;
    createdDate: string;
    closeRegistrationDate: string;
    overview: string;
    attachmentUrl: string;
    offerType: string;
    registrationStatus: string;
    offerStatus: string;
    winningSupplier?: string | null
};

interface OfferDetails {
    id: string
    projectName: string
    createdDate: string
    closeRegistrationDate: string
    overview: string
    attachmentUrl: string
    offerType: string
    registrationStatus: string
    offerStatus: string
    winningSupplier?: string | null
  }

const fetchOfferDetails = async (offersId: string): Promise<OfferDetails> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
        id: "id-1",
        projectName: "Smart City Infrastructure Development",
        createdDate: "2023-06-15",
        closeRegistrationDate: "2023-07-15",
        overview:
        "This project aims to develop a comprehensive smart city infrastructure, including IoT sensors, data analytics platforms, and integrated city management systems. The goal is to enhance urban living through technology-driven solutions for traffic management, waste management, and energy efficiency.",
        attachmentUrl: "/path/to/project-details.pdf",
        offerType: "Public",  
        registrationStatus: "Close",
        offerStatus: "Open",
        winningSupplier: null 
    }
}

export default fetchOfferDetails;