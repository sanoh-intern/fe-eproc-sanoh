import React, { useState } from "react"
import {
    FaBuilding,
    FaAddressCard,
    FaFileAlt,
    FaBusinessTime,
    FaShieldAlt,
    FaEye,
} from "react-icons/fa"
import { TypeCompanyData } from "../api/Data/company-data"
import { streamFile } from "../api/Action/stream-file"
import { toast } from "react-toastify"
import Button from "./Forms/Button"
import FilePreviewModal from "./FileStreamModal"

interface CompanyDataProps {
    companyData: TypeCompanyData | null;
}

const CompanyDetails: React.FC<CompanyDataProps> = ({ companyData }) => {
    const [previewModal, setPreviewModal] = useState<{
        isOpen: boolean
        filename: string
        url: string
    }>({
        isOpen: false,
        filename: '',
        url: ''
    })

    // Helper function to handle file preview
    const handleFilePreview = async (filePath: string) => {
        const filename = filePath.split('/').pop() || 'file'
        const toastId = toast.loading('Loading file preview...')
        
        try {
            const url = await streamFile(filePath)
            setPreviewModal({
                isOpen: true,
                filename,
                url
            })
            toast.update(toastId, {
                render: 'File loaded successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            })
        } catch (error) {
            console.error('Error loading file:', error)
            toast.update(toastId, {
                render: 'Failed to load file',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            })
        }
    }

    const closePreviewModal = () => {
        setPreviewModal({
            isOpen: false,
            filename: '',
            url: ''
        })
    }

    // Helper function to render file button or dash
    const renderFileField = (filePath: string | null | undefined, label: string) => {
        return (
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                {filePath ? (
                    <Button
                        title="View File"
                        onClick={() => handleFilePreview(filePath)}
                        icon={FaEye}
                    />
                ) : (
                    <p className="text-gray-800 font-medium">-</p>
                )}
            </div>
        );
    };
    if (!companyData) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Data Card Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-8 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>

                    {/* NIB Details Card Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mb-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>

                    {/* Business Licenses Card Skeleton */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>

                    {/* Integrity Pact Card Skeleton */}
                    <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mb-4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Build address string from components
    const addressParts = [
        companyData.general_data.adr_line_1,
        companyData.general_data.adr_line_2,
        companyData.general_data.adr_line_3,
        companyData.general_data.adr_line_4,
    ].filter(Boolean);
    
    const fullAddress = [
        ...addressParts,
        companyData.general_data.city,
        companyData.general_data.province,
        companyData.general_data.postal_code
    ].filter(Boolean).join(', ');

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Data Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start gap-8">
                        {/* Company Information */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                                <FaBuilding className="text-primary mr-3" />
                                General Information
                            </h3>
                            <div className="space-y-4">
                                {/* Profile Image */}
                                <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                                    {companyData.general_data.company_photo ? (
                                        <img 
                                            src={companyData.general_data.company_photo} 
                                            alt={companyData.general_data.company_name || 'Company'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // If image fails to load, show company icon
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clip-rule="evenodd"></path></svg></div>';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <FaBuilding className="w-20 h-20 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "BP Code", value: companyData.general_data.bp_code },
                                        { label: "Company Name", value: companyData.general_data.company_name },
                                        { label: "Business Field", value: companyData.general_data.business_field },
                                        { label: "Sub Business Field", value: companyData.general_data.sub_business_field },
                                        { label: "Product", value: companyData.general_data.product },
                                        { label: "Tax ID", value: companyData.general_data.tax_id },
                                        { label: "Status", value: companyData.general_data.company_status },
                                        { label: "Website", value: companyData.general_data.company_url },
                                        { label: "Phone 1", value: companyData.general_data.company_phone_1 },
                                        { label: "Phone 2", value: companyData.general_data.company_phone_2 },
                                        { label: "Fax 1", value: companyData.general_data.company_fax_1 },
                                        { label: "Fax 2", value: companyData.general_data.company_fax_2 },
                                    ].map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                            <p className="text-gray-800 font-medium">{item.value || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Address */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <p className="text-gray-800">{fullAddress || '-'}</p>
                                </div>
                                
                                {/* Description */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Description</p>
                                    <p className="text-gray-800">{companyData.general_data.company_description || '-'}</p>
                                </div>

                                {/* File Downloads */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {renderFileField(companyData.general_data.npwp_file, 'NPWP File')}
                                    {renderFileField(companyData.general_data.sppkp_file, 'SPPKP File')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaAddressCard className="text-primary mr-3" />
                        Contact Information
                    </h3>
                    <div className="space-y-4">
                        {companyData.person_in_charge && companyData.person_in_charge.length > 0 ? (
                            companyData.person_in_charge.map((contact, index) => (
                                <div key={contact.pic_id || index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Position</p>
                                            <p className="font-medium text-gray-800">{contact.job_position}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="font-medium text-gray-800">{contact.departement || '-'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium text-gray-800">{contact.pic_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone 1</p>
                                            <p className="font-medium text-gray-800">{contact.pic_telp_number_1}</p>
                                        </div>
                                        {contact.pic_telp_number_2 && (
                                            <div>
                                                <p className="text-sm text-gray-500">Phone 2</p>
                                                <p className="font-medium text-gray-800">{contact.pic_telp_number_2}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-500">Email 1</p>
                                            <p className="font-medium text-gray-800">{contact.pic_email_1}</p>
                                        </div>
                                        {contact.pic_email_2 && (
                                            <div>
                                                <p className="text-sm text-gray-500">Email 2</p>
                                                <p className="font-medium text-gray-800">{contact.pic_email_2}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Data not found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* NIB Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaFileAlt className="text-primary mr-3" />
                        NIB Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Issuing Agency", value: companyData.nib?.issuing_agency },
                            { label: "NIB Number", value: companyData.nib?.nib_number },
                            { label: "Issuing Date", value: companyData.nib?.issuing_date },
                            { label: "Investment Status", value: companyData.nib?.investment_status },
                            { label: "KBLI", value: companyData.nib?.kbli },
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                <p className="text-gray-800 font-medium">{item.value || '-'}</p>
                            </div>
                        ))}
                        
                        {/* NIB File Download */}
                        {renderFileField(companyData.nib?.nib_file, 'NIB File')}
                    </div>
                </div>

                {/* Business Licenses Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaBusinessTime className="text-primary mr-3" />
                        Business Licenses
                    </h3>
                    <div className="space-y-4">
                        {companyData.business_licenses && companyData.business_licenses.length > 0 ? (
                            companyData.business_licenses.map((license, index) => (
                                <div key={license.business_license_id || index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: "Business Type", value: license.business_type },
                                            { label: "Issuing Agency", value: license.issuing_agency },
                                            { label: "License Number", value: license.business_license_number },
                                            { label: "Issuing Date", value: license.issuing_date },
                                            { label: "Expiry Date", value: license.expiry_date },
                                            { label: "Qualification", value: license.qualification },
                                            { label: "Sub Classification", value: license.sub_classification },
                                        ].map((item, itemIndex) => (
                                            <div key={itemIndex}>
                                                <p className="text-sm text-gray-500">{item.label}</p>
                                                <p className="font-medium text-gray-800">{item.value || '-'}</p>
                                            </div>
                                        ))}
                                        
                                        {/* Business License File Download */}
                                        <div className="col-span-2">
                                            {renderFileField(license.business_license_file, 'License File')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Data not found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Integrity Pact Card */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <FaShieldAlt className="text-primary mr-3" />
                        Integrity Pact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderFileField(companyData.integrity_pact?.integrity_pact_file, 'Integrity Pact File')}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Description</p>
                            <p className="text-gray-800 font-medium">{companyData.integrity_pact?.integrity_pact_desc || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Preview Modal */}
            <FilePreviewModal
                isOpen={previewModal.isOpen}
                onClose={closePreviewModal}
                filename={previewModal.filename}
                url={previewModal.url}
            />
        </div>
    )
}

export default CompanyDetails