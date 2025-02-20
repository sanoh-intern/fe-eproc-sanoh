"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../components/Forms/Button"
import Loader from "../../../common/Loader"
import CompanyDetails from "../../../components/CompanyDetails"
import FetchCompanyData,{ TypeCompanyData } from "../../../api/Data/company-data"
import SearchBar from "../../../components/Table/SearchBar"
import Select from "react-select"

type VerificationRequest = {
    id: string
    date: string
    companyName: string
    npwp: string
}

type Company = {
    id: string
    companyName: string
    supplierCode: string
    status:
        | "null"
        | "verified"
        | "verified-edited"
        | "edited-completed"
        | "edited-not-completed"
        | "pending-verification"
    verifiedAt: string
}

// Dummy data
const initialVerificationRequests: VerificationRequest[] = [
    { id: "1", date: "2023-05-15", companyName: "PT. ALPHA", npwp: "1234567890" },
    { id: "2", date: "2023-03-10", companyName: "CV. BETA", npwp: "0987654321" },
]

const initialCompanies: Company[] = [
    {
        id: "1",
        companyName: "PT. ALPHA",
        supplierCode: "ALPHA001",
        status: "null",
        verifiedAt: "2023-05-16",
    },
    {
        id: "2",
        companyName: "CV. BETA",
        supplierCode: "BETA002",
        status: "verified",
        verifiedAt: "2023-03-12",
    },
]

const AdminVerification: React.FC = () => {
    const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(
        initialVerificationRequests
    )
    const [listCompanies, setListCompanies] = useState<Company[]>(initialCompanies)
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [companyModalOpen, setCompanyModalOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false) 
    const [modalData, setModalData] = useState<Company | VerificationRequest | null>(null)
    const [supplierCodeInput, setSupplierCodeInput] = useState("")

    const fetchData = async () => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setVerificationRequests(initialVerificationRequests)
        setListCompanies(initialCompanies)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAction = async (request: VerificationRequest, action: "accept" | "decline") => {
        if (action === "accept") {
            setModalData(request)
            setModalOpen(true)
        } else {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500)) // Dummy
                toast.success("Verification declined successfully!")
                await fetchData()
            } catch (error) {
                toast.error("Failed to decline verification.")
            }
        }
    }

    const handleAcceptSubmit = async (supplierCodeInput: string) => {
        if (!supplierCodeInput.trim()) {
            toast.error("Please enter a new supplier code.")
            return
        }
        if (modalData && "id" in modalData) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500)) // Dummy
                toast.success("Verification accepted successfully!")
                await fetchData()
            } catch (error) {
                toast.error("Failed to accept verification.")
            }
            setModalOpen(false)
            setModalData(null)
        }
    }

    const filteredCompanies = listCompanies.filter((company) => {
        const term = searchQuery.toLowerCase()
        const matchTerm =
        company.companyName.toLowerCase().includes(term) ||
        company.supplierCode.toLowerCase().includes(term)
        const matchStatus = filterStatus ? company.status === filterStatus : true
        return matchTerm && matchStatus
    })

    // Example for opening the CompanyDetails modal
    const handleCompanyDetail = async (id: string) => {
        setCompanyModalOpen(true)
        try {
            const data = await FetchCompanyData(id)
            setCompanyData(data)
        } catch (error) {
            console.error(error)
        }
    }

    const DetailModal = () => {
        if (!modalData) return null
        const isRequest = (data: Company | VerificationRequest): data is VerificationRequest =>
        (data as VerificationRequest).npwp !== undefined
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
                <div className="bg-white p-4 rounded shadow relative max-w-xl w-full mx-4 my-8">
                    <Button
                        title="Close"
                        onClick={() => {
                            setModalOpen(false)
                            setModalData(null)
                        }}
                        color="bg-red-500 text-white"
                        className="absolute top-2 right-2"
                    />
                    {isRequest(modalData) ? (
                        <>
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-2">Request Detail</h2>
                                <p>
                                    <strong>Company Name:</strong> {modalData.companyName}
                                </p>
                                <p>
                                    <strong>NPWP:</strong> {modalData.npwp}
                                </p>
                                <p>
                                    <strong>Request Date:</strong> {modalData.date}
                                </p>
                            </div>
                            <div>
                                <label className="block text-base font-bold mb-2">New Supplier Code</label>
                                <input
                                    type="text"
                                    value={supplierCodeInput}
                                    onChange={(e) => setSupplierCodeInput(e.target.value)}
                                    className="w-full p-2 border rounded border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <Button 
                                    title="Cancel" 
                                    onClick={() => setModalOpen(false)} 
                                    color="bg-red-600"
                                />
                                <Button 
                                    title="Accepted" 
                                    onClick={() => handleAcceptSubmit(supplierCodeInput)} 
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold mb-2">Company Detail</h2>
                            <p>
                                <strong>Company Name:</strong> {(modalData as Company).companyName}
                            </p>
                            <p>
                                <strong>Supplier Code:</strong> {(modalData as Company).supplierCode}
                            </p>
                            <p>
                                <strong>Status:</strong> {(modalData as Company).status}
                            </p>
                            <p>
                                <strong>Verified At:</strong> {(modalData as Company).verifiedAt}
                            </p>
                        </>
                    )}
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
                                    <th className="py-2 px-4 text-left">NPWP</th>
                                    <th className="py-2 px-4 text-left">Detail</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationRequests.map((req, index) => (
                                <tr key={req.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="py-2 px-4">{req.date}</td>
                                    <td className="py-2 px-4">{req.companyName}</td>
                                    <td className="py-2 px-4">{req.npwp}</td>
                                    <td className="py-2 px-4">
                                        <Button title="View Detail" onClick={() => handleCompanyDetail(req.id)} />
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
                    <h2 className="text-xl font-semibold mb-4">List of Companies</h2>
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full lg:w-1/2">
                            <SearchBar
                                onSearchChange={setSearchQuery}
                                placeholder="Search Company Name or Supplier Code"
                            />
                        </div>
                        <div className="w-full lg:w-1/4">
                            <Select
                                options={[
                                    { value: "all", label: "All Statuses" },
                                    ...[...new Set(listCompanies.map((company) => company.status))].map(
                                        (status) => ({
                                            value: status,
                                            label: status,
                                        })
                                    ),
                                ]}
                                value={
                                    filterStatus
                                        ? {
                                            value: filterStatus,
                                            label: filterStatus === "all" ? "All Statuses" : filterStatus,
                                        }
                                        : null
                                }
                                onChange={(option: any) => setFilterStatus(option.value)}
                                placeholder="Filter by Verification Status"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Company Name (PT)</th>
                                    <th className="py-2 px-4 text-left">Supplier Code</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                    <th className="py-2 px-4 text-left">Verified At</th>
                                    <th className="py-2 px-4 text-left">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.map((comp, idx) => (
                                <tr key={comp.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="py-2 px-4">{comp.companyName}</td>
                                    <td className="py-2 px-4">{comp.supplierCode}</td>
                                    <td className="py-2 px-4">{comp.status}</td>
                                    <td className="py-2 px-4">{comp.verifiedAt}</td>
                                    <td className="py-2 px-4">
                                        <Button 
                                            title="View Detail"
                                            onClick={() => handleCompanyDetail(comp.id)} 
                                        />
                                    </td>
                                </tr>
                                ))}
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