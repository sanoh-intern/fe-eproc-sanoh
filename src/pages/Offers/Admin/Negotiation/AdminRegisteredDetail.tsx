"use client"

import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate, useParams } from "react-router-dom"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Select from "react-select"
import Pagination from "../../../../components/Table/Pagination"
import Loader from "../../../../common/Loader"
import Swal from "sweetalert2"
import SearchBar from "../../../../components/Table/SearchBar"
import OffersDetails from "../../../../components/OffersDetail"
import Button from "../../../../components/Forms/Button"
import fetchOfferDetails, { TypeOfferDetails } from "../../../../api/Data/offers-detail"
import fetchSupplierProposals, { TypeSupplierProposal } from "../../../../api/Data/Admin/Offers/supplier-proposal"
import fetchListSupplierRegistered, { TypeListSupplierRegistered } from "../../../../api/Data/Admin/Offers/list-supplier-registered"
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"


const AdminRegisteredDetail: React.FC = () => {
  const [proposals, setProposals] = useState<TypeSupplierProposal["data"]>([])
  const [filteredProposals, setFilteredProposals] = useState<TypeSupplierProposal["data"]>([])
  const [allSuppliers, setAllSuppliers] = useState<TypeListSupplierRegistered[]>([])
  const [loading, setLoading] = useState(true)
  const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const navigate = useNavigate()
  const { offersId } = useParams<{ offersId: string }>(); 
  const [lastViewed, setLastViewed] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const offerdata = await fetchOfferDetails(offersId!)
        setOfferDetails(offerdata)

        const supplierdata = await fetchSupplierProposals(offersId!)

        const lastViewedFromApi = supplierdata.length > 0 ? supplierdata[0].lastViewed : null
        setLastViewed(lastViewedFromApi)

        const flattenedData = supplierdata.flatMap((item) => item.data)
        setProposals(flattenedData)
        setFilteredProposals(flattenedData)

        const registered = await fetchListSupplierRegistered(offersId!)
        setAllSuppliers(registered)

      } catch (error) {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [offersId])

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

  const handleLastViewed = async () => {
    try {
      await fetch("/api/proposals/last-viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offersId }),
      })

      const updatedData = await fetchSupplierProposals(offersId!)
      const newLastViewed = updatedData.length > 0 ? updatedData[0].lastViewed : null
      setLastViewed(newLastViewed)

      // Update the proposals with any new changes
      const flattened = updatedData.flatMap((item) => item.data)
      setProposals(flattened)
      setFilteredProposals(flattened)
      toast.success("Last viewed updated!")
    } catch {
      toast.error("Failed to update last viewed")
    }
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
            const updatedProposals = await fetchSupplierProposals(offersId!);
            const flattenedData = updatedProposals.flatMap((item) => item.data)
            setProposals(flattenedData);
            setFilteredProposals(flattenedData);
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
            const updatedProposals = await fetchSupplierProposals(offersId!);
            const flattenedData = updatedProposals.flatMap((item) => item.data)
            setProposals(flattenedData);
            setFilteredProposals(flattenedData);
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
        <OffersDetails offerDetails={offerDetails} />

        {/* Supplier Proposals Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4">List of Supplier Proposals</h2>
            {localStorage.getItem("role") === "presdir" && (
              <div>
              {lastViewed ? (
                <Button
                title={lastViewed}
                onClick={handleLastViewed}
                icon={FaEye}
                />
              ) : (
                <Button
                title="View Amounts"
                onClick={handleLastViewed}
                icon={FaEyeSlash}
                />
              )}
              </div>
            )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-center mb-4 justify-between">
              <SearchBar placeholder="Search company name..." onSearchChange={setSearchQuery} />
              <Select
                options={[
                { value: "all", label: "All Statuses" },
                  ...Array.from(new Set(proposals.map((p) => p.lastStatus))).map(
                    (status) => ({
                      value: status,
                      label: status,
                    })
                  ),
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
                            {lastViewed
                              ? <>
                                <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                                {Number(proposal.totalAmount).toLocaleString("id-ID")}
                              </>
                              : "XXX.XXX"
                            }
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.revisionNo}
                            {proposal.isFinal && (
                                <span className="ml-2 px-2 py-1 text-blue-800 rounded border border-blue-500">
                                    Final
                                </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.lastStatus}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.lastUploadAt}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <div className="flex justify-center">
                              <Button
                              title="View"
                              onClick={() => navigate(`/offers/negotiation/details/${offersId}/${proposal.id}`)}
                              color="bg-gray-600"
                              />
                            </div>
                          </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                            {localStorage.getItem("role") === "presdir" ? (
                              proposal.lastStatus === "Accepted" ? (
                              <span className="text-white font-semibold bg-green-600 px-3 py-2 rounded-full">Accepted</span>
                              ) : proposal.lastStatus === "Declined" ? (
                              <span className="text-white font-semibold bg-red-600 px-3 py-2 rounded-full">Declined</span>
                              ) : (
                              <div className="flex justify-center space-x-2">
                                <Button
                                title="Accept"
                                color="bg-green-600"
                                onClick={() => handleProposalAction(proposal.id, "Accepted")}
                                />
                                <Button
                                title="Decline"
                                onClick={() => handleProposalAction(proposal.id, "Declined")}
                                color="bg-red-600"
                                />
                              </div>
                              )
                            ) : (
                              (proposal.lastStatus === "Accepted" ) ? (
                                <span className="text-white font-semibold bg-green-600 px-3 py-2 rounded-full">Accepted</span>
                              ) : proposal.lastStatus === "Declined" ? (
                                <span className="text-white font-semibold bg-red-600 px-3 py-2 rounded-full">Declined</span>
                              ) : (
                                <div className="flex justify-center">
                                  <span className="text-primary" title="Only presdir can access">
                                  <FaLock />
                                  </span>
                                </div>
                              )
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