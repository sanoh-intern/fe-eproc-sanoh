"use client"

import React, { useState, useEffect } from "react"
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb"
import Button from "../../../../components/Forms/Button"
import Select from "react-select"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../../../../common/Loader"
import { putEditOffers } from "../../../../api/Action/Admin/Offers/put-update-offers"
import fetchEditOfferDetails, { TypeEditOfferDetails } from "../../../../api/Data/Admin/ManageOffers/edit-offers-details"
import { API_Download_Dokumen } from "../../../../api/route-api"

interface Option {
    value: string
    label: string
}

const offerTypeOptions: Option[] = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
]

const AdminEditOffers: React.FC = () => {
    // Simulated initial offer data fetched from an API
    const [projectName, setProjectName] = useState<string>("")
    const [registrationDueDate, setRegistrationDueDate] = useState<string>("")
    const [overview, setOverview] = useState<string>("")
    const [attachment, setAttachment] = useState<File | null>(null)
    const [existingAttachmentLink, setExistingAttachmentLink] = useState<TypeEditOfferDetails>()
    const [projectType, setProjectType] = useState<Option | undefined>()
    const [emails, setEmails] = useState<string[]>([])
    const offerId = window.location.hash.split('/').pop();

    // Simulate fetching offer data (e.g. by an offer ID)
    useEffect(() => {
        async function fetchData() {
            // Dummy data for the offer to be edited
            const [details] = await Promise.all([
                fetchEditOfferDetails(offerId!),
            ])

            setProjectName(details.project_name)
            setRegistrationDueDate(details.registration_due_at)
            setOverview(details.project_description)
            setProjectType(
                offerTypeOptions.find((o) => o.value === details.project_type) || undefined
            )
            setEmails((details as any).emails || [])
            setExistingAttachmentLink(details.project_attach ? details.project_attach as unknown as TypeEditOfferDetails : undefined)
        }
        
        fetchData();
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
        if (!projectType) {
            Swal.fire("Error", "Please select an project type", "error")
            return
        }
        if (projectType.value === "Private" && emails.length === 0) {
            Swal.fire("Error", "For Private projects, please add at least one email", "error")
            return
        }

        // Confirm submission
        const result = await Swal.fire({
            title: "Update Project",
            text: "Are you sure you want to update this project?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update it",
            confirmButtonColor: "#2F4F4F",
            cancelButtonColor: "#dc2626",
        })

        if (!result.isConfirmed) return

        // Build payload (handle file upload as needed)
        const formData = new FormData()
        formData.append("project_name", projectName)
        formData.append("project_description", overview)
        formData.append("registration_due_at", registrationDueDate)
        formData.append("project_type", projectType.value)
        if (attachment) {
            formData.append("project_attach", attachment)
        }
        emails.forEach((email, index) => {
            formData.append(`invite_email[${index}]`, email)
        })
        formData.append("_method", "PUT")

        // Simulate API call for updating the offer
        console.log("Payload sent", formData)
        const response = await putEditOffers(formData , offerId)
        if (!response) {
            toast.error("Failed to update project")
            return
        }
        toast.success("Project updated successfully!")
    }

    const DownloadFile = async () => {
        if (offerId) {
            let toastId: string | number = 0;
            try {
                const token = localStorage.getItem("access_token");
                toastId = toast.loading("Downloading file...");
                const response = await fetch(API_Download_Dokumen() + offerId, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to download file");
                }
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = projectName || "document.pdf";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast.update(toastId, { 
                    render: "File downloaded successfully", 
                    type: "success",
                    isLoading: false,
                    autoClose: 2000
                });
            } catch (error) {
                toast.update(toastId, { 
                    render: "Failed to download file", 
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
                console.error("Download error:", error);
            }
        }
    }

    if (!projectName) return <Loader />

    return (
        <>
            <Breadcrumb
                pageName="Edit Project"
                isSubMenu
                parentMenu={{ name: "Manage Projects", link: "/offers/manage" }}
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
                                    <button
                                        type="button"
                                        onClick={DownloadFile}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View File
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Offer Type */}
                        <div>
                            <label className="block mb-2 text-black">
                                Project Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                options={offerTypeOptions}
                                value={projectType}
                                onChange={(option) => setProjectType(option ? option : undefined)}
                                placeholder="Select project type"
                                isClearable
                                className="w-full rounded border border-secondary py-3 px-5 text-black focus:border-primary"
                            />
                        </div>
                        {/* Invite Email */}
                        <div>
                            <label className="block mb-2 text-black">
                                Invite Email{" "}
                                {projectType?.value === "Private" ? (
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
                            title="Update Project"
                            className="w-full justify-center"
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminEditOffers