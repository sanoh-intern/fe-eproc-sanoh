"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"
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
  }
}

const OffersDetails: React.FC = () => {
  const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)

  useEffect(() => {
    const loadOfferDetails = async () => {
      try {
        const details = await fetchOfferDetails("1") // In a real app, you'd get the ID from the route params
        setOfferDetails(details)
      } catch (error) {
        console.error("Failed to fetch offer details:", error)
        toast.error("Failed to load offer details")
      } finally {
        setIsLoading(false)
      }
    }

    loadOfferDetails()
  }, [])

  const handleRegister = () => {
    setIsModalOpen(true)
  }

  const handleAgreementSubmit = async () => {
    if (agreementChecked) {
      // Simulated API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsModalOpen(false)
      setAgreementChecked(false)
      toast.success("Successfully registered for the project")
    }
  }

  if (!offerDetails) {
    return <Loader />
  }

    return (
        <>
            <Breadcrumb isSubMenu={true} pageName="Offers Details" parentMenu={{name: "Offers Available", link: "/offers/available"}} />
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
                    <Button
                        onClick={handleRegister}
                        className="w-full px-6 py-3 "
                        title="Register for This Project"
                    />
                </div>
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    MoU Agreement
                                </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                        By agreeing to this MoU, you confirm that you will participate in the entire procurement offer
                                        process for {offerDetails.projectName} with full commitment and responsibility.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={agreementChecked}
                                                onChange={(e) => setAgreementChecked(e.target.checked)}
                                            />
                                            <span className="ml-2">I agree to the terms of the MoU</span>
                                        </label>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleAgreementSubmit}
                                            disabled={!agreementChecked}
                                            >
                                            Submit Agreement
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default OffersDetails

