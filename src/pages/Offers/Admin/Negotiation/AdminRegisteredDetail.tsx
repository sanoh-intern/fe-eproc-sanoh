"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
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
import fetchSupplierProposals, { TypeFinalReview, TypeSupplierProposal } from "../../../../api/Data/Admin/Offers/supplier-proposal"
import fetchListSupplierRegistered, { TypeListSupplierRegistered } from "../../../../api/Data/Admin/Offers/list-supplier-registered"
import { fetchCompanyDataAdmin, TypeCompanyData } from "../../../../api/Data/company-data"
import CompanyDetails from "../../../../components/CompanyDetails"
import { FaLock, FaEye, FaEyeSlash, FaBuilding, FaDownload } from "react-icons/fa"
import { postOffersAccepted, postOffersDeclined } from "../../../../api/Action/Admin/Offers/post-final-winner"
import { updateLastViewed } from "../../../../api/Action/Admin/Offers/put-view-amount"
import { streamFile } from "../../../../api/Action/stream-file"


const AdminRegisteredDetail: React.FC = () => {
  const [proposals, setProposals] = useState<TypeSupplierProposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<TypeSupplierProposal[]>([])
  const [allSuppliers, setAllSuppliers] = useState<TypeListSupplierRegistered[]>([])
  const [loading, setLoading] = useState(true)
  const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const navigate = useNavigate()
  const { offersId } = useParams<{ offersId: string }>();
  const [lastViewed, setLastViewed] = useState<TypeFinalReview["final_view_at"] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const offerdata = await fetchOfferDetails(offersId!)
        setOfferDetails(offerdata)

        const supplierdata = await fetchSupplierProposals(offersId!)

        setLastViewed(supplierdata.final_view_at || null)

        const flattenedData = supplierdata.data
        setProposals(flattenedData)
        setFilteredProposals(flattenedData)

        const registered = await fetchListSupplierRegistered(offersId!)
        setAllSuppliers(Array.isArray(registered) ? registered : [])

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
        p.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      updated = updated.filter((p) => p.proposal_status === statusFilter)
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
      await updateLastViewed({ offersId: offersId! })

      const updatedData = await fetchSupplierProposals(offersId!)
      const newLastViewed = updatedData.final_view_at || null
      setLastViewed(newLastViewed)

      const flattened = updatedData.data
      setProposals(flattened)
      setFilteredProposals(flattened)
    } catch {
      toast.error("Failed to update last viewed")
    }
  }

  // Accept / Decline proposal
  const handleProposalAction = (id: string, action: "Accepted" | "Declined") => {
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
        if (action === "Accepted") {
          try {
            // Replace this with your actual API endpoint
            await postOffersAccepted({ negotiationId: id });
            
            // Refresh the proposals data
            const updatedProposals = await fetchSupplierProposals(offersId!);
            const flattenedData = updatedProposals.data
            setProposals(flattenedData);
            setFilteredProposals(flattenedData);
          } catch (error) {
            toast.error('Server Error: Failed to accept proposal');
          }
        } else {
          try {
            // Replace this with your actual API endpoint
            await postOffersDeclined({ negotiationId: id });
            
            // Refresh the proposals data
            const updatedProposals = await fetchSupplierProposals(offersId!);
            const flattenedData = updatedProposals.data
            setProposals(flattenedData);
            setFilteredProposals(flattenedData);
          } catch (error) {
            toast.error('Server Error: Failed to decline proposal');
          }
        }
      }
    })
  }

  // Handle company details modal
  const handleViewCompanyDetails = async (supplierId: string) => {
    setIsModalOpen(true)
    try {
      const data = await fetchCompanyDataAdmin(supplierId)
      setCompanyData(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to load company details.")
    }
  }

  const handleDownloadAttachment = async (attachmentPath: string, fileName?: string) => {
    try {
      toast.info("Preparing file for download...")
      
      // Use the stream API to get the file
      const fileUrl = await streamFile(attachmentPath)
      
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName || 'attachment'
      link.target = '_blank'
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(fileUrl)
      }, 100)
      
      toast.success("Download started")
    } catch (error) {
      toast.error("Failed to download file")
      console.error("Download error:", error)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Breadcrumb pageName="Registered Detail" isSubMenu={true} parentMenu={{name: "Registered Offers", link: "/offers/registered"}}/>
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
                  ...Array.from(new Set(proposals.map((p) => p.proposal_status))).map(
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
                          Attachment
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
                        <tr key={proposal.id_negotiation} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-center whitespace-nowrap">{proposal.bp_code || "-"}</td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.company_name || "-"}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {lastViewed ? (                              
                                <>
                                  <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                                  {Number(proposal.proposal_total_amount).toLocaleString("id-ID")}
                                </>
                            ) : (
                              "XXX.XXX"
                            )}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.proposal_revision_no || "N/A"}
                            {proposal.is_final && (
                                <span className="ml-2 px-2 py-1 text-blue-800 rounded border border-blue-500">
                                    Final
                                </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.proposal_attach ? (
                              <button
                                onClick={() => handleDownloadAttachment(proposal.proposal_attach!, `attachment-${proposal.id_negotiation}`)}
                                className="inline-flex items-center px-3 py-1 bg-primary text-white text-xs font-medium rounded hover:bg-primary/80 transition-colors"
                                title="Download Attachment"
                              >
                                <FaDownload className="mr-1" />
                                Download
                              </button>
                            ) : (
                              <span className="text-gray-500 text-sm">No file</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.proposal_status || "-"}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            {proposal.proposal_last_updated || "-"}
                          </td>
                          <td className="px-3 py-3 text-center whitespace-nowrap">
                            <div className="flex justify-center">
                              <Button
                              title="View"
                              onClick={() => {
                                const supplier = allSuppliers.find(
                                (s) => s.company_name === proposal.company_name
                                );
                                navigate(
                                `/offers/negotiation/details?offersId=${offersId}&supplierId=${proposal.id_supplier}&bpCode=${proposal.bp_code}&companyName=${proposal.company_name}&registrationDate=${supplier?.registered_at}`
                                );
                              }}
                              color="bg-gray-600"
                              />
                            </div>
                          </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                            {localStorage.getItem("role") === "presdir" ? (
                              proposal.proposal_status === "Accepted" ? (
                              <span className="text-white font-semibold bg-green-600 px-3 py-2 rounded-full">Accepted</span>
                              ) : proposal.proposal_status === "Declined" ? (
                              <span className="text-white font-semibold bg-red-600 px-3 py-2 rounded-full">Declined</span>
                              ) : (
                              <div className="flex justify-center space-x-2">
                                <Button
                                title="Accept"
                                color="bg-green-600"
                                onClick={() => handleProposalAction(proposal.id_negotiation, "Accepted")}
                                />
                                <Button
                                title="Decline"
                                onClick={() => handleProposalAction(proposal.id_negotiation, "Declined")}
                                color="bg-red-600"
                                />
                              </div>
                              )
                            ) : (
                              (proposal.proposal_status === "Accepted" ) ? (
                                <span className="text-white font-semibold bg-green-600 px-3 py-2 rounded-full">Accepted</span>
                              ) : proposal.proposal_status === "Declined" ? (
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
                      <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {allSuppliers.map((supplier) => (
                      <tr key={supplier.id_user} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-center whitespace-nowrap">{supplier.bp_code || "-"}</td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {supplier.company_name}
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {supplier.registered_at}
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <div className="flex justify-center">
                            <Button
                              title="View Company Details"
                              onClick={() => handleViewCompanyDetails(supplier.id_user)}
                              icon={FaBuilding}
                            />
                          </div>
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
        {/* Company Details Modal */}
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
    </>
  )
}

export default AdminRegisteredDetail