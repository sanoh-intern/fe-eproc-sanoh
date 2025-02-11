"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import SearchBar from "../../../components/Table/SearchBar"
import Pagination from "../../../components/Table/Pagination"
import { Link } from "react-router-dom"
import Select from 'react-select';

interface Offer {
  id: string
  projectName: string
  createdDate: string
  offerType: "Public" | "Invited"
  registrationDate: string
  revisionNo: number
  updatedDate: string
  status: "Need revision" | "On Review" | "Accepted" | "Declined"
  winningCompany: string | null
}

// Simulated API function
const fetchFollowedOffers = async (): Promise<Offer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}`,
    projectName: `Project ${i + 1}`,
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0],
    offerType: Math.random() > 0.5 ? "Public" : "Invited",
    registrationDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split("T")[0],
    revisionNo: Math.floor(Math.random() * 5),
    updatedDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split("T")[0],
    status: ["Need revision", "On Review", "Accepted", "Declined"][Math.floor(Math.random() * 4)] as Offer["status"],
    winningCompany: Math.random() > 0.8 ? `Company ${Math.floor(Math.random() * 100)}` : null,
  }))
}

const SupplierOffersFollowed: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })

  const loadOffers = async () => {
    try {
      const fetchedOffers = await fetchFollowedOffers()
      setOffers(fetchedOffers)
      setFilteredOffers(fetchedOffers)
    } catch (error) {
      console.error("Failed to fetch followed offers:", error)
      toast.error("Failed to load followed offers")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
    const savedPage = localStorage.getItem('offers_followed_current_page');
    if (savedPage) {
        setCurrentPage(parseInt(savedPage));
    }
  }, [])

  useEffect(() => {
    let filtered = [...offers]

    if (searchQuery) {
      filtered = filtered.filter((row) => row.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((row) => row.status === statusFilter)
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof Offer]
        let bValue: any = b[sortConfig.key as keyof Offer]

        if (sortConfig.key === "createdDate" || sortConfig.key === "registrationDate" || sortConfig.key === "updatedDate") {
          aValue = new Date(aValue).toISOString()
          bValue = new Date(bValue).toISOString()
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredOffers(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortConfig, offers])

  const handleSort = (key: keyof Offer) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const paginatedOffers = filteredOffers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    localStorage.setItem('offers_followed_current_page', page.toString());
  }

  return (
    <>
      <Breadcrumb pageName="Offers Followed" />
      <ToastContainer position="top-right" />
      <div className="bg-white">
        <div className="p-2 md:p-4 lg:p-6 space-y-6">
          {offers.length === 0 && !isLoading ? (
            <div className="text-center">
              <p className="mb-4">You haven't submitted any offers yet.</p>
              <Link
                to="/offers/available"
                className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded"
              >
                View Available Offers
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
                  <div className="w-full">
                    <SearchBar placeholder="Search projects..." onSearchChange={setSearchQuery} />
                  </div>
                </div>
                <div className="w-full lg:w-1/3">
                  <Select
                    options={[
                      { value: 'all', label: 'All Statuses' },
                      { value: 'Need revision', label: 'Need Revision' },
                      { value: 'On Review', label: 'On Review' },
                      { value: 'Accepted', label: 'Accepted' },
                      { value: 'Declined', label: 'Declined' },
                    ]}
                    value={
                      statusFilter
                      ? { value: statusFilter, label: statusFilter === 'all' ? 'All Statuses' : statusFilter }
                      : null
                    }
                    onChange={(e: any) => setStatusFilter(e.value)}
                    placeholder="All Statuses"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                        >
                          <span className="flex items-center justify-center">
                          Project Name
                          </span>
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
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer" 
                        >
                          <span className="flex items-center justify-center">            
                          Type
                          </span>
                        </th>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                          onClick={() => handleSort("registrationDate")}
                        >
                          <span className="flex items-center justify-center">
                          {sortConfig.key === "registrationDate" ? (
                            sortConfig.direction === "asc" ? (
                            <FaSortUp className="mr-1" />
                            ) : (
                            <FaSortDown className="mr-1" />
                            )
                          ) : (
                            <FaSortDown className="opacity-50 mr-1" />
                          )}
                          Registration Date
                          </span>
                        </th>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                        >
                          <span className="flex items-center justify-center">
                          Revision No
                          </span>
                        </th>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                          onClick={() => handleSort("updatedDate")}
                        >
                          <span className="flex items-center justify-center">
                          {sortConfig.key === "updatedDate" ? (
                            sortConfig.direction === "asc" ? (
                            <FaSortUp className="mr-1" />
                            ) : (
                            <FaSortDown className="mr-1" />
                            )
                          ) : (
                            <FaSortDown className="opacity-50 mr-1" />
                          )}
                          Updated Date
                          </span>
                        </th>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                        >
                          <span className="flex items-center justify-center">
                          Status
                          </span>
                        </th>
                        <th
                          className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                        >
                          <span className="flex items-center justify-center">
                          Winning Company
                          </span>
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {isLoading ? (
                        Array.from({ length: rowsPerPage }).map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            {Array.from({ length: 8 }).map((_, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-3 text-center whitespace-nowrap">
                                <div className="h-4 bg-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : paginatedOffers.length > 0 ? (
                        paginatedOffers.map((offer) => (
                          <tr key={offer.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <Link to={`/offers/followed/negotiation/details/${offer.id}`} className="text-blue-600 font-medium hover:underline">
                                {offer.projectName}
                              </Link>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.createdDate}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.offerType}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.registrationDate}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.revisionNo}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.updatedDate}</td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  offer.status === "Accepted"
                                    ? "bg-green-100 text-green-800"
                                    : offer.status === "Declined"
                                      ? "bg-red-100 text-red-800"
                                      : offer.status === "On Review"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {offer.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">{offer.winningCompany || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                            No offers available
                          </td>
                        </tr>
                      )}
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

export default SupplierOffersFollowed

