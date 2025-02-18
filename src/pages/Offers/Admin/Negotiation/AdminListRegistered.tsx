"use client"

import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Select from "react-select"
import Pagination from "../../../../components/Table/Pagination"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import SearchBar from "../../../../components/Table/SearchBar"
import { Link } from "react-router-dom"
import fetchRegisteredOffers, { TypeListRegisteredOffer } from "../../../../api/Data/Admin/Offers/list-registered-offers"


const AdminRegistered: React.FC = () => {
    const [offers, setOffers] = useState<TypeListRegisteredOffer[]>([])
    const [filteredOffers, setFilteredOffers] = useState<TypeListRegisteredOffer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "",
        direction: "asc",
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchRegisteredOffers()
                setOffers(data)
                setFilteredOffers(data)
            } catch (error) {
                toast.error("Failed to load offers")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    useEffect(() => {
        let updated = [...offers]
        // Search
        if (searchQuery) {
            updated = updated.filter((o) =>
                o.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        }
        // Filter by type
        if (typeFilter !== "all") {
            updated = updated.filter((o) => o.offerType === typeFilter)
        }
        // Filter by status
        if (statusFilter !== "all") {
            updated = updated.filter((o) => o.offerStatus === statusFilter)
        }
        // Sort
        if (sortConfig.key) {
            updated.sort((a, b) => {
                let aVal: any = a[sortConfig.key as keyof TypeListRegisteredOffer]
                let bVal: any = b[sortConfig.key as keyof TypeListRegisteredOffer]
                if (sortConfig.key === "createdDate") {
                    aVal = new Date(aVal).toISOString()
                    bVal = new Date(bVal).toISOString()
                }
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
                return 0
            })
        }
        setFilteredOffers(updated)
        setCurrentPage(1)
    }, [searchQuery, typeFilter, statusFilter, sortConfig, offers])

    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSort = (key: keyof TypeListRegisteredOffer) => {
        let direction: "asc" | "desc" = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key: key as string, direction })
    }

    return (
        <>
            <Breadcrumb pageName="Registered Offers" />
            <ToastContainer position="top-right" />
            <div className="bg-white">
                <div className="p-2 md:p-4 lg:p-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center">
                        <div className="w-full">
                            <SearchBar placeholder="Search project name..." onSearchChange={setSearchQuery} />
                        </div>
                        <div className="w-full">
                            <Select
                                options={[
                                    { value: "all", label: "All Types" },
                                    ...([...new Set(offers.map((offer) => offer.offerType))].map(
                                        (type) => ({
                                            value: type,
                                            label: type,
                                        })
                                    )),
                                ]}
                                value={{ value: typeFilter, label: typeFilter === "all" ? "All Types" : typeFilter }}
                                onChange={(e: any) => setTypeFilter(e.value)}
                                placeholder="Filter by Type"
                                className="w-full"
                            />
                        </div>
                        <div className="w-full">
                            <Select
                                options={[
                                    { value: "all", label: "All Statuses" },
                                    ...([...new Set(offers.map((offer) => offer.offerStatus))].map(
                                        (status) => ({
                                            value: status,
                                            label: status,
                                        })
                                    )),
                                ]}
                                value={{
                                    value: statusFilter,
                                    label: statusFilter === "all" ? "All Statuses" : statusFilter,
                                }}
                                onChange={(e: any) => setStatusFilter(e.value)}
                                placeholder="Filter by Offer Status"
                                className="w-full"
                            />
                        </div>
                    </div>
                    {filteredOffers.length === 0 && !loading ? (
                        <div className="text-center">
                            <p className="mb-4">No offers available.</p>
                        </div>
                        ) : (
                            <>
                                <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Project Name
                                                    </th>
                                                    <th
                                                        className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                                                        onClick={() => handleSort("offerType")}
                                                    >
                                                    Offer Type
                                                    </th>
                                                    <th
                                                        className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                                                        onClick={() => handleSort("createdDate")}
                                                    >
                                                        <span className="flex items-center justify-center">
                                                            {sortConfig.key === "createdDate" ? (
                                                            sortConfig.direction === "asc" ? (
                                                                <FaSortUp className="mr-1" />
                                                            ) : (
                                                                <FaSortDown className="mr-1" />
                                                            )
                                                            ) : (
                                                            <FaSortDown className="opacity-50 mr-1" />
                                                            )}
                                                            Created Date
                                                        </span>
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Offer Status
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Total Suppliers
                                                    </th>
                                                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                                        Winning Supplier
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {loading ? (
                                                    Array.from({ length: rowsPerPage }).map((_, index) => (
                                                        <tr key={index} className="animate-pulse">
                                                            {Array.from({ length: 6 }).map((_, cellIndex) => (
                                                            <td key={cellIndex} className="px-3 py-3 text-center">
                                                                <div className="h-4 bg-gray-200 rounded"></div>
                                                            </td>
                                                            ))}
                                                        </tr>
                                                    ))
                                                ) : paginatedOffers.length > 0 ? (
                                                        paginatedOffers.map((offer) => (
                                                        <tr key={offer.id} className="hover:bg-gray-50">
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                <Link
                                                                    to={`/offers/registered/details/offersId=${offer.id}`}
                                                                    className="text-blue-600 underline font-medium hover:text-blue-800"
                                                                >
                                                                    {offer.projectName}
                                                                </Link>
                                                            </td>
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                {offer.offerType}
                                                            </td>
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                {offer.createdDate}
                                                            </td>
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                {offer.offerStatus}
                                                            </td>
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                {offer.totalSuppliers}
                                                            </td>
                                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                                {offer.winningSupplier || "-"}
                                                            </td>
                                                        </tr>
                                                        ))
                                                ) : (
                                                    
                                                    <tr>
                                                        <td colSpan={6} className="px-3 py-3 text-center">
                                                            No offers found.
                                                        </td>
                                                    </tr>
                                                    
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Pagination
                                    totalRows={filteredOffers.length}
                                    rowsPerPage={rowsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={setRowsPerPage}
                                />
                            </>
                        )}
                    </div>
            </div>
        </>
    )
}

export default AdminRegistered