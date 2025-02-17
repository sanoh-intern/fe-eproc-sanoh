"use client"

import React, { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../../components/Forms/Button"
import Pagination from "../../../../components/Table/Pagination"
import Loader from "../../../../common/Loader"
import Swal from "sweetalert2"
import OffersDetails from "../../../../components/OffersDetail"
import fetchOfferDetails, { TypeOfferDetails } from "../../../../api/Offers/OfferDetails"
import FetchCompanyData, { TypeCompanyData } from "../../../../api/Data/CompanyData"
import CompanyDetails from "../../../../components/CompanyDetails"

interface SupplierProposal {
    id: string
    submitDate: string
    totalAmount: number
    revisionNo: number
    status: "On Review" | "Accepted" | "Declined"
    comment: string | null
}

interface RegisteredSupplier {
    id: string
    companyName: string
    bpcode: string
    registrationDate: string
}

const fetchRegisteredSuppliers = async (offerId: string): Promise<RegisteredSupplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return [{
            id: "1",
            companyName: "Global Tech Ltd",
            bpcode: "BP1001",
            registrationDate: "2023-05-29"
    }]
}

const fetchSupplierProposals = async (offerId: string): Promise<SupplierProposal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return [
        {
            id: "prop-1",
            submitDate: "2024-01-10 10:00",
            totalAmount: 500000,
            revisionNo: 1,
            status: "On Review",
            comment: "Initial proposal",
        },
        {
            id: "prop-2",
            submitDate: "2024-01-15 14:30",
            totalAmount: 550000,
            revisionNo: 2,
            status: "Declined",
            comment: "Declined by admin because of pricing issue",
        },
    ]
}

const AdminNegotiation: React.FC = () => {
    const [registeredSuppliers, setRegisteredSuppliers] = useState<RegisteredSupplier[]>([])
    const [proposals, setProposals] = useState<SupplierProposal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [offerDetails, setOfferDetails] = useState<TypeOfferDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null);


    useEffect(() => {
        const loadData = async () => {
            try {
                const [offerdata] = await Promise.all([fetchOfferDetails("1")])
                setOfferDetails(offerdata)

                const suppliers = await fetchRegisteredSuppliers("offer-1")
                setRegisteredSuppliers(suppliers)

                const proposalData = await fetchSupplierProposals("offer-1")
                setProposals(proposalData)
            } catch (error) {
                toast.error("Failed to load negotiation details.")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const handleProposalAction = async (
        proposalId: string,
        action: "Accepted" | "Declined" | "Revision"
    ) => {
        const selectedProposal = proposals.find((p) => p.id === proposalId)
        if (!selectedProposal) return

        if (action === "Revision") {
            // Show sweetalert prompt for comment
            const { value: comment } = await Swal.fire({
                title: "Revision Required",
                input: "text",
                inputLabel: "Please provide a revision comment",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
            })

            if (comment === undefined) {
                // The user canceled
                return
            }
            // In real usage, you'd send the comment via API
            toast.success(`Revision request submitted with comment: ${comment}`)
            return
        }

        // For Accept / Decline
        const result = await Swal.fire({
            title: `Confirm ${action}`,
            text: `Are you sure you want to mark this proposal as ${action}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed!",
        })

        if (result.isConfirmed) {
            // In real usage, you'd send an API request
            setProposals((prev) =>
                prev.map((p) =>
                p.id === proposalId ? { ...p, status: action, comment: action === "Declined" ? "Declined by admin" : p.comment } : p
                )
            )
            toast.success(`Proposal has been ${action}`)
        }
    }

    if (isLoading) {
        return <Loader />
    }

    const paginatedProposals = proposals.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handeclick = async () => {
        setIsModalOpen(true)
        try {
            const data = await FetchCompanyData("1")
            setCompanyData(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Breadcrumb pageName="Negotiation Detail" isSubMenu={true} parentMenu={{name: "Registered Offers", link: "/offers/registered"}}/>
            <ToastContainer position="top-right" />

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
                                    {registeredSuppliers.map((supplier) => (
                                        <div key={supplier.bpcode} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Company Name</p>
                                                    <p className="font-medium">{supplier.companyName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">BP Code</p>
                                                    <p className="font-medium">{supplier.bpcode}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Registration Date</p>
                                                    <p className="font-medium">{supplier.registrationDate}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button
                                                        title="View Details"
                                                        onClick={handeclick}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isModalOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center z-999 overflow-y-auto">
                                            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
                                            <div className="bg-white p-4 rounded shadow relative z-10 max-w-7xl w-full mx-4 my-8">
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
                                                Total Amount
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Revision No
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Status
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Comment
                                            </th>
                                            <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase text-center border-b">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {paginatedProposals.map((proposal) => (
                                            <tr key={proposal.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-center">{proposal.submitDate}</td>
                                                <td className="px-3 py-3 text-center">
                                                    <span className="mr-2 border rounded-sm border-gray-300 px-1">IDR</span>
                                                    <span>{Number(proposal.totalAmount).toLocaleString('id-ID')}</span>
                                                </td>
                                                <td className="px-3 py-3 text-center">{proposal.revisionNo}</td>
                                                <td className="px-3 py-3 text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full ${
                                                        proposal.status === "On Review"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : proposal.status === "Accepted"
                                                            ? "bg-green-200 text-green-800"
                                                            : "bg-red-200 text-red-800"
                                                        }`}
                                                    >
                                                        {proposal.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    {proposal.comment || "No comment"}
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    {proposal.status === "On Review" && (
                                                        <div className="flex justify-center space-x-2">
                                                            <Button
                                                                color="bg-green-600"
                                                                title="Accept"
                                                                onClick={() => handleProposalAction(proposal.id, "Accepted")}
                                                            />
                                                            <Button
                                                                color="bg-yellow-600"
                                                                title="Revision"
                                                                onClick={() => handleProposalAction(proposal.id, "Revision")}
                                                            />
                                                            <Button
                                                                color="bg-red-600"
                                                                title="Decline"
                                                                onClick={() => handleProposalAction(proposal.id, "Declined")}
                                                            />
                                                        </div>
                                                    )}
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