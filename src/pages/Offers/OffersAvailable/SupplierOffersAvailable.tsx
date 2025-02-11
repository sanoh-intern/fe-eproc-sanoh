"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DialogPanel, DialogTitle, TransitionChild, Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SearchBar from "../../../components/Table/SearchBar"
import Button from "../../../components/Forms/Button"
import Pagination from "../../../components/Table/Pagination"

interface Offer {
    id: string
    projectName: string
    createdDate: string
    offerType: "Invited" | "Public"
    registrationDueDate: string
    status: "Open" | "Closed"
}

// Simulated API functions
const fetchInvitedOffers = async (): Promise<Offer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 25 }, (_, i) => ({
        id: `invited-${i + 1}`,
        projectName: `Invited Project ${i + 1}`,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        offerType: "Invited",
        registrationDueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        status: Math.random() > 0.3 ? "Open" : "Closed",
    }))
}

const fetchPublicOffers = async (): Promise<Offer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 25 }, (_, i) => ({
        id: `public-${i + 1}`,
        projectName: `Public Project ${i + 1}`,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        offerType: "Public",
        registrationDueDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
        status: Math.random() > 0.3 ? "Open" : "Closed",
    }))
}

const submitAgreement = async (offerId: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true, message: "Agreement submitted successfully" }
}

const SupplierOffersAvailable: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
    const [agreementChecked, setAgreementChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })
    const [searchQuery, setSearchQuery] = useState("")
    const [invitedOffers, setInvitedOffers] = useState<Offer[]>([])
    const [publicOffers, setPublicOffers] = useState<Offer[]>([])

    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true)
            const [invited, public_] = await Promise.all([fetchInvitedOffers(), fetchPublicOffers()])
            setInvitedOffers(invited)
            setPublicOffers(public_)
            setLoading(false)
        }

        fetchOffers()
    }, [])

    const handleSort = (key: string) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const filteredData = (selectedTab === 0 ? invitedOffers : publicOffers)
        .filter((offer) => {
            return offer.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        })
        .sort((a, b) => {
            if (sortConfig.key === "status") {
                return sortConfig.direction === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
            }
            return 0
        })

    const handleRegister = (offer: Offer) => {
        setSelectedOffer(offer)
        setIsModalOpen(true)
    }

    const handleAgreementSubmit = async () => {
        if (agreementChecked && selectedOffer) {
            try {
                const result = await submitAgreement(selectedOffer.id)
                if (result.success) {
                    toast.success(result.message)
                    setIsModalOpen(false)
                    setAgreementChecked(false)
                } else {
                    toast.error(result.message)
                }
            } catch (error) {
                toast.error("An error occurred while submitting the agreement")
            }
        }
    }

    return (
        <>
            <ToastContainer position="top-right" />
            <Breadcrumb pageName="Available Offers" />
            <div className="bg-white">
                <div className="p-4 md:p-4 lg:p-6 space-y-6">
                {/* Tabs */}
                <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <TabList className="flex space-x-1 rounded-xl bg-primarylight/70 p-1">
                        <Tab
                            className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary
                            ${selected ? "bg-primary text-white shadow" : "text-primary hover:bg-secondary hover:text-white bg-white"}`
                            }
                        >
                            Invited Offers
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary
                                ${selected ? "bg-primary text-white shadow" : "text-primary hover:bg-secondary hover:text-white bg-white"}`
                                }
                        >
                            Public Offers
                        </Tab>
                    </TabList>
                    <TabPanels>
                        {[0, 1].map((tabIndex) => (
                            <TabPanel key={tabIndex} className="space-y-4">
                            {/* Header Section */}
                                <div className="mt-4 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
                                        <div className="w-full">
                                            <SearchBar placeholder="Search projects..." onSearchChange={setSearchQuery} />
                                        </div>
                                    </div>
                                </div>
                                {/* Table content */}
                                <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Project Name
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Created Date
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Offer Type
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Registration Due Date
                                                    </th>
                                                    <th
                                                        className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                                                        onClick={() => handleSort("status")}
                                                    >
                                                        <span className="flex items-center justify-center">
                                                            {sortConfig.key === "status" ? (
                                                            sortConfig.direction === "asc" ? (
                                                                <FaSortUp className="mr-1" />
                                                            ) : (
                                                                <FaSortDown className="mr-1" />
                                                            )
                                                            ) : (
                                                            <FaSortDown className="opacity-50 mr-1" />
                                                            )}
                                                            Status
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                            {loading ? (
                                                Array.from({ length: rowsPerPage }).map((_, index) => (
                                                <tr key={index} className="animate-pulse">
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded"></div>
                                                    </td>
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded"></div>
                                                    </td>
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded"></div>
                                                    </td>
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded"></div>
                                                    </td>
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded"></div>
                                                    </td>
                                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                                        <div className="w-20 h-8 mx-auto bg-gray-200 rounded"></div>
                                                    </td>
                                                </tr>
                                                ))
                                            ) : filteredData.length > 0 ? (
                                                filteredData
                                                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                                                .map((offer, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-3 py-3 text-center whitespace-nowrap underline font-medium">
                                                            <Link to={`/offers/details/${offer.id}`} className="text-blue-600 hover:underline">
                                                            {offer.projectName}
                                                            </Link>
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">{offer.createdDate}</td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">{offer.offerType}</td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            {offer.registrationDueDate}
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            <span
                                                            className={`px-2 py-1 rounded ${
                                                                offer.status === "Open"
                                                                ? "bg-green-200 text-green-800"
                                                                : "bg-red-200 text-red-800"
                                                            }`}
                                                            >
                                                            {offer.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            <Button
                                                            title="Register"
                                                            onClick={() => handleRegister(offer)}
                                                            disabled={offer.status === "Closed"}
                                                            
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                                                        No offers available
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>

                <Pagination
                    totalRows={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
                </div>
            </div>
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                <Transition
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    show={isModalOpen}
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition>

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
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-primary hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

export default SupplierOffersAvailable

