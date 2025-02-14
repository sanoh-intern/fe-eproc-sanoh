"use client"

import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import { ToastContainer } from "react-toastify"
import OffersDetails from "../../components/OffersDetail"

const OffersDetailsPage: React.FC = () => {
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
          <OffersDetails />
        </div>
      </div>
    </>
  )
}

export default OffersDetailsPage

