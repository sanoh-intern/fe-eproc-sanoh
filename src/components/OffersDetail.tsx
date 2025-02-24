"use client"

import type React from "react"
import { FiDownload, FiCalendar, FiClock, FiTarget, FiUserCheck, FiFlag, FiAward } from "react-icons/fi"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Button from "./Forms/Button"

interface OffersDetailsProps {
    offerDetails: OfferDetails | null;
}

interface OfferDetails {
    project_name: string;
    created_at: string;
    registration_due_at: string;
    project_description: string;
    project_attach: string | null;
    project_type: string;
    registration_status: string;
    project_status: string;
    project_winner?: string | null;
}

const OffersDetails: React.FC<OffersDetailsProps> = ({ offerDetails }) => {

    if (!offerDetails) {
        toast.error("Failed to load offer details")
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex flex-wrap mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-full md:w-1/2 flex items-center mb-2">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </div>
                    ))}
                </div>
                <div className="mb-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="mb-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{offerDetails.project_name}</h1>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiCalendar className="text-secondary mr-2" />
                        <span className="text-gray-600">Created: {offerDetails.created_at}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiClock className="text-secondary mr-2" />
                        <span className="text-gray-600">Close Registration: {offerDetails.registration_due_at}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiTarget className="text-secondary mr-2" />
                        <span className="text-gray-600">Offer Type: {offerDetails.project_type}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiUserCheck className="text-secondary mr-2" />
                        <span className="text-gray-600">Registration Status: {offerDetails.registration_status}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiFlag className="text-secondary mr-2" />
                        <span className="text-gray-600">Offer Status: {offerDetails.project_status}</span>
                    </div>
                    {offerDetails.project_status === "Supplier Selected" && offerDetails.project_winner && (
                        <div className="w-full md:w-1/2 flex items-center mb-2">
                            <FiAward className="text-secondary mr-2" />
                            <span className="text-gray-600">Winning Supplier: {offerDetails.project_winner}</span>
                        </div>
                    )}
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Overview</h2>
                    <p className="text-gray-600">{offerDetails.project_description}</p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Details</h2>
                    <Button
                        onClick={() => offerDetails.project_attach && window.open(offerDetails.project_attach, "_blank")}
                        className=" "
                        title="Download PDF"
                        icon={FiDownload}
                    />
                </div>
            </div>
        </>
    )
}

export default OffersDetails

