import React from "react"
import {
  FaBuilding,
  FaAddressCard,
  FaFileAlt,
  FaBusinessTime,
  FaShieldAlt,
} from "react-icons/fa"

interface CompanyData {
  generalData: {
    companyName: string
    description: string
    field: string
    subField: string
    taxId: string
    address: string
    state: string
    city: string
    postalCode: string
    companyStatus: string
    phone: string
    fax: string
    website: string
    profileImage: string
    products: string[]
  }
  contacts: {
    position: string
    department: string
    name: string
    phone: string
    email: string
  }[]
  nib: {
    issuingAgency: string
    number: string
    issueDate: string
    investmentStatus: string
    kbli: string
    file: string
  }
  businessLicenses: {
    type: string
    issuingAgency: string
    number: string
    issueDate: string
    expiryDate: string
    qualification: string
    subClassification: string
    file: string
  }[]
  integrityPact: {
    file: string
    description: string
  }
}

const CompanyDetails: React.FC<{ companyData: CompanyData }> = ({ companyData }) => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Data Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start gap-8">
                        {/* Profile Image */}
                        <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg border-4 border-gray-100">
                            <img 
                                src={companyData.generalData.profileImage} 
                                alt={companyData.generalData.companyName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Company Information */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                                <FaBuilding className="text-primary mr-3" />
                                General Information
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Company Name", value: companyData.generalData.companyName },
                                        { label: "Field", value: companyData.generalData.field },
                                        { label: "Sub Field", value: companyData.generalData.subField },
                                        { label: "Tax ID", value: companyData.generalData.taxId },
                                        { label: "Status", value: companyData.generalData.companyStatus },
                                        { label: "Website", value: companyData.generalData.website },
                                    ].map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                            <p className="text-gray-800 font-medium">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Address</p>
                                    <p className="text-gray-800">
                                        {`${companyData.generalData.address}, ${companyData.generalData.city}, ${companyData.generalData.state} ${companyData.generalData.postalCode}`}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Description</p>
                                    <p className="text-gray-800">{companyData.generalData.description}</p>
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
                    {companyData.contacts.map((contact, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <p className="text-sm text-gray-500">Position</p>
                            <p className="font-medium text-gray-800">{contact.position}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium text-gray-800">{contact.department}</p>
                            </div>
                            <div className="col-span-2">
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium text-gray-800">{contact.name}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-800">{contact.phone}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-800">{contact.email}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* NIB Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FaFileAlt className="text-primary mr-3" />
                    NIB Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(companyData.nib).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        <p className="text-gray-800 font-medium">{value}</p>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Business Licenses Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FaBusinessTime className="text-primary mr-3" />
                    Business Licenses
                    </h3>
                    <div className="space-y-4">
                    {companyData.businessLicenses.map((license, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(license).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                                <p className="font-medium text-gray-800">{value}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Integrity Pact Card */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FaShieldAlt className="text-primary mr-3" />
                    Integrity Pact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">File</p>
                        <p className="text-gray-800 font-medium">{companyData.integrityPact.file}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="text-gray-800 font-medium">{companyData.integrityPact.description}</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails