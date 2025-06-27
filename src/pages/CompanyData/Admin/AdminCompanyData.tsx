"use client"

import React, { useState, useEffect } from "react"
import { FaSortUp, FaSortDown, FaBuilding } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import SearchBar from "../../../components/Table/SearchBar"
import Pagination from "../../../components/Table/Pagination"
import Select from "react-select"
import Button from "../../../components/Forms/Button"
import { toast } from "react-toastify"
import fetchCompanyListAdmin, { TypeCompanyListAdmin } from "../../../api/Data/Admin/company-list-admin"
import { fetchCompanyDataAdmin, TypeCompanyData } from "../../../api/Data/company-data"
import CompanyDetails from "../../../components/CompanyDetails"

const AdminCompanyData: React.FC = () => {
  const [suppliers, setSuppliers] = useState<TypeCompanyListAdmin[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<TypeCompanyListAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "",
    direction: "asc",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null)

  // Function to get verification status label and styling
  const getVerificationStatusDisplay = (status: string) => {
    switch (status) {
      case "verified":
        return { label: "Verified", className: "bg-green-200 text-green-800" }
      case "not_verified":
        return { label: "Not Verified", className: "bg-red-200 text-red-800" }
      case "profile_updated":
        return { label: "Profile Updated", className: "bg-blue-200 text-blue-800" }
      case "complete_profile":
        return { label: "Complete Profile", className: "bg-yellow-200 text-yellow-800" }
      case "under_verification":
        return { label: "Under Verification", className: "bg-orange-200 text-orange-800" }
      default:
        return { label: status, className: "bg-gray-200 text-gray-800" }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCompanyListAdmin()
        setSuppliers(data)
        setFilteredSuppliers(data)
      } catch (error) {
        toast.error("Failed to load company data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...suppliers]
    if (searchQuery) {
      filtered = filtered.filter((supplier) =>
        supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.verification_status === statusFilter)
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof TypeCompanyListAdmin]
        let bValue: any = b[sortConfig.key as keyof TypeCompanyListAdmin]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    setFilteredSuppliers(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortConfig, suppliers])

  const handleSort = (key: keyof TypeCompanyListAdmin) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key: key as string, direction })
  }

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewCompanyDetails = async (userId: number) => {
    setIsModalOpen(true)
    try {
      const data = await fetchCompanyDataAdmin(userId.toString())
      setCompanyData(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load company details.")
    }
  }

  return (
    <>
      <Breadcrumb pageName="Company Data" />
      <div className="bg-white">
        <div className="p-2 md:p-4 lg:p-6 space-y-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="w-full lg:w-1/2">
              <SearchBar placeholder="Search supplier name..." onSearchChange={setSearchQuery} />
            </div>
            <div className="w-full lg:w-1/3">
              <Select
                options={[
                  { value: "all", label: "All Statuses" },
                  ...[...new Set(suppliers.map((supplier) => supplier.verification_status))].map(
                    (status) => ({
                      value: status,
                      label: getVerificationStatusDisplay(status).label,
                    })
                  ),
                ]}
                value={
                  statusFilter
                  ? {
                    value: statusFilter,
                    label: statusFilter === "all" ? "All Statuses" : getVerificationStatusDisplay(statusFilter).label,
                    }
                  : null
                }
                onChange={(option: any) => setStatusFilter(option.value)}
                placeholder="Filter by Verification Status"
              />
            </div>
          </div>

          <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                      Supplier Name
                    </th>
                    <th
                      className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                      onClick={() => handleSort("bp_code")}
                    >
                      <span className="flex items-center justify-center">
                        {sortConfig.key === "bp_code" ? (
                          sortConfig.direction === "asc" ? (
                            <FaSortUp className="mr-1" />
                          ) : (
                            <FaSortDown className="mr-1" />
                          )
                        ) : (
                          <FaSortDown className="mr-1 opacity-50" />
                        )}
                        BP Code
                      </span>
                    </th>
                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                      Verification Status
                    </th>
                    <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading
                    ? Array.from({ length: rowsPerPage }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          {Array.from({ length: 4 }).map((_, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-3 text-center">
                              <div className="h-4 bg-gray-200 rounded"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                    : paginatedSuppliers.length > 0
                    ? paginatedSuppliers.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-center whitespace-nowrap font-semibold">
                              {supplier.supplier_name}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {supplier.bp_code || '-'}
                          </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              getVerificationStatusDisplay(supplier.verification_status).className
                              }`}
                            >
                              {getVerificationStatusDisplay(supplier.verification_status).label}
                            </span>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <div className="flex justify-center items-center">
                                <Button
                                onClick={() => handleViewCompanyDetails(supplier.user_id)}
                                title="View Company Details"
                                icon={FaBuilding}
                                />
                              </div>
                            </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                          No company data available.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            totalRows={filteredSuppliers.length}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>

        {/* Modal for Company Details */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-999 overflow-y-auto">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
            <div className="w-full bg-gray-100 p-8 rounded-lg relative z-10 max-w-7xl mx-4 my-8">
              <Button
                title="Close"
                onClick={() => setIsModalOpen(false)}
                color="bg-red-500 text-white absolute top-2 right-2"
              />
              <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <CompanyDetails companyData={companyData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminCompanyData