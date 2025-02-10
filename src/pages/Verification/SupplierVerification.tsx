"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaEdit } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import Button from "../../components/Forms/Button"
import Loader from "../../common/Loader"

type VerificationStatus = "null" | "verified" | "verified-edited" | "edited-completed" | "edited-not-completed" | "pending-verification"

// Dummy data for initial render
const initialVerificationHistory = [
    { date: "2023-05-15", status: "Approved", message: "All documents verified successfully." },
    { date: "2023-03-10", status: "Rejected", message: "Missing tax identification number." },
    { date: "2023-01-22", status: "Pending", message: "Verification in progress." },
]

const Verification: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("null")
    const [verificationHistory, setVerificationHistory] = useState(initialVerificationHistory)

    useEffect(() => {
        // Simulating API call to fetch verification status
        const fetchVerificationStatus = async () => {
        // This would be replaced with an actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Simulating different statuses for demonstration
        const statuses: VerificationStatus[] = [
            "null",
            "verified",
            "verified-edited",
            "edited-completed",
            "edited-not-completed",
            "pending-verification",
        ]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        setVerificationStatus(randomStatus)
        }

        fetchVerificationStatus()
    }, [])

    const handleVerificationRequest = async () => {
        // This would be replaced with an actual API call to submit verification request
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast.success("Verification request submitted successfully!")
        setVerificationHistory((prevHistory) => [
            { date: new Date().toISOString().split("T")[0], status: "Pending", message: "Verification request submitted." },
            ...prevHistory,
        ])
        setVerificationStatus("null") // Reset status after submission
    }

    const renderStatusMessage = () => {
        switch (verificationStatus) {
            case "null":
                return (
                    <div className="flex items-center text-yellow-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Please complete your company profile before requesting verification.</span>
                    </div>
                )
            case "verified":
                return (
                    <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <span>Your company profile is verified.</span>
                    </div>
                )
            case "verified-edited":
                return (
                    <div className="flex items-center text-yellow-600">
                        <FaEdit className="mr-2" />
                        <span>Your data has changed. Please request re-verification.</span>
                    </div>
                )
            case "edited-completed":
                return (
                    <div className="flex items-center text-blue-600">
                        <FaEdit className="mr-2" />
                        <span>Your profile has been updated. You can now request verification.</span>
                    </div>
                )
            case "edited-not-completed":
                return (
                    <div className="flex items-center text-yellow-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Please complete your company profile before requesting verification.</span>
                    </div>
                )
            case "pending-verification":
                return (
                    <div className="flex items-center text-blue-600">
                        <FaClock className="mr-2" />
                        <span>Under verification, please wait.</span>
                    </div>
                )
        default:
            return null
        }
    }

    const isVerificationButtonDisabled =
        verificationStatus === "null" || verificationStatus === "verified" || verificationStatus === "edited-not-completed" || verificationStatus === "pending-verification"

    const buttonTitle =
        verificationStatus === "verified-edited"
        ? "Request Re-verification"
        : verificationStatus === "pending-verification"
        ? "Under Verification"
        : "Request Verification"

    if(!verificationHistory)
        return (
            <Loader />
        )

    return (
        <>
            <Breadcrumb pageName="Verification" />
            <ToastContainer position="top-right" />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden text-primary">
                <div className="p-6 sm:p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
                        {renderStatusMessage()}
                    </div>

                    <div className="mb-8">
                        <Button
                        onClick={handleVerificationRequest}
                        disabled={isVerificationButtonDisabled}
                        title={buttonTitle}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Verification History</h2>
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
                                {verificationHistory.map((entry, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="py-2 px-4">{entry.date}</td>
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
                                        <td className="py-2 px-4">{entry.message}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Verification

