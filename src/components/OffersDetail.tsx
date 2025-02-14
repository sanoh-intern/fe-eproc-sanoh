"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiDownload, FiCalendar, FiClock, FiTarget, FiUserCheck, FiFlag, FiAward } from "react-icons/fi"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Button from "./Forms/Button"

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
    winningSupplier?: string
}

// Simulated API function
const fetchOfferDetails = async (id: string): Promise<OfferDetails> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
        id,
        projectName: "Smart City Infrastructure Development",
        createdDate: "2023-06-15",
        closeRegistrationDate: "2023-07-15",
        overview:
        "This project aims to develop a comprehensive smart city infrastructure, including IoT sensors, data analytics platforms, and integrated city management systems. The goal is to enhance urban living through technology-driven solutions for traffic management, waste management, and energy efficiency.",
        attachmentUrl: "/path/to/project-details.pdf",
        offerType: "Public",  
        registrationStatus: "Close",
        offerStatus: "Supplier Selected",
        winningSupplier: "Global Tech Ltd" 
    }
    }

    const OffersDetails: React.FC = () => {
    const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null)


    useEffect(() => {
        const loadOfferDetails = async () => {
            try {
                const details = await fetchOfferDetails("1")
                setOfferDetails(details)
            } catch (error) {
                console.error("Failed to fetch offer details:", error)
                toast.error("Failed to load offer details")
            }
        }

        loadOfferDetails()
    }, [])


    if (!offerDetails) {
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
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{offerDetails.projectName}</h1>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiCalendar className="text-secondary mr-2" />
                        <span className="text-gray-600">Created: {offerDetails.createdDate}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiClock className="text-secondary mr-2" />
                        <span className="text-gray-600">Close Registration: {offerDetails.closeRegistrationDate}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiTarget className="text-secondary mr-2" />
                        <span className="text-gray-600">Offer Type: {offerDetails.offerType}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiUserCheck className="text-secondary mr-2" />
                        <span className="text-gray-600">Registration Status: {offerDetails.registrationStatus}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                        <FiFlag className="text-secondary mr-2" />
                        <span className="text-gray-600">Offer Status: {offerDetails.offerStatus}</span>
                    </div>
                    {offerDetails.offerStatus === "Supplier Selected" && offerDetails.winningSupplier && (
                        <div className="w-full md:w-1/2 flex items-center mb-2">
                            <FiAward className="text-secondary mr-2" />
                            <span className="text-gray-600">Winning Supplier: {offerDetails.winningSupplier}</span>
                        </div>
                    )}
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Overview</h2>
                    <p className="text-gray-600">{offerDetails.overview}</p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Details</h2>
                    <Button
                        onClick={() => window.open(offerDetails.attachmentUrl, "_blank")}
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

