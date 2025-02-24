import { API_Edit_Detail_Offer_Admin } from "../../../route-api";


export type TypeEditOfferDetails = {
    project_name: string;
    registration_due_at: string;
    project_description: string;
    project_attach: string | null;
    project_type: string;
};


// const fetchEditOfferDetails = async (offersId: string) => {
//     const token = localStorage.getItem("access_token");
//     try {
//         const response = await fetch((API_Edit_Detail_Offer_Admin()) + offersId, {
//             method: "GET",
//             headers: { 
//                 Authorization: `Bearer ${token}`
//             },
//         });

//         const data = await response.json();
//         if (!response.ok) {
//             throw new Error(data.message);
//         }

//         if (data.status) {
//             return data.data;
//         }
//     } catch (error) {
//         console.error("Error fetch offers details:", error);
//         throw error;
//     }
// }

const fetchEditOfferDetails = async (offersId: string): Promise<TypeEditOfferDetails> => {
    return Promise.resolve({
        project_name: "Dummy Project",
        registration_due_at: new Date().toISOString(),
        project_description: "This is a dummy description",
        project_attach: "www.google.com",
        project_type: "Public",
        emails: [
            "b6N4o@example.com",
            "2lUyI@example.com"
        ]
    });
};

export default fetchEditOfferDetails;