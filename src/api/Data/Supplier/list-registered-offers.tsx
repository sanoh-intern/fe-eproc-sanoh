import { toast } from "react-toastify"
import { API_Project_Followed_Supplier } from "../../route-api"

export type TypeOfferFollowed = {
  id: string
  project_name: string
  project_type: string
  project_status: string
  project_winner?: string | null
  register_date: string
  proposal_last_amount: string | number | null
  proposal_revision_no: string
  proposal_last_update: string
  porposal_status: string
  is_final: boolean
}


// Simulated API function
export const fetchFollowedOffers = async () => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch(API_Project_Followed_Supplier(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status) {
        return data.data;
    } else {
        if (data.error) {
            const errors = Object.values(data.error).flat().join(" ");
            toast.error(errors);
        } else {
            toast.error(data.message);
        }
        return false;
    }
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}