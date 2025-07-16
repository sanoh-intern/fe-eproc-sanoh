"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaDownload } from "react-icons/fa"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../../components/Forms/Button"
import Pagination from "../../../../components/Table/Pagination"
import Swal from "sweetalert2"
import Loader from "../../../../common/Loader"
import OffersDetails from "../../../../components/OffersDetail"
import fetchOfferDetails, { TypeOfferDetails } from "../../../../api/Data/offers-detail"
import fetchNegotiationSupplier, { TypeNegotiationSupplier } from "../../../../api/Data/Supplier/negotiation"
import { postNegotiation } from "../../../../api/Action/Supplier/post-negotiation"
import { streamFile } from "../../../../api/Action/stream-file"
import { useSearchParams } from "react-router-dom";

const SupplierNegotiation: React.FC = () => {
    const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null)
    const [negotiationHistory, setNegotiationHistory] = useState<TypeNegotiationSupplier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [file, setFile] = useState<File | null>(null)
    const [totalAmount, setTotalAmount] = useState<string>("")
    const [isFinal, setIsFinal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchParams] = useSearchParams();
    const offersid = searchParams.get("offerid");
    

    useEffect(() => {
        const loadData = async () => {
            try {
                const [details, history] = await Promise.all([
                    fetchOfferDetails(offersid!),
                    fetchNegotiationSupplier(offersid!),
                ])
                setOfferDetails(details)
                setNegotiationHistory(Array.isArray(history) ? history : [])
            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Failed to load negotiation details")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files) {
    //         setFile(event.target.files[0])
    //     }
    // }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0]
            
            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                return
            }
            
            // Validate file type (common document types)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/png',
                'image/jpg'
            ]
            
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error("Please upload a valid file (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)")
                return
            }
            
            setFile(selectedFile)        }
    }

    const handleSubmit = async () => {
        if (!totalAmount && !file) {
            toast.error("Please provide either a total amount or a file.")
            return
        }

        if (!totalAmount) {
            toast.error("Please provide a total amount.")
            return
        }

        const result = await Swal.fire({
            title: "Confirm Submission",
            text: "Are you sure you want to submit this proposal?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2F4F4F",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!",
        })

        if (result.isConfirmed) {
            try {
                const formData = new FormData()
                formData.append("project_header_id", offersid!)
                formData.append("proposal_total_amount", totalAmount)
                const isFinalSubmission = isFinal || negotiationHistory.length >= 4
                formData.append("proposal_status", String(isFinalSubmission))
                if (file) {
                    formData.append("proposal_attach", file)
                }

                console.log("formData", formData)

                const response = await postNegotiation(formData)
                if (!response.status) {
                    throw new Error(response.message)
                }                toast.success("Proposal submitted successfully!")
                const newHistory = await fetchNegotiationSupplier(offersid!)
                setNegotiationHistory(newHistory)
                setFile(null)
                setTotalAmount("")
                setIsFinal(false)
                
                // Clear the file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                if (fileInput) {
                    fileInput.value = ''
                }
            } catch (error: any) {
                console.error("There was an error submitting the proposal:", error)
                toast.error(`Failed to submit proposal: ${error.message}`)
            } finally {
                
            }
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

    const paginatedHistory = negotiationHistory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    if (isLoading) {
        return <Loader />
    }

    if (!offerDetails) {
        return <div className="text-center py-10">No projects details found.</div>
    }

    return (
        <>
            <Breadcrumb
                isSubMenu={true}
                pageName="Negotiation"
                parentMenu={{ name: "Project Registered", link: "/offers/followed" }}
            />
            <div>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="p-4 md:p-4 lg:p-6">
                        <OffersDetails offerDetails={offerDetails} />
                    </div>
                </div>

                {offerDetails.project_status === "Supplier Selected" && offerDetails.project_winner && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
                        <p className="font-bold">Tender Closed</p>
                        <p>The winning supplier for this tender is: {offerDetails.project_winner}</p>
                    </div>
                )}

                {(offerDetails.project_status !== "Supplier Selected" || !offerDetails.project_winner) && !negotiationHistory.some(entry => entry.is_final) && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-4 md:p-4 lg:p-6 space-y-6">
                            <h2 className="text-2xl font-bold text-primary mb-4">Submit Proposal</h2>                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary">Upload File (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        className="mt-2 block w-full text-sm text-primary
                                        file:mr-4 file:py-2 file:px-4 file:border-0
                                        file:text-md file:font-medium
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-blue-100 border border-secondary rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    />
                                    {file && (
                                        <p className="mt-1 text-sm text-green-600">
                                            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary">Total Amount</label>
                                    <div className="relative mt-2">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 select-none">IDR</span>
                                        <input
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                            className="pl-12 block w-full text-sm text-primary border border-secondary rounded-md p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="isFinal"
                                            aria-describedby="isFinal-description"
                                            type="checkbox"
                                            checked={isFinal || negotiationHistory.length >= 4}
                                            onChange={(e) => setIsFinal(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="isFinal" className="font-medium text-primary cursor-pointer">
                                            This is the final submission
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                title="Submit Proposal"
                                disabled={offerDetails.project_status === "Supplier Selected" && (!!offerDetails.project_winner || negotiationHistory.length >= 5 || negotiationHistory.some(entry => entry.is_final))}
                            />
                            {negotiationHistory.length >= 5 && (
                                <p className="text-red-500 text-sm">Maximum number of submissions reached.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4 md:p-4 lg:p-6 space-y-6">
                        <h2 className="text-2xl font-bold text-primary mb-4">Negotiation History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Submit Date
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Attachment
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Total Amount
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Revision No
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Status
                                        </th>
                                    </tr>
                                </thead>                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paginatedHistory.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-center whitespace-nowrap">{entry.proposal_submit_date}</td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {entry.proposal_attach ? (
                                                    <button
                                                        onClick={() => handleDownloadAttachment(entry.proposal_attach!, `attachment-${entry.id}`)}
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
                                            <td className="px-3 py-3 text-center whitespace-nowrap flex items-center justify-center">
                                                <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                                                <span>{Number(entry.proposal_total_amount).toLocaleString('id-ID')}</span>
                                            </td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {entry.proposal_revision_no} {entry.is_final && <span className="ml-2 text-xs font-medium bg-primary px-3 py-1 rounded-full text-white">Final</span>}
                                            </td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 rounded ${entry.proposal_status === "Accepted"
                                                        ? "bg-green-200 text-green-800"
                                                        : entry.proposal_status === "Declined"
                                                            ? "bg-red-200 text-red-800"
                                                            : entry.proposal_status === "On Review"
                                                                ? "bg-yellow-200 text-yellow-800"
                                                                : "bg-blue-200 text-blue-800"
                                                        }`}
                                                >
                                                    {entry.proposal_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            totalRows={negotiationHistory.length}
                            rowsPerPage={rowsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onRowsPerPageChange={setRowsPerPage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupplierNegotiation

