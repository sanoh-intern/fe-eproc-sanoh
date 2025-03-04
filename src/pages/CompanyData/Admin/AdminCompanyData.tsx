"use client"

import React, { useState, useEffect } from "react"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import SearchBar from "../../../components/Table/SearchBar"
import Pagination from "../../../components/Table/Pagination"
import { useNavigate } from "react-router-dom"
import Select from "react-select"
import Button from "../../../components/Forms/Button"
import { toast } from "react-toastify"

interface AdminSupplier {
  id: string
  supplierName: string
  bpCode: string
  verificationStatus: "Verified" | "Unverified"
}

// Simulated API function for admin company data
const fetchAdminCompanyData = async (): Promise<AdminSupplier[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 10 }, (_, i) => ({
    id: `supplier-${i + 1}`,
    supplierName: `Supplier ${i + 1}`,
    bpCode: `BP-${Math.floor(Math.random() * 9000) + 1000}`,
    verificationStatus: Math.random() > 0.5 ? "Verified" : "Unverified",
  }))
}

const AdminCompanyData: React.FC = () => {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<AdminSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "",
    direction: "asc",
  })
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminCompanyData()
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
        supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.verificationStatus === statusFilter)
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof AdminSupplier]
        let bValue: any = b[sortConfig.key as keyof AdminSupplier]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    setFilteredSuppliers(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortConfig, suppliers])

  const handleSort = (key: keyof AdminSupplier) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDetails = (id: string) => {
    navigate(`/company-data/detail/${id}`)
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
                  ...[...new Set(suppliers.map((supplier) => supplier.verificationStatus))].map(
                    (status) => ({
                      value: status,
                      label: status,
                    })
                  ),
                ]}
                value={
                  statusFilter
                  ? {
                    value: statusFilter,
                    label: statusFilter === "all" ? "All Statuses" : statusFilter,
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
                      onClick={() => handleSort("bpCode")}
                    >
                      <span className="flex items-center justify-center">
                        {sortConfig.key === "bpCode" ? (
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
                              {supplier.supplierName}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {supplier.bpCode}
                          </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              supplier.verificationStatus === "Verified"
                                ? "bg-green-300 text-green-800"
                                : "bg-red-300 text-red-800"
                              }`}
                            >
                              {supplier.verificationStatus}
                            </span>
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <div className="flex justify-center items-center">
                                <Button
                                onClick={() => handleDetails(supplier.id)}
                                title="Details"
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
      </div>
    </>
  )
}

export default AdminCompanyData