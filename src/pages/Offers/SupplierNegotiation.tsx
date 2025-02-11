"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiCalendar, FiClock, FiDownload } from "react-icons/fi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import Button from "../../components/Forms/Button"
import Pagination from "../../components/Table/Pagination"
import Swal from "sweetalert2"
import Loader from "../../common/Loader"

interface OfferDetails {
    id: string
    projectName: string
    createdDate: string
    closeRegistrationDate: string
    overview: string
    attachmentUrl: string
    registrationDate: string
    winningCompany: string | null
    isClosed: boolean
}

interface NegotiationEntry {
    id: string
    submitDate: string
    attachmentUrl: string | null
    totalAmount: number
    revisionNo: number
    status: "Revision" | "On Review" | "Accepted" | "Declined"
    comment: string | null
    final: boolean
}

// Simulated API functions
const fetchOfferDetails = async (id: string): Promise<OfferDetails> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
        id,
        projectName: "Smart City Infrastructure Development",
        createdDate: "2023-06-15",
        closeRegistrationDate: "2023-07-15",
        overview:
        "This project aims to develop a comprehensive smart city infrastructure, including IoT sensors, data analytics platforms, and integrated city management systems.",
        attachmentUrl: "/path/to/project-details.pdf",
        registrationDate: "2023-06-20",
        winningCompany: "TechInnovate Solutions",
        isClosed: true,
    }
}

const fetchNegotiationHistory = async (offerId: string): Promise<NegotiationEntry[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
        {
            id: "nego-1",
            submitDate: "2024-01-20",
            attachmentUrl: "/path/to/attachment-1.pdf",
            totalAmount: 600000,
            revisionNo: 1,
            status: "On Review",
            comment: "Initial proposal",
            final: false,
        },
        {
            id: "nego-2",
            submitDate: "2024-01-25",
            attachmentUrl: "/path/to/attachment-2.pdf",
            totalAmount: 650000,
            revisionNo: 2,
            status: "Revision",
            comment: "Revised proposal after feedback",
            final: false,
        },
        {
            id: "nego-3",
            submitDate: "2024-01-30",
            attachmentUrl: null,
            totalAmount: 700000,
            revisionNo: 3,
            status: "Revision",
            comment: "SSS approved the proposal",
            final: false,
        },
        {
            id: "nego-4",
            submitDate: "2024-02-05",
            attachmentUrl: "/path/to/attachment-4.pdf",
            totalAmount: 750000,
            revisionNo: 4,
            status: "On Review",
            comment: "SSS accepted the proposal",
            final: false,
        },
        {
            id: "nego-5",
            submitDate: "2024-02-10",
            attachmentUrl: "/path/to/attachment-5.pdf",
            totalAmount: 800000,
            revisionNo: 5,
            status: "Accepted",
            comment: "Final proposal",
            final: true,
        },
    ]
}

const SupplierNegotiation: React.FC = () => {
    const [offerDetails, setOfferDetails] = useState<OfferDetails | null>(null)
    const [negotiationHistory, setNegotiationHistory] = useState<NegotiationEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [file, setFile] = useState<File | null>(null)
    const [totalAmount, setTotalAmount] = useState<string>("")
    const [isFinal, setIsFinal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [details, history] = await Promise.all([
                    fetchOfferDetails("1"), // In a real app, you'd get the ID from the route params
                    fetchNegotiationHistory("1"),
                ])
                setOfferDetails(details)
                setNegotiationHistory(history)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Failed to load negotiation details")
            } finally {
                setIsLoading(false)
        }
        }

        loadData()
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0])
        }
    }

    const handleSubmit = async () => {
        if (!totalAmount && !file) {
            toast.error("Please provide either a total amount or a file.")
            return
        }

        const result = await Swal.fire({
            title: "Confirm Submission",
            text: "Are you sure you want to submit this proposal?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, submit it!",
        })

        if (result.isConfirmed) {
            // Simulated API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            toast.success("Proposal submitted successfully!")
            setFile(null)
            setTotalAmount("")
            setIsFinal(false)
            // In a real app, you'd update the negotiation history here
        }
    }

    const paginatedHistory = negotiationHistory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    if (isLoading) {
        return <Loader />
    }

    if (!offerDetails) {
        return <div className="text-center py-10">No offer details found.</div>
    }

    return (
        <>
            <Breadcrumb
                isSubMenu={true}
                pageName="Negotiation Details"
                parentMenu={{ name: "Followed Offers", link: "/offers/followed" }}
            />
            <ToastContainer position="top-right" />
            <div className="container">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="p-4 md:p-4 lg:p-6 space-y-6">
                        <h1 className="text-3xl font-bold text-primary mb-4">{offerDetails.projectName}</h1>
                        <div className="flex flex-wrap mb-4">
                            <div className="w-full md:w-1/3 flex items-center mb-2">
                                <FiCalendar className="text-gray-500 mr-2" />
                                <span className="text-gray-600">Created: {offerDetails.createdDate}</span>
                            </div>
                            <div className="w-full md:w-1/3 flex items-center mb-2">
                                <FiClock className="text-gray-500 mr-2" />
                                <span className="text-gray-600">Close Registration: {offerDetails.closeRegistrationDate}</span>
                            </div>
                            <div className="w-full md:w-1/3 flex items-center mb-2">
                                <FiCalendar className="text-gray-500 mr-2" />
                                <span className="text-gray-600">Registration Date: {offerDetails.registrationDate}</span>
                            </div>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Overview</h2>
                            <p className="text-gray-600">{offerDetails.overview}</p>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Project Details</h2>
                            <Button
                                onClick={() => window.open(offerDetails.attachmentUrl, "_blank")}
                                title="Download PDF"
                                icon={FiDownload}
                            />
                        </div>
                    </div>
                </div>

                {offerDetails.isClosed && offerDetails.winningCompany && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
                        <p className="font-bold">Tender Closed</p>
                        <p>The winning company for this tender is: {offerDetails.winningCompany}</p>
                    </div>
                )}

                {!offerDetails.isClosed && (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-4 md:p-4 lg:p-6 space-y-6">
                            <h2 className="text-2xl font-bold text-primary mb-4">Submit Proposal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary">Upload File (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="mt-2 block w-full text-sm text-primary
                                        file:mr-4 file:py-2 file:px-4 file:border-0
                                        file:text-md file:font-medium
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-blue-100 border border-secondary rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary">Total Amount</label>
                                    <input
                                        type="number"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        className="mt-2 block w-full text-sm text-primary border border-secondary rounded-md p-2"
                                    />
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
                                disabled={negotiationHistory.length >= 5}
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
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
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
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">
                                            Comment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paginatedHistory.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-center whitespace-nowrap">{entry.submitDate}</td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {entry.attachmentUrl ? (
                                                    <a
                                                        href={entry.attachmentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        View Attachment
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                {entry.totalAmount.toLocaleString()}
                                                <div className="inline-block ml-4">IDR</div>
                                            </td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">{entry.revisionNo}</td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 rounded ${entry.status === "Accepted"
                                                        ? "bg-green-200 text-green-800"
                                                        : entry.status === "Declined"
                                                            ? "bg-red-200 text-red-800"
                                                            : entry.status === "On Review"
                                                                ? "bg-yellow-200 text-yellow-800"
                                                                : "bg-blue-200 text-blue-800"
                                                        }`}
                                                >
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-center whitespace-nowrap">{entry.comment || "No comment"}</td>
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

