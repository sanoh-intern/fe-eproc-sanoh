"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DialogPanel, DialogTitle, TransitionChild, Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SearchBar from "../../../../components/Table/SearchBar"
import Button from "../../../../components/Forms/Button"
import Pagination from "../../../../components/Table/Pagination"
import { fetchPrivateOffers, fetchPublicOffers, TypeOffers } from "../../../../api/Data/Supplier/list-offers"
import { getRegisterOffers } from "../../../../api/Action/Supplier/get-register-offers"

const SupplierOffersAvailable: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOffer, setSelectedOffer] = useState<TypeOffers | null>(null)
    const [agreementChecked, setAgreementChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })
    const [searchQuery, setSearchQuery] = useState("")
    const [invitedOffers, setInvitedOffers] = useState<TypeOffers[]>([])
    const [publicOffers, setPublicOffers] = useState<TypeOffers[]>([])

    useEffect(() => {
        const fetchOffersData = async () => {
            setLoading(true)
            const offersPublic = await fetchPublicOffers();
            const offersPrivate = await fetchPrivateOffers();
            setInvitedOffers(offersPrivate);
            setPublicOffers(offersPublic);
            setLoading(false);
        };

        fetchOffersData();
    }, []);

    const handleSort = (key: string) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const filteredData = (selectedTab === 0 ? invitedOffers : publicOffers)
        .filter((offer) => {
            return offer.project_name.toLowerCase().includes(searchQuery.toLowerCase())
        })
        .sort((a, b) => {
            if (sortConfig.key === "status") {
                return sortConfig.direction === "asc" ? a.registration_status.localeCompare(b.registration_status) : b.registration_status.localeCompare(a.registration_status)
            }
            return 0
        })

    const handleRegister = (offer: TypeOffers) => {
        setSelectedOffer(offer)
        setIsModalOpen(true)
    }

    const handleAgreementSubmit = async () => {
        if (agreementChecked && selectedOffer) {
            try {
                const result = await getRegisterOffers(selectedOffer.id)
                if (result.status === true) {
                    toast.success("Registration submitted successfully")
                    setSelectedOffer(null)
                    setIsModalOpen(false)
                    setAgreementChecked(false)
                    if (selectedTab === 0) {
                        setInvitedOffers((prevOffers) =>
                            prevOffers.map((offer) =>
                                offer.id === selectedOffer.id ? { ...offer, is_regis: true } : offer
                            )
                        );
                    } else {
                        setPublicOffers((prevOffers) =>
                            prevOffers.map((offer) =>
                                offer.id === selectedOffer.id ? { ...offer, is_regis: true } : offer
                            )
                        );
                    }
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "An error occurred")
            }
        }
    }

    return (
        <>
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
                                                            {offer.project_name}
                                                            </Link>
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">{offer.created_at}</td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">{offer.project_type}</td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            {offer.registration_due_at}
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                offer.registration_status === "Open"
                                                                ? "bg-green-200 text-green-900"
                                                                : "bg-red-200 text-red-900"
                                                            }`}
                                                            >
                                                            {offer.registration_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                                            <div className="flex justify-center items-center">
                                                                <Button
                                                                    title={offer.is_regis ? "Registered" : "Register"}
                                                                    onClick={() => handleRegister(offer)}
                                                                    disabled={offer.registration_status === "Closed" || offer.is_regis}
                                                                />
                                                            </div>
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
                            process for {selectedOffer?.project_name}.
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
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-primary hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-200"
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

