"use client"

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaBuilding, FaDownload } from "react-icons/fa"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../../components/Forms/Button"
import Pagination from "../../../../components/Table/Pagination"
import Loader from "../../../../common/Loader"
import OffersDetails from "../../../../components/OffersDetail"
import fetchOfferDetails, { TypeOfferDetails } from "../../../../api/Data/offers-detail"
import { fetchCompanyDataAdmin, TypeCompanyData } from "../../../../api/Data/company-data"
import CompanyDetails from "../../../../components/CompanyDetails"
import fetchNegotiationData, { TypeNegotiationData } from "../../../../api/Data/Admin/Offers/history-supplier-proposal"
import { streamFile } from "../../../../api/Action/stream-file"
import { useLocation } from "react-router-dom"


const AdminNegotiation: React.FC = () => {
    const [proposals, setProposals] = useState<TypeNegotiationData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null);
    const [isView, setIsView] = useState(false)

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const offersId = searchParams.get("offersId");
    const supplierId = searchParams.get("supplierId");
    const bpCode = searchParams.get("bpCode");
    const companyName = searchParams.get("companyName");
    const registrationDate = searchParams.get("registrationDate");

    if (!offersId || !supplierId) {
        toast.error("Missing required parameters.");
        return null;
    }


    useEffect(() => {
        const loadData = async () => {
            try {
                const offerdata = await (fetchOfferDetails(offersId!))
                setOfferDetails(offerdata)

                const data = await fetchNegotiationData(offersId!,supplierId!)

                if (data.final_view_at) {
                    setIsView(true)
                }

                const proposalData = data.data
                if (Array.isArray(proposalData)) {
                    setProposals(proposalData as TypeNegotiationData[])
                } else {
                    setProposals([])
                }
            } catch (error) {
                console.error("Failed to load negotiation details:", error)
                toast.error("Failed to load negotiation details.")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [offersId, supplierId])

    if (isLoading) {
        return <Loader />
    }

    const paginatedProposals = proposals.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

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

    const handeclick = async () => {
        setIsModalOpen(true)
        try {
            const data = await fetchCompanyDataAdmin(supplierId!)
            setCompanyData(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load company details.")
        }
    }

    return (
        <>
            <Breadcrumb pageName="Negotiation Detail" isSubMenu={true} parentMenu={{name: "Registered Offers", link: "/offers/registered"}}/>
            <div >
                <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-8">
                    <OffersDetails offerDetails={offerDetails} />
                </div>

                <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Supplier Proposals</h3>
                    {proposals.length === 0 ? (
                        <p>No proposals found.</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <div className="mb-6">
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Company Name</p>
                                                <p className="font-medium">{companyName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">BP Code</p>
                                                <p className="font-medium">{bpCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Registration Date</p>
                                                <p className="font-medium">{registrationDate}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <Button
                                                    title="View Company Details"
                                                    onClick={handeclick}
                                                    icon={FaBuilding}
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Submit Date
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Attachment
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Total Amount
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Revision No
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Status
                                            </th>                                            
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {paginatedProposals.map((proposal) => (
                                            <tr key={proposal.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-center">{proposal.proposal_submit_date}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    {proposal.proposal_attach ? (
                                                        <button
                                                            onClick={() => handleDownloadAttachment(proposal.proposal_attach!, `attachment-${proposal.id}`)}
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
                                                <td className="px-3 py-3 text-center">
                                                    <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                                                    <span>
                                                        {isView
                                                            ? Number(proposal.proposal_total_amount).toLocaleString("id-ID")
                                                            : proposal.is_final
                                                            ? "XXX.XXX"
                                                            : Number(proposal.proposal_total_amount).toLocaleString("id-ID")
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-center">{proposal.proposal_revision_no}
                                                {proposal.is_final && (
                                                        <span className="ml-2 px-2 py-1 text-blue-800 rounded border border-blue-500">
                                                            Final
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full ${
                                                        proposal.proposal_status === "On Review" || proposal.proposal_status === "On Review Final"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : proposal.proposal_status === "Accepted"
                                                            ? "bg-green-200 text-green-800"
                                                            : "bg-red-200 text-red-800"
                                                        }`}
                                                    >
                                                        {proposal.proposal_status}
                                                    </span>
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                totalRows={proposals.length}
                                rowsPerPage={rowsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                onRowsPerPageChange={setRowsPerPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminNegotiation