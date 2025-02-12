"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiDownload, FiCalendar, FiClock } from "react-icons/fi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import Button from "../../components/Forms/Button"
import Loader from "../../common/Loader"

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
    return <Loader />
  }

  return (
      <>
          <Breadcrumb 
            isSubMenu={true} 
            pageName="Offers Details" 
            parentMenu={{name: "Offers Available", link: "/offers/available"}}
          />
          <ToastContainer position="top-right" />
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 md:p-4 lg:p-6 space-y-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{offerDetails.projectName}</h1>
                  <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <span className="text-gray-600">Created: {offerDetails.createdDate}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                      <FiClock className="text-gray-500 mr-2" />
                      <span className="text-gray-600">Close Registration: {offerDetails.closeRegistrationDate}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                      <span className="text-gray-600">Offer Type: {offerDetails.offerType}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                      <span className="text-gray-600">Registration Status: {offerDetails.registrationStatus}</span>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center mb-2">
                      <span className="text-gray-600">Offer Status: {offerDetails.offerStatus}</span>
                    </div>
                    {offerDetails.offerStatus === "Supplier Selected" && offerDetails.winningSupplier && (
                      <div className="w-full md:w-1/2 flex items-center mb-2">
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
          </div>

          
      </>
  )
}

export default OffersDetails

