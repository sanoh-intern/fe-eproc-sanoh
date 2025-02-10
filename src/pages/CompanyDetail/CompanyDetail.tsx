import type React from "react"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import Button from "../../components/Forms/Button"
import {
  FaBuilding,
  FaAddressCard,
  FaFileAlt,
  FaBusinessTime,
  FaShieldAlt,
  FaCheck,
  FaExclamationCircle,
  FaDownload,
} from "react-icons/fa"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"

const api = {
  fetchCompanyData: async () => {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      generalData: {
        companyName: null,
        description: "Leading IT solutions provider",
        field: "Information Technology",
        subField: "Software Development",
        taxId: "123456789",
        address: "123 Tech Street, Silicon Valley",
        state: "California",
        city: "San Francisco",
        postalCode: "94105",
        companyStatus: "PMDN",
        phone: "+1 (555) 123-4567",
        fax: "+1 (555) 987-6543",
        website: "www.abccorp.com",
        profileImage: "https://v0.blob.com/DPYHH.png",
        products: ["Software Solutions", "Cloud Services"],
      },
      contacts: [
        {
          position: "Director",
          department: "Marketing",
          name: "John Doe",
          phone: "+1 (555) 111-2222",
          email: "john@abccorp.com",
        },
      ],
      nib: {
        issuingAgency: "Business Registration Office",
        number: "NIB123456",
        issueDate: "2022-01-01",
        investmentStatus: "Done",
        kbli: "KBLI62019",
        file: "nib_document.pdf",
      },
      businessLicenses: [
        {
          type: "Software Development License",
          issuingAgency: "Tech Regulatory Board",
          number: "SDL987654",
          issueDate: "2022-02-15",
          expiryDate: "2025-02-14",
          qualification: "Advanced",
          subClassification: "Enterprise Software",
          file: "software_license.pdf",
        },
      ],
      integrityPact: {
        file: "integrity_pact.pdf",
        description: "Signed integrity pact for ethical business conduct",
      },
    }
  },
  updateCompanyData: async (data: any) => {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Data sent to API:", data)
    return { success: true, message: "Company data updated successfully" }
  },
}

const CompanyDetail: React.FC = () => {
  const [companyData, setCompanyData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [tabCompleteness, setTabCompleteness] = useState({
    generalData: false,
    contacts: false,
    nib: false,
    businessLicenses: false,
    integrityPact: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.fetchCompanyData()
        setTabCompleteness({
          generalData: checkGeneralDataCompleteness(data.generalData),
          contacts: checkContactsCompleteness(data.contacts),
          nib: checkNIBCompleteness(data.nib),
          businessLicenses: checkBusinessLicensesCompleteness(data.businessLicenses),
          integrityPact: checkIntegrityPactCompleteness(data.integrityPact),
        })
        setCompanyData(data)
      } catch (error) {
        console.error("Error fetching company data:", error)
        toast.error("Failed to load company data")
      }
    }

    fetchData()
  }, [])

  const checkGeneralDataCompleteness = (data: any) => {
    const requiredFields = ["companyName", "taxId", "address", "state", "city", "postalCode", "companyStatus", "phone"]
    return requiredFields.every((field) => data[field] !== null && data[field] !== undefined && data[field] !== "")
  }

  const checkContactsCompleteness = (contacts: any[]) => {
    return (
      contacts.length > 0 &&
      contacts.every((contact) => contact.position && contact.department && contact.name && contact.email)
    )
  }

  const checkNIBCompleteness = (data: any) => {
    const requiredFields = ["issuingAgency", "number", "issueDate", "investmentStatus", "kbli", "file"]
    return requiredFields.every((field) => data[field] !== null && data[field] !== undefined && data[field] !== "")
  }

  const checkBusinessLicensesCompleteness = (licenses: any[]) => {
    return (
      licenses.length > 0 &&
      licenses.every(
        (license) =>
          license.type &&
          license.issuingAgency &&
          license.number &&
          license.issueDate &&
          license.expiryDate &&
          license.qualification &&
          license.subClassification &&
          license.file,
      )
    )
  }

  const checkIntegrityPactCompleteness = (data: any) => {
    return data.file && data.description
  }

  const handleSubmit = async (tabData: any, tabName: string) => {
    try {
      const response = await api.updateCompanyData({ [tabName]: tabData })
      if (response.success) {
        toast.success(response.message)
        setTabCompleteness((prev) => ({
          ...prev,
          [tabName]: checkTabCompleteness(tabName, tabData),
        }))
      } else {
        toast.error("Failed to update data")
      }
    } catch (error) {
      console.error("Error updating company data:", error)
      toast.error("An error occurred while updating data")
    }
  }

  const checkTabCompleteness = (tabName: string, data: any) => {
    switch (tabName) {
      case "generalData":
        return checkGeneralDataCompleteness(data)
      case "contacts":
        return checkContactsCompleteness(data)
      case "nib":
        return checkNIBCompleteness(data)
      case "businessLicenses":
        return checkBusinessLicensesCompleteness(data)
      case "integrityPact":
        return checkIntegrityPactCompleteness(data)
      default:
        return false
    }
  }

  if (!companyData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Breadcrumb pageName="Company Details" />
      <ToastContainer position="top-right" />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
            <TabList className="flex border-b mb-4">
              <Tab
                className={`px-4 py-2 cursor-pointer flex items-center ${activeTab === 0 ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
              >
                <FaBuilding className="mr-2" />
                General Data
                {tabCompleteness.generalData ? (
                  <FaCheck className="ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-4 py-2 cursor-pointer flex items-center ${activeTab === 1 ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
              >
                <FaAddressCard className="mr-2" />
                Contact Data
                {tabCompleteness.contacts ? (
                  <FaCheck className="ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-4 py-2 cursor-pointer flex items-center ${activeTab === 2 ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
              >
                <FaFileAlt className="mr-2" />
                NIB
                {tabCompleteness.nib ? (
                  <FaCheck className="ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-4 py-2 cursor-pointer flex items-center ${activeTab === 3 ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
              >
                <FaBusinessTime className="mr-2" />
                Business License
                {tabCompleteness.businessLicenses ? (
                  <FaCheck className="ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-4 py-2 cursor-pointer flex items-center ${activeTab === 4 ? "text-blue-600 border-b-2 border-blue-600" : ""}`}
              >
                <FaShieldAlt className="mr-2" />
                Integrity Pact
                {tabCompleteness.integrityPact ? (
                  <FaCheck className="ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-2 text-yellow-500" />
                )}
              </Tab>
            </TabList>

            <div className="border-t border-gray-200 pt-4">
              <TabPanel>
                <GeneralDataForm
                  data={companyData.generalData}
                  onSubmit={(data) => handleSubmit(data, "generalData")}
                />
              </TabPanel>
              <TabPanel>
                <ContactDataForm data={companyData.contacts} onSubmit={(data) => handleSubmit(data, "contacts")} />
              </TabPanel>
              <TabPanel>
                <NIBForm data={companyData.nib} onSubmit={(data) => handleSubmit(data, "nib")} />
              </TabPanel>
              <TabPanel>
                <BusinessLicenseForm
                  data={companyData.businessLicenses}
                  onSubmit={(data) => handleSubmit(data, "businessLicenses")}
                />
              </TabPanel>
              <TabPanel>
                <IntegrityPactForm
                  data={companyData.integrityPact}
                  onSubmit={(data) => handleSubmit(data, "integrityPact")}
                />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

const GeneralDataForm: React.FC<{ data: any; onSubmit: (data: any) => void }> = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Company Name*</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {/* Add other fields similarly */}
      <Button title="Save" type="submit" />
    </form>
  )
}

const ContactDataForm: React.FC<{ data: any[]; onSubmit: (data: any) => void }> = ({ data, onSubmit }) => {
  const [contacts, setContacts] = useState(data)

  const handleAddContact = () => {
    setContacts([...contacts, { position: "", department: "", name: "", phone: "", email: "" }])
  }

  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = contacts.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact))
    setContacts(updatedContacts)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(contacts)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {contacts.map((contact, index) => (
        <div key={index} className="border p-4 rounded">
          <h3 className="font-bold mb-2">Contact {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Position*</label>
              <select
                value={contact.position}
                onChange={(e) => handleContactChange(index, "position", e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Position</option>
                <option value="Director">Director</option>
                <option value="QMR">QMR</option>
                <option value="Department Head">Department Head</option>
                <option value="Supervisor/Staff">Supervisor/Staff</option>
                <option value="Foreman/Coordinator">Foreman/Coordinator</option>
                <option value="Delivery">Delivery</option>
                <option value="Driver">Driver</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Department*</label>
              <select
                value={contact.department}
                onChange={(e) => handleContactChange(index, "department", e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Department</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Marketing">Marketing</option>
                <option value="Quality">Quality</option>
                <option value="PPC & Logistics">PPC & Logistics</option>
                <option value="Finance">Finance</option>
                <option value="Tax">Tax</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Name*</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Email*</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => handleContactChange(index, "email", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
      <Button title="Add Contact" onClick={handleAddContact} type="button" />
      <Button title="Save" type="submit" />
    </form>
  )
}

const NIBForm: React.FC<{ data: any; onSubmit: (data: any) => void }> = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Issuing Agency*</label>
        <input
          type="text"
          name="issuingAgency"
          value={formData.issuingAgency}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">NIB Number*</label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Issue Date*</label>
        <input
          type="date"
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Investment Status*</label>
        <select
          name="investmentStatus"
          value={formData.investmentStatus}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Done">Done</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">KBLI*</label>
        <input
          type="text"
          name="kbli"
          value={formData.kbli}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">NIB File*</label>
        <input type="file" name="file" onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <Button title="Save" type="submit" />
    </form>
  )
}

const BusinessLicenseForm: React.FC<{ data: any[]; onSubmit: (data: any) => void }> = ({ data, onSubmit }) => {
  const [licenses, setLicenses] = useState(data)

  const handleAddLicense = () => {
    setLicenses([
      ...licenses,
      {
        type: "",
        issuingAgency: "",
        number: "",
        issueDate: "",
        expiryDate: "",
        qualification: "",
        subClassification: "",
        file: null,
      },
    ])
  }

  const handleLicenseChange = (index: number, field: string, value: string | File | null) => {
    const updatedLicenses = licenses.map((license, i) => (i === index ? { ...license, [field]: value } : license))
    setLicenses(updatedLicenses)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(licenses)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {licenses.map((license, index) => (
        <div key={index} className="border p-4 rounded">
          <h3 className="font-bold mb-2">Business License {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Business Type*</label>
              <input
                type="text"
                value={license.type}
                onChange={(e) => handleLicenseChange(index, "type", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Issuing Agency*</label>
              <input
                type="text"
                value={license.issuingAgency}
                onChange={(e) => handleLicenseChange(index, "issuingAgency", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">License Number*</label>
              <input
                type="text"
                value={license.number}
                onChange={(e) => handleLicenseChange(index, "number", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Issue Date*</label>
              <input
                type="date"
                value={license.issueDate}
                onChange={(e) => handleLicenseChange(index, "issueDate", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Expiry Date*</label>
              <input
                type="date"
                value={license.expiryDate}
                onChange={(e) => handleLicenseChange(index, "expiryDate", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Qualification*</label>
              <input
                type="text"
                value={license.qualification}
                onChange={(e) => handleLicenseChange(index, "qualification", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Sub-classification*</label>
              <input
                type="text"
                value={license.subClassification}
                onChange={(e) => handleLicenseChange(index, "subClassification", e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">License File*</label>
              <input
                type="file"
                onChange={(e) => handleLicenseChange(index, "file", e.target.files ? e.target.files[0] : '')}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      ))}
      <Button title="Add Business License" onClick={handleAddLicense} type="button" />
      <Button title="Save" type="submit" />
    </form>
  )
}

const IntegrityPactForm: React.FC<{ data: any; onSubmit: (data: any) => void }> = ({ data, onSubmit }) => {
  const [formData, setFormData] = useState(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Button
          title="Download Template"
          icon={FaDownload}
          onClick={() => {
            /* Add download logic */
          }}
          type="button"
        />
      </div>
      <div>
        <label className="block mb-1">Upload Integrity Pact*</label>
        <input type="file" name="file" onChange={handleChange} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block mb-1">Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <Button title="Save" type="submit" />
    </form>
  )
}

export default CompanyDetail

