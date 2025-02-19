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

    const companyData = {
        name: "PT. Sanoh Indonesia",
        npwp: "01.123.456.7-123.456",
        description: "Perusahaan yang bergerak di bidang otomotif",
        field: "IT & Technology",
        subFields: ["Software Development", "Hardware Supply"],
        profileImage: "",
    }

    useEffect(() => {
        // Fetch data from API or local storage
        const storedStatus = localStorage.getItem("isVerified")
        setVerificationStatus(storedStatus)

        // Mock data
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
            
            },
        ])

        setNotifications([
            { id: 1, message: "Your profile verification is pending review", type: "warning" },
            { id: 2, message: "Document submission deadline approaching", type: "info" },
            { id: 1, message: "Your profile verification is pending review", type: "success" },
            { id: 1, message: "Your profile verification is pending review", type: "success" },
            { id: 1, message: "Your profile verification is pending review", type: "success" },
            { id: 1, message: "Your profile verification is pending review", type: "success" },
        ])

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

    const renderVerificationStatus = () => {
        switch (verificationStatus) {
            case "verified":
                return (
                    <div className="flex items-center text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                        <FaCheckCircle className="mr-2" />
                        <span>Account Verified</span>
                    </div>
                )
            case "pending":
                return (
                    <div className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg">
                        <FaClock className="mr-2" />
                        <span>Verification in Progress</span>
                    </div>
                )
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
        if (companyData.profileImage) {
            return (
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                        src={companyData.profileImage || "/placeholder.svg"}
                        alt={`${companyData.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                        // If image fails to load, replace with default icon
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        target.parentElement?.classList.add("bg-gray-100", "flex", "items-center", "justify-center")
                        const icon = document.createElement("div")
                        icon.innerHTML =
                            '<svg class="w-12 h-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm10 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2h-6z"/></svg>'
                        target.parentElement?.appendChild(icon)
                        }}
                    />
                </div>
            )
        }
    
        return (
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaBuilding className="w-12 h-12 text-gray-400" />
            </div>
        )
    }

    if (!companyData) 
        return (
            <Loader />
        )

    return (
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Profile Section */}
            <Card className="lg:col-span-2">
                <div className="flex items-start gap-6">
                    <CompanyProfileImage />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between ">
                            <h2 className="text-2xl font-bold text-primary">{companyData.name}</h2>
                            {renderVerificationStatus()}
                        </div>
                        <p className="text-secondary mb-2">{companyData.npwp}</p>
                        <p className="text-primary mb-4">{companyData.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-secondary">Bidang</h3>
                                <p className="text-primary">{companyData.field}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-secondary">Sub Bidang</h3>
                                <p className="text-primary">{companyData.subFields.join(" • ")}</p>
                            </div>
                        </div>
                        {(!verificationStatus || verificationStatus === "null") && (
                            <Button2 as={Link} to="/company-details" className="mt-4">
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

