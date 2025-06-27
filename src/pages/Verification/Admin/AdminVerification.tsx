"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../components/Forms/Button"
import Loader from "../../../common/Loader"
import CompanyDetails from "../../../components/CompanyDetails"
import { fetchCompanyDataAdmin, TypeCompanyData } from "../../../api/Data/company-data"
import { FaBuilding } from "react-icons/fa"
import fetchVerificationRequests, { TypeVerificationRequest, approveVerification } from "../../../api/Data/Admin/verification-requests"
import fetchCompanyListAdmin, { TypeCompanyListAdmin } from "../../../api/Data/Admin/company-list-admin"

const AdminVerification: React.FC = () => {
    const [verificationRequests, setVerificationRequests] = useState<TypeVerificationRequest[]>([])
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null)
    const [loading, setLoading] = useState(true)
    const [companyModalOpen, setCompanyModalOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false) 
    const [modalData, setModalData] = useState<TypeVerificationRequest | null>(null)
    const [supplierCodeInput, setSupplierCodeInput] = useState("")
    const [declineMessage, setDeclineMessage] = useState("")
    const [actionType, setActionType] = useState<"accept" | "decline" | null>(null)
    
    // New state for company list
    const [companyList, setCompanyList] = useState<TypeCompanyListAdmin[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    // Filter companies - only show verified companies or companies with BP code
    const verifiedCompanies = companyList.filter(company => 
        company.verification_status === "verified" || company.bp_code !== null
    )
    
    const filteredCompanies = verifiedCompanies.filter(company => {
        const matchesSearch = searchQuery === "" || 
            company.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (company.bp_code && company.bp_code.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesStatus = filterStatus === "all" || 
            (filterStatus === "" && company.verification_status === null) ||
            company.verification_status === filterStatus
        
        return matchesSearch && matchesStatus
    })
    
    // Helper function to format status
    const formatStatus = (status: TypeCompanyListAdmin['verification_status']): string => {
        if (!status || typeof status !== 'string') return 'Unknown'
        return status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    }

    // Get unique statuses for the dropdown - handle null values properly
    type ValidStatus = "verified" | "not_verified" | "profile_updated" | "complete_profile" | "under_verification"
    const allStatuses = [...new Set(verifiedCompanies.map(company => company.verification_status))]
    const validStatuses: ValidStatus[] = allStatuses.filter((status): status is ValidStatus => 
        status !== null && typeof status === 'string'
    )
    const hasNullStatus = allStatuses.some(status => status === null)

    const fetchData = async () => {
        try {
            const [requests, companies] = await Promise.all([
                fetchVerificationRequests(),
                fetchCompanyListAdmin()
            ])
            setVerificationRequests(requests)
            setCompanyList(companies)
        } catch (error) {
            toast.error("Failed to load data.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAction = async (request: TypeVerificationRequest, action: "accept" | "decline") => {
        setModalData(request)
        setActionType(action)
        setModalOpen(true)
        setSupplierCodeInput("")
        setDeclineMessage("")
    }

    const handleAcceptSubmit = async () => {
        if (!modalData) return
        
        try {
            if (actionType === "accept") {
                if (!supplierCodeInput.trim()) {
                    toast.error("Please enter a BP code.")
                    return
                }
                await approveVerification(modalData.user_id, {
                    status: "Accepted",
                    bp_code: supplierCodeInput
                })
                toast.success("Verification accepted successfully!")
            } else if (actionType === "decline") {
                if (!declineMessage.trim()) {
                    toast.error("Please enter a decline message.")
                    return
                }
                await approveVerification(modalData.user_id, {
                    status: "Declined",
                    message: declineMessage
                })
                toast.success("Verification declined successfully!")
            }
            
            await fetchData()
            setModalOpen(false)
            setModalData(null)
            setActionType(null)
        } catch (error) {
            toast.error("Failed to process verification.")
        }
    }

    // Example for opening the CompanyDetails modal
    const handleCompanyDetail = async (userId: number) => {
        setCompanyModalOpen(true)
        try {
            const data = await fetchCompanyDataAdmin(userId.toString())
            setCompanyData(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load company details.")
        }
    }

    const DetailModal = () => {
        if (!modalData) return null
        
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
                <div className="bg-white p-4 rounded shadow relative max-w-xl w-full mx-4 my-8">
                    <Button
                        title="Close"
                        onClick={() => {
                            setModalOpen(false)
                            setModalData(null)
                            setActionType(null)
                        }}
                        color="bg-red-500 text-white"
                        className="absolute top-2 right-2"
                    />
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">Request Detail</h2>
                        <p>
                            <strong>Company Name:</strong> {modalData.comapany_name}
                        </p>
                        <p>
                            <strong>Tax ID:</strong> {modalData.tax_id}
                        </p>
                        <p>
                            <strong>Request Date:</strong> {modalData.request_date}
                        </p>
                    </div>
                    {actionType === "accept" ? (
                        <div>
                            <label className="block text-base font-bold mb-2">BP Code</label>
                            <input
                                type="text"
                                value={supplierCodeInput}
                                onChange={(e) => setSupplierCodeInput(e.target.value)}
                                className="w-full p-2 border rounded border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-base font-bold mb-2">Decline Message</label>
                            <textarea
                                value={declineMessage}
                                onChange={(e) => setDeclineMessage(e.target.value)}
                                className="w-full p-2 border rounded border-primary focus:outline-none focus:ring-2 focus:ring-primary h-24"
                                autoFocus
                                placeholder="Enter reason for declining..."
                            />
                        </div>
                    )}
                    <div className="mt-4 flex justify-end gap-3">
                        <Button 
                            title="Cancel" 
                            onClick={() => {
                                setModalOpen(false)
                                setModalData(null)
                                setActionType(null)
                            }} 
                            color="bg-red-600"
                        />
                        <Button 
                            title={actionType === "accept" ? "Accept" : "Decline"} 
                            onClick={handleAcceptSubmit} 
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (loading) return <Loader />

    return (
        <>
            <Breadcrumb pageName="Verification" />
            {/* Verification Requests Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden text-primary mb-8">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4">Verification Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Request Date</th>
                                    <th className="py-2 px-4 text-left">Company Name</th>
                                    <th className="py-2 px-4 text-left">Tax ID</th>
                                    <th className="py-2 px-4 text-left">Detail</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationRequests.map((req, index) => (
                                <tr key={req.verification_id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="py-2 px-4">{req.request_date}</td>
                                    <td className="py-2 px-4">{req.comapany_name}</td>
                                    <td className="py-2 px-4">{req.tax_id}</td>
                                    <td className="py-2 px-4">
                                        <Button title="View Company Detail" onClick={() => handleCompanyDetail(req.user_id)} icon={FaBuilding} />
                                    </td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <Button
                                            title="Accept"
                                            onClick={() => handleAction(req, "accept")}
                                            className="bg-green-600"
                                        />
                                        <Button
                                            title="Decline"
                                            onClick={() => handleAction(req, "decline")}
                                            className="bg-red-600"
                                        />
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                        {companyModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-999 overflow-y-auto">
                            <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => setCompanyModalOpen(false)}
                            ></div>
                            <div className="bg-white p-4 rounded shadow relative z-10 max-w-7xl w-full mx-4 my-8">
                                <Button
                                    title="Close"
                                    onClick={() => setCompanyModalOpen(false)}
                                    className="bg-red-500 text-white absolute top-2 right-2"
                                />
                                <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                                    <CompanyDetails companyData={companyData} />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List of Companies Section */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden text-primary">
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4">Verified Companies</h2>
                    <p className="text-gray-600 mb-4">List of companies that have been verified or have a BP code assigned.</p>
                    <div className="mb-4 flex justify-between flex-col md:flex-row gap-4">
                        <div className="w-full lg:w-1/2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Company Name or BP Code"
                                className="w-full p-2 border rounded border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="w-full lg:w-1/4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full p-2 border rounded border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Statuses</option>
                                {validStatuses.map(status => (
                                    <option key={status} value={status}>
                                        {formatStatus(status)}
                                    </option>
                                ))}
                                {hasNullStatus && (
                                    <option key="null-status" value="">
                                        Unknown Status
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Company Name</th>
                                    <th className="py-2 px-4 text-left">BP Code</th>
                                    <th className="py-2 px-4 text-left">Verification Status</th>
                                    <th className="py-2 px-4 text-left">Verified At</th>
                                    <th className="py-2 px-4 text-left">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.length > 0 ? (
                                    filteredCompanies.map((comp, idx) => (
                                    <tr key={comp.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="py-2 px-4">{comp.supplier_name}</td>
                                        <td className="py-2 px-4">{comp.bp_code || '-'}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                comp.verification_status === 'verified' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : comp.verification_status === 'under_verification'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {formatStatus(comp.verification_status)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">{comp.verified_at ? new Date(comp.verified_at).toLocaleDateString() : '-'}</td>
                                        <td className="py-2 px-4">
                                            <Button 
                                                title="View Detail"
                                                onClick={() => handleCompanyDetail(comp.user_id)} 
                                            />
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                                            {searchQuery || filterStatus !== "all" 
                                                ? "No companies found matching your criteria." 
                                                : "No verified companies or companies with BP codes found."
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        {modalOpen && <DetailModal />}
        </>
    )
}

export default AdminVerification