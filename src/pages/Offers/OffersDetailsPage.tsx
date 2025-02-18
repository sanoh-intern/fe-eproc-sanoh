"use client"

import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import OffersDetails from "../../components/OffersDetail"
import { useEffect, useState } from "react"
import Loader from "../../common/Loader"
import fetchOfferDetails, { TypeOfferDetails } from "../../api/Data/offers-detail"

const OffersDetailsPage: React.FC = () => {
  const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
          const [details] = await Promise.all([
            fetchOfferDetails("1"),
          ])
          setOfferDetails(details)
      } catch (error) {
          console.error("Failed to fetch data:", error)
        toast.error("Failed to load negotiation details")
      } 
    }

    loadData()
  }, [])

  if (!offerDetails) return <Loader />

  return (
    <>
      <Breadcrumb 
        isSubMenu={true} 
        pageName="Offers Details" 
        parentMenu={{name: "Offers Available", link: "/offers/available"}}
      />
      <ToastContainer position="top-right" />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 md:p-4 lg:p-6">
          <OffersDetails offerDetails={offerDetails} />
        </div>
      </div>
    </>
  )
}

export default OffersDetailsPage

