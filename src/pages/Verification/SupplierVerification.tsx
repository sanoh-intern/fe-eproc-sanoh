"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tab } from "@headlessui/react"
import { FaSearch } from "react-icons/fa"
import Link from "next/link"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

interface Offer {
  id: string
  projectName: string
  createdDate: string
  offerType: "Invited" | "Public"
  registrationDueDate: string
  status: "Open" | "Closed"
}

const SupplierOffersAvailable: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [agreementChecked, setAgreementChecked] = useState(false)

  // Dummy data for offers
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    // Simulating API call to fetch offers
    const fetchOffers = async () => {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const dummyOffers: Offer[] = Array.from({ length: 50 }, (_, i) => ({
        id: `offer-${i + 1}`,
        projectName: `Project ${i + 1}`,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        offerType: Math.random() > 0.5 ? "Invited" : "Public",
        registrationDueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        status: Math.random() > 0.3 ? "Open" : "Closed",
      }))
      setOffers(dummyOffers)
    }

    fetchOffers()
  }, [])

  const filteredOffers = offers.filter(
    (offer) =>
      (selectedTab === 0 ? offer.offerType === "Invited" : offer.offerType === "Public") &&
      offer.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pageCount = Math.ceil(filteredOffers.length / itemsPerPage)
  const paginatedOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleRegister = (offer: Offer) => {
    setSelectedOffer(offer)
    setIsModalOpen(true)
  }

  const handleAgreementSubmit = () => {
    if (agreementChecked) {
      // Process the agreement
      console.log("Agreement submitted for offer:", selectedOffer)
      setIsModalOpen(false)
      setAgreementChecked(false)
    }
  }

  return (
    <>
      <Breadcrumb pageName="Available Offers" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                    ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"}`
                  }
                >
                  Invited Offers
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                    ${selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"}`
                  }
                >
                  Public Offers
                </Tab>
              </Tab.List>
            </Tab.Group>

            <div className="mt-4 flex justify-between items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border rounded-md p-1"
                >
                  {[5, 10, 25, 50].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Project Name</th>
                    <th className="py-3 px-4 text-left">Created Date</th>
                    <th className="py-3 px-4 text-left">Offer Type</th>
                    <th className="py-3 px-4 text-left">Registration Due Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOffers.map((offer) => (
                    <tr key={offer.id} className="border-b">
                      <td className="py-3 px-4">
                        <Link href={`/project/${offer.id}`} className="text-blue-600 hover:underline">
                          {offer.projectName}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{offer.createdDate}</td>
                      <td className="py-3 px-4">{offer.offerType}</td>
                      <td className="py-3 px-4">{offer.registrationDueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded ${offer.status === "Open" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                        >
                          {offer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleRegister(offer)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          disabled={offer.status === "Closed"}
                        >
                          Register
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredOffers.length)} of {filteredOffers.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                  disabled={currentPage === pageCount}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    MoU Agreement
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      By agreeing to this MoU, you confirm that you will participate in the entire procurement offer
                      process for {selectedOffer?.projectName}.
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default SupplierOffersAvailable

