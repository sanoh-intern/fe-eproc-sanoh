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
  const offerId = window.location.hash.split('/').pop();

  const loadData = async () => {
    console.log("offerId", offerId)
    try {
        const [details] = await Promise.all([
          fetchOfferDetails(offerId!),
        ])
        setOfferDetails(details)
    } catch (error) {
        console.error("Failed to fetch data:", error)
      toast.error("Failed to load negotiation details")
    } 
  }
  useEffect(() => {
    loadData()
    console.log("offerId", offerDetails )
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

