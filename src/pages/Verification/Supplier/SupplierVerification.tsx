"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaEdit } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../components/Forms/Button"
import Loader from "../../../common/Loader"
import Swal from "sweetalert2"
import { 
    API_Status_Verification_Supplier, 
    API_Request_Verification_Supplier, 
    API_History_Verification_Supplier 
} from "../../../api/route-api"

// Updated type to match the 5 verification statuses from API
type VerificationStatus = "not_verified" | "verified" | "profile_updated" | "complete_profile" | "under_verification"

interface VerificationStatusResponse {
    verification_status: string
    updated_at: string
}

interface HistoryItem {
    verification_id: number
    request_date: string
    status: string
    message: string | null
}

interface HistoryResponse {
    status: boolean
    message: string
    data: HistoryItem[]
}

const SupplierVerification: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
    const [verificationHistory, setVerificationHistory] = useState<HistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<string>("")

    // Fetch verification status on component mount
    useEffect(() => {
        fetchVerificationStatus()
        fetchVerificationHistory()
    }, [])

    const fetchVerificationStatus = async () => {
        try {
            const response = await fetch(API_Status_Verification_Supplier(), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                    'Content-Type': 'application/json',
                }
            })

            const result: VerificationStatusResponse = await response.json()
            
            if (response.ok) {
                // Map API status to our internal status types
                setVerificationStatus(result.verification_status as VerificationStatus)
                setLastUpdated(result.updated_at)
            } else {
                toast.error('Failed to fetch verification status')
            }
        } catch (error) {
            console.error('Error fetching verification status:', error)
            toast.error('An error occurred while fetching verification status')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchVerificationHistory = async () => {
        try {
            const response = await fetch(API_History_Verification_Supplier(), {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                    'Content-Type': 'application/json',
                }
            })

            const result: HistoryResponse = await response.json()
            
            if (response.ok && result.status) {
                setVerificationHistory(result.data || [])
            } else {
                console.error('Failed to fetch verification history:', result.message)
            }
        } catch (error) {
            console.error('Error fetching verification history:', error)
        }
    }

    const handleVerificationRequest = async () => {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            title: 'Request Verification',
            text: 'Are you sure you want to request verification?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Request Verification',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        })

        if (!confirmResult.isConfirmed) {
            return
        }

        setIsSubmitting(true)
        
        try {
            const response = await fetch(API_Request_Verification_Supplier(), {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                    'Content-Type': 'application/json',
                }
            })

            const result = await response.json()
            
            if (response.ok && result.status) {
                toast.success(result.message || 'Verification request submitted successfully!')
                
                // Refresh both status and history
                await fetchVerificationStatus()
                await fetchVerificationHistory()
            } else {
                toast.error(result.message || 'Failed to submit verification request')
            }
        } catch (error) {
            console.error('Error submitting verification request:', error)
            toast.error('An error occurred while submitting verification request')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStatusMessage = () => {
        switch (verificationStatus) {
            case "not_verified":
                return (
                    <div className="flex items-center text-yellow-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Your profile has not been verified yet. Please request verification.</span>
                    </div>
                )
            case "verified":
                return (
                    <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span>Your company profile is verified.</span>
                    </div>
                )
            case "profile_updated":
                return (
                    <div className="flex items-center text-yellow-600">
                        <FaEdit className="mr-2" />
                        <span>Your profile has been updated. Please request re-verification.</span>
                    </div>
                )
            case "complete_profile":
                return (
                    <div className="flex items-center text-orange-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Please complete your company profile before requesting verification.</span>
                    </div>
                )
            case "under_verification":
                return (
                    <div className="flex items-center text-blue-600">
                        <FaClock className="mr-2" />
                        <span>Under verification, please wait.</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        <span>Loading verification status...</span>
                    </div>
                )
        }
    }

    // Button is enabled only for not_verified and profile_updated statuses
    const isVerificationButtonDisabled = 
        verificationStatus === "verified" || 
        verificationStatus === "complete_profile" || 
        verificationStatus === "under_verification" ||
        isSubmitting

    const getButtonTitle = () => {
        if (isSubmitting) return "Submitting..."
        
        switch (verificationStatus) {
            case "profile_updated":
                return "Request Re-verification"
            case "under_verification":
                return "Under Verification"
            case "verified":
                return "Already Verified"
            case "complete_profile":
                return "Complete Profile First"
            default:
                return "Request Verification"
        }
    }

    // Show loading state
    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            <Breadcrumb pageName="Verification" />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden text-primary">
                <div className="p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
                        {renderStatusMessage()}
                        {lastUpdated && (
                            <p className="text-sm text-gray-500 mt-2">
                                Last updated: {new Date(lastUpdated).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <Button
                            onClick={handleVerificationRequest}
                            disabled={isVerificationButtonDisabled}
                            title={getButtonTitle()}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Verification History</h2>
                        {verificationHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 text-left">Date</th>
                                            <th className="py-2 px-4 text-left">Status</th>
                                            <th className="py-2 px-4 text-left">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verificationHistory.map((entry) => (
                                            <tr key={entry.verification_id} className="border-t">
                                                <td className="py-2 px-4">{entry.request_date}</td>
                                                <td className="py-2 px-4">
                                                    <span
                                                        className={`inline-flex items-center ${
                                                            entry.status === "Approved"
                                                                ? "text-green-600"
                                                                : entry.status === "Rejected"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                        }`}
                                                    >
                                                        {entry.status === "Approved" && <FaCheckCircle className="mr-1" />}
                                                        {entry.status === "Rejected" && <FaExclamationTriangle className="mr-1" />}
                                                        {entry.status === "Pending" && <FaClock className="mr-1" />}
                                                        {entry.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-4">{entry.message || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FaClock className="mx-auto mb-2 text-2xl" />
                                <p>No verification history found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SupplierVerification

