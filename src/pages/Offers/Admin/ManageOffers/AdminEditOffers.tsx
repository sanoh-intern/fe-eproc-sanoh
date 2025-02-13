"use client"

import React, { useState, useEffect } from "react"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../../components/Forms/Button"
import Select from "react-select"
import Swal from "sweetalert2"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../../../../common/Loader"

interface Option {
    value: string
    label: string
}

const offerTypeOptions: Option[] = [
    { value: "Public", label: "Public" },
    { value: "Invited", label: "Invited" },
]

const AdminEditOffers: React.FC = () => {
    // Simulated initial offer data fetched from an API
    const [projectName, setProjectName] = useState("")
    const [registrationDueDate, setRegistrationDueDate] = useState("")
    const [overview, setOverview] = useState("")
    const [attachment, setAttachment] = useState<File | null>(null)
    const [existingAttachmentLink, setExistingAttachmentLink] = useState<string | null>(null)
    const [offerType, setOfferType] = useState<Option | null>(null)
    const [emails, setEmails] = useState<string[]>([])

    // Simulate fetching offer data (e.g. by an offer ID)
    useEffect(() => {
        // Dummy data for the offer to be edited
        const dummyOffer = {
            projectName: "Dummy Project",
            registrationDueDate: "2025-03-01",
            overview: "This is a dummy overview for the offer.",
            offerType: "Invited", // or "Public"
            emails: ["test@example.com", "info@example.com"],
            attachment: "https://example.com/dummyAttachment.pdf",
        }

        setProjectName(dummyOffer.projectName)
        setRegistrationDueDate(dummyOffer.registrationDueDate)
        setOverview(dummyOffer.overview)
        setOfferType(
            offerTypeOptions.find((o) => o.value === dummyOffer.offerType) || null
        )
        setEmails(dummyOffer.emails)
        setExistingAttachmentLink(dummyOffer.attachment)
    }, [])

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachment(e.target.files[0])
        }
    }

    // Email Input Component (adapted from the create template)
    const EmailInput = () => {
        const [inputValue, setInputValue] = useState("")

        const handleEmailRemove = (index: number) => {
            setEmails(emails.filter((_, i) => i !== index))
        }

        const addEmail = (value: string) => {
            if (value && !emails.includes(value.trim())) {
                setEmails(prev => [...prev, value.trim()])
            }
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setInputValue(value)
            if (
                value.includes(";") ||
                (value.includes("@") &&
                (value.endsWith(".com") ||
                    value.endsWith(".co.id") ||
                    value.endsWith(".net") ||
                    value.endsWith(".org") ||
                    value.endsWith(".edu") ||
                    value.endsWith(".gov") ||
                    value.endsWith(".io") ||
                    value.endsWith(".tech")))
            ) {
                addEmail(value.replace(";", ""))
                setInputValue("")
            }
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                if (
                    inputValue.includes("@") &&
                    (inputValue.endsWith(".com") ||
                        inputValue.endsWith(".co.id") ||
                        inputValue.endsWith(".net") ||
                        inputValue.endsWith(".org") ||
                        inputValue.endsWith(".edu") ||
                        inputValue.endsWith(".gov") ||
                        inputValue.endsWith(".io") ||
                        inputValue.endsWith(".tech"))
                ) {
                    addEmail(inputValue)
                    setInputValue("")
                }
            }
        }

        const handleBlur = () => {
            if (
                inputValue.includes("@") &&
                (inputValue.endsWith(".com") ||
                inputValue.endsWith(".co.id") ||
                inputValue.endsWith(".net") ||
                inputValue.endsWith(".org") ||
                inputValue.endsWith(".edu") ||
                inputValue.endsWith(".gov") ||
                inputValue.endsWith(".io") ||
                inputValue.endsWith(".tech"))
            ) {
                addEmail(inputValue)
                setInputValue("")
            }
        }

        return (
            <div className="w-full">
                <div className="flex flex-wrap gap-2 p-2 mb-2 rounded border-[1.5px] border-secondary bg-transparent py-3 px-5 text-black">
                    {emails.map((email, index) => (
                        <span key={index} className="bg-blue-100 px-2 py-1 rounded-md flex items-center gap-2">
                        {email}
                            <button
                                type="button"
                                onClick={() => handleEmailRemove(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        id="email-input"
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        placeholder="Type email ..."
                        className="outline-none border-none flex-1 min-w-[200px]"
                    />
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Simple validation
        if (!projectName || !registrationDueDate || !overview) {
            Swal.fire("Error", "Please fill all required fields", "error")
            return
        }
        if (!offerType) {
            Swal.fire("Error", "Please select an offer type", "error")
            return
        }
        if (offerType.value === "Invited" && emails.length === 0) {
            Swal.fire("Error", "For invited offers, please add at least one email", "error")
            return
        }

        // Confirm submission
        const result = await Swal.fire({
            title: "Update Offer",
            text: "Are you sure you want to update this offer?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update it",
            confirmButtonColor: "#2F4F4F",
            cancelButtonColor: "#dc2626",
        })

        if (!result.isConfirmed) return

        // Build payload (handle file upload as needed)
        const payload = {
            projectName,
            registrationDueDate,
            overview,
            offerType: offerType.value,
            attachment: attachment ? attachment.name : null,
            emails,
        }

        // Simulate API call for updating the offer
        console.log("Payload sent", payload)
        toast.success("Offer updated successfully!")
    }

    if (!projectName) return <Loader />

    return (
        <>
            <ToastContainer position="top-right" />
            <Breadcrumb
                pageName="Edit Offer"
                isSubMenu
                parentMenu={{ name: "Manage Offers", link: "/offers/manage" }}
            />
            <div className="rounded-sm border border-stroke bg-white shadow-default p-4 md:p-6.5 mx-auto ">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block mb-2 text-black">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                required
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                            />
                        </div>
                        {/* Registration Due Date */}
                        <div>
                            <label className="block mb-2 text-black">
                                Registration Due Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={registrationDueDate}
                                onChange={(e) => setRegistrationDueDate(e.target.value)}
                                required
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                            />
                        </div>
                        {/* Project Overview */}
                        <div>
                            <label className="block mb-2 text-black">
                                Project Overview <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                placeholder="Enter project details/overview"
                                required
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                                rows={5}
                            />
                        </div>
                        {/* Attachment Detail Project */}
                        <div>
                            <label className="block mb-2 text-black">Attachment Detail Project</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                            />
                            {existingAttachmentLink && !attachment && (
                                <div className="mt-2">
                                    <span className="text-sm text-gray-700">Current Attachment: </span>
                                    <a
                                        href={existingAttachmentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View File
                                    </a>
                                </div>
                            )}
                        </div>
                        {/* Offer Type */}
                        <div>
                            <label className="block mb-2 text-black">
                                Offer Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={offerTypeOptions}
                                value={offerType}
                                onChange={(option) => setOfferType(option)}
                                placeholder="Select offer type"
                                isClearable
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                            />
                        </div>
                        {/* Invite Email */}
                        <div>
                            <label className="block mb-2 text-black">
                                Invite Email{" "}
                                {offerType?.value === "Invited" ? (
                                <span className="text-red-500">*</span>
                                ) : (
                                "(optional)"
                                )}
                            </label>
                            <EmailInput />
                        </div>
                        {/* Update Button */}
                        <Button
                            type="submit"
                            title="Update Offer"
                            className="w-full justify-center"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminEditOffers