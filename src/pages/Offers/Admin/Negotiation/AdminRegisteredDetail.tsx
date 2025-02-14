"use client"

import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Select from "react-select"
import Pagination from "../../../../components/Table/Pagination"
import Loader from "../../../../common/Loader"
import Swal from "sweetalert2"
import SearchBar from "../../../../components/Table/SearchBar"
import OffersDetails from "../../../../components/OffersDetail"
import Button from "../../../../components/Forms/Button"


// ---------------------------------------------------
// Supplier proposal table interface
interface SupplierProposal {
  bpcode: string
  companyName: string
  totalAmount: number
  revisionNo: number
  lastStatus: "Not Uploaded" | "Need Revision" | "On Review" | "Declined" | "Accepted"
  lastComment: string
  lastUploadAt: string
}

// ---------------------------------------------------
// Registered suppliers table interface
interface RegisteredSupplier {
  bpcode: string
  companyName: string
  registrationDate: string
}

const fetchSupplierProposals = async (): Promise<SupplierProposal[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 6 }, (_, i) => ({
    bpcode: `BP${1000 + i}`,
    companyName: `Company ${i + 1}`,
    totalAmount: Math.floor(Math.random() * 100000) + 1000,
    revisionNo: Math.floor(Math.random() * 5),
    lastStatus: ["Not Uploaded", "Need Revision", "On Review", "Declined", "Accepted"][
      Math.floor(Math.random() * 5)
    ] as SupplierProposal["lastStatus"],
    lastComment: "Lorem ipsum dolor sit amet.",
    lastUploadAt: new Date(Date.now() - Math.floor(Math.random() * 600000000))
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
  }))
}

const fetchRegisteredSuppliers = async (): Promise<RegisteredSupplier[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return Array.from({ length: 8 }, (_, i) => ({
    bpcode: `BP${2000 + i}`,
    companyName: `Supplier ${i + 1}`,
    registrationDate: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    )
      .toISOString()
      .split("T")[0],
  }))
}

// ---------------------------------------------------
// Page component
const AdminRegisteredDetail: React.FC = () => {
  const [proposals, setProposals] = useState<SupplierProposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<SupplierProposal[]>([])
  const [allSuppliers, setAllSuppliers] = useState<RegisteredSupplier[]>([])
  const [loading, setLoading] = useState(true)

  // Table states for proposals
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const propData = await fetchSupplierProposals()
        setProposals(propData)
        setFilteredProposals(propData)
        const registered = await fetchRegisteredSuppliers()
        setAllSuppliers(registered)
      } catch (error) {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter logic for proposals
  useEffect(() => {
    let updated = [...proposals]
    if (searchQuery) {
      updated = updated.filter((p) =>
        p.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      updated = updated.filter((p) => p.lastStatus === statusFilter)
    }
    setFilteredProposals(updated)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, proposals])

  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Accept / Decline proposal
  const handleProposalAction = (bpcode: string, action: "Accepted" | "Declined") => {
    Swal.fire({
      title: `Confirm ${action}`,
      text: `Are you sure you want to mark this proposal as ${action}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2F4F4F",
      cancelButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // In real usage, you'd send an API request here
        toast.success(`Proposal from ${bpcode} has been ${action}`)
        if (action === "Accepted") {
          try {
            // Replace this with your actual API endpoint
            await fetch('/api/proposals/accept', {
              method: 'POST',
              headers: {
          'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bpcode }),
            });
            
            // Refresh the proposals data
            const updatedProposals = await fetchSupplierProposals();
            setProposals(updatedProposals);
            setFilteredProposals(updatedProposals);
          } catch (error) {
            toast.error('Failed to accept proposal');
          }
        } else {
          try {
            // Replace this with your actual API endpoint
            await fetch('/api/proposals/decline', {
              method: 'POST',
              headers: {
          'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bpcode }),
            });
            
            // Refresh the proposals data
            const updatedProposals = await fetchSupplierProposals();
            setProposals(updatedProposals);
            setFilteredProposals(updatedProposals);
          } catch (error) {
            toast.error('Failed to decline proposal');
          }
        }
      }
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Breadcrumb pageName="Registered Detail" isSubMenu={true} parentMenu={{name: "Registered Offers", link: "/offers/registered"}}/>
      <ToastContainer position="top-right" />
      <div className="bg-white p-2 md:p-4 lg:p-6 space-y-8 text-primary">
        <OffersDetails />

        {/* Supplier Proposals Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">List of Supplier Proposals</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-center mb-4 justify-between">
            <SearchBar placeholder="Search company name..." onSearchChange={setSearchQuery} />
            <Select
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Not Uploaded", label: "Not Uploaded" },
                { value: "Need Revision", label: "Need Revision" },
                { value: "On Review", label: "On Review" },
                { value: "Declined", label: "Declined" },
                { value: "Accepted", label: "Accepted" },
              ]}
              value={{
                value: statusFilter,
                label: statusFilter === "all" ? "All Statuses" : statusFilter,
              }}
              onChange={(val: any) => setStatusFilter(val.value)}
              placeholder="Filter by Status"
            />
          </div>

          {filteredProposals.length === 0 ? (
            <div className="text-center">
              <p>No proposals available.</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          BP Code
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Company Name
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Total Amount
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Revision No
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Last Status
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Last Comment
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Last Upload
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Details
                        </th>
                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paginatedProposals.map((proposal) => (
                        <tr key={proposal.bpcode} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-center whitespace-nowrap">{proposal.bpcode}</td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.companyName}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                              <span>{Number(proposal.totalAmount).toLocaleString('id-ID')}</span>
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.revisionNo}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.lastStatus}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.lastComment}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.lastUploadAt}
                          </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <div className="flex justify-center">
                                <Button
                                  title="View"
                                  onClick={() => navigate(`/offers/negotiation/details/${proposal.bpcode}`)}
                                  color="bg-gray-600"
                                />
                              </div>
                            </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            
                            {proposal.lastStatus === "Accepted" ? (
                              <span className="text-white font-semibold bg-green-600 px-3 py-2 rounded-full">Accepted</span>
                            ) : proposal.lastStatus === "Declined" ? (
                              <span className="text-white font-semibold bg-red-600 px-3 py-2 rounded-full">Declined</span>
                            ) : (
                              <div className="flex justify-center space-x-2">
                                <Button
                                  title="Accept"
                                  color="bg-green-600"
                                  onClick={() => handleProposalAction(proposal.bpcode, "Accepted")}
                                />
                                <Button
                                  title="Decline"
                                  onClick={() => handleProposalAction(proposal.bpcode, "Declined")}
                                  color="bg-red-600"
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Pagination
                totalRows={filteredProposals.length}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={setRowsPerPage}
              />
            </>
          )}
        </div>

        {/* Registered Suppliers Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Registered Suppliers</h2>
          {allSuppliers.length === 0 ? (
            <div className="text-center">
              <p>No registered suppliers.</p>
            </div>
          ) : (
            <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                        BP Code
                      </th>
                      <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                        Company Name
                      </th>
                      <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                        Registration Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {allSuppliers.map((supplier) => (
                      <tr key={supplier.bpcode} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-center whitespace-nowrap">{supplier.bpcode}</td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {supplier.companyName}
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {supplier.registrationDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminRegisteredDetail