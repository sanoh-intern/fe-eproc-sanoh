"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    FaBell,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaUserEdit,
    FaBuilding,
    FaFileAlt,
    FaDownload,
    FaBullhorn,
} from "react-icons/fa"
import Button2 from "../../../../components/Forms/Button2"
import Loader from "../../../../common/Loader"
import { getMiniProfile, type MiniProfileData } from "../../../../api/Action/Supplier/supplier-actions"
import { toast } from "react-toastify"

// Card Component
interface CardProps {
    children: React.ReactNode
    className?: string
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return <div className={`bg-white shadow-sm rounded-xl border border-gray-200 p-6 ${className}`}>{children}</div>
}
const SupplierDashboard: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [documents, setDocuments] = useState<any[]>([])
    const [miniProfile, setMiniProfile] = useState<MiniProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMiniProfile = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                const result = await getMiniProfile()
                  if (result.success && result.data) {
                    setMiniProfile(result.data)
                    // Set verification status based on profile_verified_at
                    // If profile_verified_at is null, it means not verified yet
                    if (result.data.profile_verified_at === null) {
                        setVerificationStatus("not_verified")
                    } else {
                        setVerificationStatus("verified")
                    }
                } else {
                    setError(result.message)
                    toast.error(result.message)
                }
            } catch (err) {
                const errorMessage = "Failed to load profile data"
                setError(errorMessage)
                toast.error(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }        // Fetch mini profile data
        fetchMiniProfile()

        // Mock data for other sections (replace with actual API calls later)
        setAnnouncements([
            {
                id: 1,
                title: "New Tender Opening",
                message: "New tender for IT Equipment has been opened",
                date: "2024-02-07",
            },
            { 
                id: 2, 
                title: "System Maintenance", 
                message: "Scheduled maintenance on February 10th", 
                date: "2024-02-06" 
            },
            { 
                id: 3, 
                title: "System Maintenance", 
                message: "Scheduled maintenance on February 10th", 
                date: "2024-02-06" 
            
            },        ])

        // Set documents data

        setDocuments([
            { 
                id: 1, 
                title: "User Manual", 
                description: "Complete guide for using the supplier portal", 
                size: "2.5 MB" 
            },
            {
                id: 2,
                title: "Registration Procedure",
                description: "Step-by-step guide for supplier registration",
                size: "1.8 MB",
            },
            { 
                id: 3, 
                title: "Terms and Conditions", 
                description: "Legal terms and conditions document", 
                size: "1.2 MB" 
            },
        ])
    }, [])

    // Update notifications based on verification status
    useEffect(() => {
        const baseNotifications = [
            { id: 2, message: "Document submission deadline approaching", type: "info" },
            { id: 3, message: "New tender opportunities available", type: "success" },
            { id: 4, message: "System maintenance scheduled for next week", type: "info" },
        ]

        let updatedNotifications = [...baseNotifications]

        if (verificationStatus === "not_verified") {
            updatedNotifications.unshift({
                id: 1,
                message: "Company profile is not verified. Please complete your profile.",
                type: "warning"
            })
        } else if (verificationStatus === "pending") {
            updatedNotifications.unshift({
                id: 1,
                message: "Company profile verification is under review.",
                type: "info"
            })
        }

        setNotifications(updatedNotifications)
    }, [verificationStatus])

    const renderVerificationStatus = () => {
        switch (verificationStatus) {
            case "verified":
                return (
                    <div className="flex items-center text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                        <FaCheckCircle className="mr-2" />
                        <span>Verified</span>
                    </div>
                )
            case "pending":
                return (
                    <div className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg">
                        <FaClock className="mr-2" />
                        <span>Verification Under Review</span>
                    </div>
                )
            case "not_verified":
            default:
                return (
                    <div className="flex items-center text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                        <FaExclamationTriangle className="mr-2" />
                        <span>Not Verified</span>
                    </div>
                )
        }
    }

    const CompanyProfileImage = () => {
        // Since API doesn't provide profile image, we'll use a default building icon
        return (
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaBuilding className="w-12 h-12 text-gray-400" />
            </div>
        )
    }

    // Show loading state
    if (isLoading) {
        return <Loader />
    }

    // Show error state
    if (error || !miniProfile) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Profile</h2>
                    <p className="text-gray-600 mb-4">{error || "Unable to load profile data"}</p>
                    <Button2 onClick={() => window.location.reload()}>
                        Try Again
                    </Button2>
                </div>
            </div>
        )
    }    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Profile Section */}
            <Card className="lg:col-span-2">
                <div className="flex items-start gap-6">
                    <CompanyProfileImage />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between ">
                            <h2 className="text-2xl font-bold text-primary">{miniProfile.company_name}</h2>
                            {renderVerificationStatus()}
                        </div>
                        <p className="text-secondary mb-2">{miniProfile.tax_id || "-"}</p>
                        <p className="text-primary mb-4">{miniProfile.company_description || "-"}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-secondary">Business Field</h3>
                                <p className="text-primary">{miniProfile.business_field || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary">Sub Business Field</h3>
                                <p className="text-primary">{miniProfile.sub_business_field || "-"}</p>
                            </div>
                        </div>                        {(verificationStatus === "not_verified" || !verificationStatus) && (
                            <Button2 as={Link} to="/company-data" className="mt-4">
                                <FaUserEdit className="mr-2" />
                                Complete Company Profile
                            </Button2>
                        )}
                    </div>
                </div>
            </Card>

            {/* Notifications Card */}
            <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FaBell className="mr-2 text-primary" />
                    Notifications
                </h2>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${
                        notification.type === "warning"
                            ? "bg-yellow-200 text-yellow-800"
                            : notification.type === "info"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                    >
                        <p className="text-sm">{notification.message}</p>
                    </div>
                    ))}
                </div>
            </Card>

            {/* Announcements Section */}
            <Card className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FaBullhorn className="mr-2 text-primary" />
                    Announcements
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {announcements.slice(0, 4).map((announcement) => (
                    <div key={announcement.id} className="border-b border-primary last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-primary">{announcement.title}</h3>
                            <span className="text-sm text-secondary">{announcement.date}</span>
                        </div>
                        <p className="text-secondary text-sm">{announcement.message}</p>
                    </div>
                    ))}
                </div>
            </Card>

            {/* Documents Section */}
            <Card>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <FaFileAlt className="mr-2 text-primary" />
                    Documents & Procedures
                </h2>
                <div className="space-y-4">
                    {documents.map((doc) => (
                    <div key={doc.id} className="group">
                        <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-200 transition-colors">
                        <div>
                            <h3 className="font-medium text-primary mb-1">{doc.title}</h3>
                            <p className="text-sm text-primary">{doc.description}</p>
                            <span className="text-xs text-primary">{doc.size}</span>
                        </div>
                        <Button2 className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaDownload className="w-4 h-4" />
                        </Button2>
                        </div>
                    </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default SupplierDashboard

