import { toast } from "react-toastify";
import { API_Last_Seen_Admin } from "../../../route-api";

interface UpdateLastViewedProps {
    offersId: string;
}

export const updateLastViewed = async ({ offersId }: UpdateLastViewedProps) => {
    const token = localStorage.getItem("access_token");
    try {
        const response = await fetch(API_Last_Seen_Admin() + offersId, {
            method: "PATCH",
            headers: { 
                Authorization : `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.status === true) {
            toast.success(data.message || "Success")
            return
        } else {
            toast.error(data.message || "Error")
            return 
        }
    } catch (error) {
        console.error("Server error plase try again later:", error)
        toast.error("Server error plase try again later")
        return
    }
};