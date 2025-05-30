import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import Button from "../../../components/Forms/Button"
import {
  FaBuilding,
  FaAddressCard,
  FaFileAlt,
  FaBusinessTime,
  FaShieldAlt,
  FaCheck,
  FaExclamationCircle,
  FaDownload,
  FaEye,
} from "react-icons/fa"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import Loader from "../../../common/Loader"
import fetchCompanyData, { TypeCompanyData } from "../../../api/Data/company-data"
import FileStreamModal from "../../../components/FileStreamModal"
// Import API endpoints
import {
  API_Update_General_Data_Supplier,
  API_Create_Person_In_Charge_Supplier,
  API_Update_Person_In_Charge_Supplier,
  API_Delete_Person_In_Charge_Supplier,
  API_Create_Intergrity_Supplier,
  API_Update_Intergrity_Supplier,
  API_Delete_Intergrity_Supplier,
  API_Create_NIB_Supplier,
  API_Update_NIB_Supplier,
  API_Delete_NIB_Supplier,
  API_Create_Business_License_Supplier,
  API_Update_Business_License_Supplier,
  API_Delete_Business_License_Supplier
} from "../../../api/route-api"

const SupplierCompanyData: React.FC = () => {
  const [companyData, setCompanyData] = useState<TypeCompanyData>();
  const [activeTab, setActiveTab] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tabCompleteness, setTabCompleteness] = useState({
    generalData: false,
    contacts: false,
    nib: false,
    businessLicenses: false,
    integrityPact: false,
  });
  
  // File stream modal state
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCompanyData()
        setTabCompleteness({
          generalData: checkGeneralDataCompleteness(data.general_data),
          contacts: checkContactsCompleteness(data.person_in_charge),
          nib: checkNIBCompleteness(data.nib),
          businessLicenses: checkBusinessLicensesCompleteness(data.business_licenses),
          integrityPact: checkIntegrityPactCompleteness(data.integrity_pact),
        })
        setCompanyData(data)
      } catch (error) {
        console.error("Error fetching company data:", error)
        toast.error("Failed to load company data")      }
    }

    fetchData()
  }, [])
  const checkGeneralDataCompleteness = (data: any) => {
    const requiredFields = ["bp_code", "company_name", "company_description", "business_field", "sub_business_field", "product", "tax_id", "adr_line_1", "province", "city", "postal_code", "company_status", "company_phone_1", "company_fax_1", "company_url"]
    return requiredFields.every((field) => data[field] !== null && data[field] !== undefined && data[field] !== "")
  }
  const checkContactsCompleteness = (contacts: any[]) => {
    return (
      contacts.length > 0 &&
      contacts.every((contact) => contact.job_position && contact.pic_name && contact.pic_email_1 && contact.pic_telp_number_1)
    )
  }

  const checkNIBCompleteness = (data: any) => {
    const requiredFields = ["issuing_agency", "nib_number", "issuing_date", "investment_status", "kbli", "nib_file"]
    return requiredFields.every((field) => data[field] !== null && data[field] !== undefined && data[field] !== "")
  }

  const checkBusinessLicensesCompleteness = (licenses: any[]) => {
    return (
      licenses.length > 0 &&
      licenses.every(
        (license) =>
          license.business_type &&
          license.issuing_agency &&
          license.business_license_number &&
          license.issuing_date &&
          license.expiry_date &&
          license.qualification &&
          license.sub_classification &&
          license.business_license_file,
      )
    )
  }

  const checkIntegrityPactCompleteness = (data: any) => {
    return data.integrity_pact_file && data.integrity_pact_desc
  }
  const markUnsaved = () => setUnsavedChanges(true);
  const handleViewFile = (filePath: string, fileName: string) => {
    setSelectedFilePath(filePath);
    setSelectedFileName(fileName);
    setIsFileModalOpen(true);
  };

  // General Data CRUD Methods
  const handleGeneralDataSave = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'npwp_file' && key !== 'skpp_file') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      
      // Add files if they exist
      if (formData.npwp_file instanceof File) {
        formDataToSend.append('npwp_file', formData.npwp_file);
      }
      if (formData.skpp_file instanceof File) {
        formDataToSend.append('skpp_file', formData.skpp_file);
      }

      const response = await fetch(API_Update_General_Data_Supplier(), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'General data updated successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          generalData: checkGeneralDataCompleteness(updatedData.general_data)
        }));
      } else {
        toast.error(result.message || 'Failed to update general data');
      }
    } catch (error) {
      console.error('Error updating general data:', error);
      toast.error('An error occurred while updating general data');
    }
  };

  // Person in Charge CRUD Methods
  const handlePersonInChargeCreate = async (contactsData: any[]) => {
    try {
      const response = await fetch(API_Create_Person_In_Charge_Supplier(), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: contactsData })
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Person in charge created successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          contacts: checkContactsCompleteness(updatedData.person_in_charge)
        }));
      } else {
        toast.error(result.message || 'Failed to create person in charge');
      }
    } catch (error) {
      console.error('Error creating person in charge:', error);
      toast.error('An error occurred while creating person in charge');
    }
  };

  const handlePersonInChargeUpdate = async (picId: number, contactData: any) => {
    try {
      const response = await fetch(API_Update_Person_In_Charge_Supplier() + picId, {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Person in charge updated successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          contacts: checkContactsCompleteness(updatedData.person_in_charge)
        }));
      } else {
        toast.error(result.message || 'Failed to update person in charge');
      }
    } catch (error) {
      console.error('Error updating person in charge:', error);
      toast.error('An error occurred while updating person in charge');
    }
  };

  const handlePersonInChargeDelete = async (picId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this person in charge!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (result.isConfirmed) {
        const response = await fetch(API_Delete_Person_In_Charge_Supplier() + picId, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        
        if (response.ok && responseData.status) {
          toast.success(responseData.message || 'Person in charge deleted successfully');
          // Refresh company data
          const updatedData = await fetchCompanyData();
          setCompanyData(updatedData);
          setTabCompleteness(prev => ({
            ...prev,
            contacts: checkContactsCompleteness(updatedData.person_in_charge)
          }));
        } else {
          toast.error(responseData.message || 'Failed to delete person in charge');
        }
      }
    } catch (error) {
      console.error('Error deleting person in charge:', error);
      toast.error('An error occurred while deleting person in charge');
    }
  };

  // Integrity Pact CRUD Methods
  const handleIntegrityPactCreate = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('integrity_pact_desc', formData.integrity_pact_desc || '');
      
      if (formData.integrity_pact_file instanceof File) {
        formDataToSend.append('integrity_pact_file', formData.integrity_pact_file);
      }

      const response = await fetch(API_Create_Intergrity_Supplier(), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Integrity pact created successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          integrityPact: checkIntegrityPactCompleteness(updatedData.integrity_pact)
        }));
      } else {
        toast.error(result.message || 'Failed to create integrity pact');
      }
    } catch (error) {
      console.error('Error creating integrity pact:', error);
      toast.error('An error occurred while creating integrity pact');
    }
  };

  const handleIntegrityPactUpdate = async (integrityPactId: number, formData: any) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('integrity_pact_desc', formData.integrity_pact_desc || '');
      
      if (formData.integrity_pact_file instanceof File) {
        formDataToSend.append('integrity_pact_file', formData.integrity_pact_file);
      }

      const response = await fetch(API_Update_Intergrity_Supplier() + integrityPactId, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Integrity pact updated successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          integrityPact: checkIntegrityPactCompleteness(updatedData.integrity_pact)
        }));
      } else {
        toast.error(result.message || 'Failed to update integrity pact');
      }
    } catch (error) {
      console.error('Error updating integrity pact:', error);
      toast.error('An error occurred while updating integrity pact');
    }
  };

  const handleIntegrityPactDelete = async (integrityPactId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this integrity pact!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (result.isConfirmed) {
        const response = await fetch(API_Delete_Intergrity_Supplier() + integrityPactId, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        
        if (response.ok && responseData.status) {
          toast.success(responseData.message || 'Integrity pact deleted successfully');
          // Refresh company data
          const updatedData = await fetchCompanyData();
          setCompanyData(updatedData);
          setTabCompleteness(prev => ({
            ...prev,
            integrityPact: checkIntegrityPactCompleteness(updatedData.integrity_pact)
          }));
        } else {
          toast.error(responseData.message || 'Failed to delete integrity pact');
        }
      }
    } catch (error) {
      console.error('Error deleting integrity pact:', error);
      toast.error('An error occurred while deleting integrity pact');
    }
  };

  // NIB CRUD Methods
  const handleNIBCreate = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'nib_file') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      
      if (formData.nib_file instanceof File) {
        formDataToSend.append('nib_file', formData.nib_file);
      }

      const response = await fetch(API_Create_NIB_Supplier(), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'NIB created successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          nib: checkNIBCompleteness(updatedData.nib)
        }));
      } else {
        toast.error(result.message || 'Failed to create NIB');
      }
    } catch (error) {
      console.error('Error creating NIB:', error);
      toast.error('An error occurred while creating NIB');
    }
  };

  const handleNIBUpdate = async (nibId: number, formData: any) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'nib_file') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      
      if (formData.nib_file instanceof File) {
        formDataToSend.append('nib_file', formData.nib_file);
      }

      const response = await fetch(API_Update_NIB_Supplier() + nibId, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'NIB updated successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          nib: checkNIBCompleteness(updatedData.nib)
        }));
      } else {
        toast.error(result.message || 'Failed to update NIB');
      }
    } catch (error) {
      console.error('Error updating NIB:', error);
      toast.error('An error occurred while updating NIB');
    }
  };

  const handleNIBDelete = async (nibId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this NIB!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (result.isConfirmed) {
        const response = await fetch(API_Delete_NIB_Supplier() + nibId, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        
        if (response.ok && responseData.status) {
          toast.success(responseData.message || 'NIB deleted successfully');
          // Refresh company data
          const updatedData = await fetchCompanyData();
          setCompanyData(updatedData);
          setTabCompleteness(prev => ({
            ...prev,
            nib: checkNIBCompleteness(updatedData.nib)
          }));
        } else {
          toast.error(responseData.message || 'Failed to delete NIB');
        }
      }
    } catch (error) {
      console.error('Error deleting NIB:', error);
      toast.error('An error occurred while deleting NIB');
    }
  };

  // Business License CRUD Methods
  const handleBusinessLicenseCreate = async (formData: any) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'business_license_file') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      
      if (formData.business_license_file instanceof File) {
        formDataToSend.append('business_license_file', formData.business_license_file);
      }

      const response = await fetch(API_Create_Business_License_Supplier(), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Business license created successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          businessLicenses: checkBusinessLicensesCompleteness(updatedData.business_licenses)
        }));
      } else {
        toast.error(result.message || 'Failed to create business license');
      }
    } catch (error) {
      console.error('Error creating business license:', error);
      toast.error('An error occurred while creating business license');
    }
  };

  const handleBusinessLicenseUpdate = async (businessLicenseId: number, formData: any) => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'business_license_file') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      
      if (formData.business_license_file instanceof File) {
        formDataToSend.append('business_license_file', formData.business_license_file);
      }

      const response = await fetch(API_Update_Business_License_Supplier() + businessLicenseId, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok && result.status) {
        toast.success(result.message || 'Business license updated successfully');
        setUnsavedChanges(false);
        // Refresh company data
        const updatedData = await fetchCompanyData();
        setCompanyData(updatedData);
        setTabCompleteness(prev => ({
          ...prev,
          businessLicenses: checkBusinessLicensesCompleteness(updatedData.business_licenses)
        }));
      } else {
        toast.error(result.message || 'Failed to update business license');
      }
    } catch (error) {
      console.error('Error updating business license:', error);
      toast.error('An error occurred while updating business license');
    }
  };

  const handleBusinessLicenseDelete = async (businessLicenseId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this business license!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (result.isConfirmed) {
        const response = await fetch(API_Delete_Business_License_Supplier() + businessLicenseId, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        
        if (response.ok && responseData.status) {
          toast.success(responseData.message || 'Business license deleted successfully');
          // Refresh company data
          const updatedData = await fetchCompanyData();
          setCompanyData(updatedData);
          setTabCompleteness(prev => ({
            ...prev,
            businessLicenses: checkBusinessLicensesCompleteness(updatedData.business_licenses)
          }));
        } else {
          toast.error(responseData.message || 'Failed to delete business license');
        }
      }
    } catch (error) {
      console.error('Error deleting business license:', error);
      toast.error('An error occurred while deleting business license');    }  };
  
  const handleTabChange = (newIndex: number) => {
    if (unsavedChanges) {
      Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Are you sure you want to switch tabs?",
        icon: "warning", 
        showCancelButton: true,
        confirmButtonText: "Move Without Saving",
        cancelButtonText: "Cancel & Save",
        cancelButtonColor: "#ff0000",
        confirmButtonColor: "#2F4F4F", 
      }).then((result) => {
        if (result.isConfirmed) {
          setUnsavedChanges(false);
          setActiveTab(newIndex);
        } 
      });
      return false;
    }
    setActiveTab(newIndex);
    return true;
  };

  if (!companyData) {
    return (
      <Loader />
    )
  }
  return (
    <>
      <Breadcrumb pageName="Company Details" />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          {unsavedChanges && (
            <div className="bg-yellow-100 text-yellow-800 p-2 mb-3 rounded">
              Don't forget to save your changes!
            </div>
          )}
          <Tabs selectedIndex={activeTab} onSelect={handleTabChange}>
            <TabList className="flex flex-wrap border-b mb-4 overflow-x-auto">
              <Tab
                className={`px-2 sm:px-4 py-2 cursor-pointer flex items-center text-sm sm:text-base whitespace-nowrap ${activeTab === 0 ? "text-primary border-b-2 border-black font-medium" : "text-primarylight"}`}
              >
                <FaBuilding className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">General Data</span>
                <span className="sm:hidden">General</span>
                {tabCompleteness.generalData ? (
                  <FaCheck className="ml-1 sm:ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-1 sm:ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-2 sm:px-4 py-2 cursor-pointer flex items-center text-sm sm:text-base whitespace-nowrap ${activeTab === 1 ? "text-primary border-b-2 border-black font-medium" : "text-primarylight"}`}
              >
                <FaAddressCard className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Contact Data</span>
                <span className="sm:hidden">Contact</span>
                {tabCompleteness.contacts ? (
                  <FaCheck className="ml-1 sm:ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-1 sm:ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-2 sm:px-4 py-2 cursor-pointer flex items-center text-sm sm:text-base whitespace-nowrap ${activeTab === 2 ? "text-primary border-b-2 border-black font-medium" : "text-primarylight"}`}
              >
                <FaFileAlt className="mr-1 sm:mr-2" />
                NIB
                {tabCompleteness.nib ? (
                  <FaCheck className="ml-1 sm:ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-1 sm:ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-2 sm:px-4 py-2 cursor-pointer flex items-center text-sm sm:text-base whitespace-nowrap ${activeTab === 3 ? "text-primary border-b-2 border-black font-medium" : "text-primarylight"}`}
              >
                <FaBusinessTime className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Business License</span>
                <span className="sm:hidden">License</span>
                {tabCompleteness.businessLicenses ? (
                  <FaCheck className="ml-1 sm:ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-1 sm:ml-2 text-yellow-500" />
                )}
              </Tab>
              <Tab
                className={`px-2 sm:px-4 py-2 cursor-pointer flex items-center text-sm sm:text-base whitespace-nowrap ${activeTab === 4 ? "text-primary border-b-2 border-black font-medium" : "text-primarylight"}`}
              >
                <FaShieldAlt className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Integrity Pact</span>
                <span className="sm:hidden">Integrity</span>
                {tabCompleteness.integrityPact ? (
                  <FaCheck className="ml-1 sm:ml-2 text-green-500" />
                ) : (
                  <FaExclamationCircle className="ml-1 sm:ml-2 text-yellow-500" />
                )}
              </Tab>
            </TabList>

            <div>              <TabPanel>
                <GeneralDataForm
                  data={companyData.general_data}
                  onSubmit={handleGeneralDataSave}
                  markUnsaved={markUnsaved}
                  onViewFile={handleViewFile}
                />
              </TabPanel>              <TabPanel>
                <ContactDataForm 
                  data={companyData.person_in_charge} 
                  onSubmit={handlePersonInChargeCreate}
                  onUpdate={handlePersonInChargeUpdate}
                  onDelete={handlePersonInChargeDelete}
                  markUnsaved={markUnsaved}
                />
              </TabPanel>              <TabPanel>
                <NIBForm 
                  data={companyData.nib} 
                  onSubmit={handleNIBCreate}
                  onUpdate={handleNIBUpdate}
                  onDelete={handleNIBDelete}
                  markUnsaved={markUnsaved}
                  onViewFile={handleViewFile}
                />
              </TabPanel>
              <TabPanel>
                <BusinessLicenseForm
                  data={companyData.business_licenses}
                  onSubmit={handleBusinessLicenseCreate}
                  onUpdate={handleBusinessLicenseUpdate}
                  onDelete={handleBusinessLicenseDelete}
                  markUnsaved={markUnsaved}
                  onViewFile={handleViewFile}
                />
              </TabPanel>
              <TabPanel>
                <IntegrityPactForm
                  data={companyData.integrity_pact}
                  onSubmit={handleIntegrityPactCreate}
                  onUpdate={handleIntegrityPactUpdate}
                  onDelete={handleIntegrityPactDelete}
                  markUnsaved={markUnsaved}
                  onViewFile={handleViewFile}
                />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>

      {/* File Stream Modal */}
      <FileStreamModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        filePath={selectedFilePath}
        fileName={selectedFileName}
      />
    </>
  )
}

const GeneralDataForm: React.FC<{
  data: any;
  onSubmit: (data: any) => void;
  markUnsaved: () => void;
  onViewFile: (filePath: string, fileName: string) => void;
}> = ({ data, onSubmit, markUnsaved, onViewFile }) => {
  const [formData, setFormData] = useState({
    ...data,
    // Convert null values to empty strings for form inputs
    company_description: data.company_description || '',
    business_field: data.business_field || '',
    sub_business_field: data.sub_business_field || '',
    product: data.product || '',
    tax_id: data.tax_id || '',
    adr_line_1: data.adr_line_1 || '',
    adr_line_2: data.adr_line_2 || '',
    adr_line_3: data.adr_line_3 || '',
    adr_line_4: data.adr_line_4 || '',
    province: data.province || '',
    city: data.city || '',
    postal_code: data.postal_code || '',
    company_status: data.company_status || '',
    company_phone_1: data.company_phone_1 || '',
    company_phone_2: data.company_phone_2 || '',
    company_fax_1: data.company_fax_1 || '',
    company_fax_2: data.company_fax_2 || '',
    company_url: data.company_url || '',
    npwp_file: data.npwp_file || '',
    skpp_file: data.skpp_file || '',
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (e.target.type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [e.target.name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    markUnsaved();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">BP Code*</label>
          <input
            type="text"
            name="bp_code"
            value={formData.bp_code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Company Name*</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Company Description*</label>
        <textarea
          name="company_description"
          value={formData.company_description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Business Field*</label>
          <input
            type="text"
            name="business_field"
            value={formData.business_field}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Sub Business Field*</label>
          <input
            type="text"
            name="sub_business_field"
            value={formData.sub_business_field}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Product*</label>
        <input
          type="text"
          name="product"
          value={formData.product}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Tax ID (NPWP)*</label>
          <input
            type="text"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">NPWP File*</label>
          <div className="flex gap-2">
            <input
              type="file"
              name="npwp_file"
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded border-primary"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {formData.npwp_file && formData.npwp_file !== "" && formData.npwp_file !== null && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onViewFile(formData.npwp_file, `NPWP_${formData.company_name || 'document'}.pdf`)}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                  title="View NPWP File"
                >
                  <FaEye />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Create download link for NPWP file
                    const link = document.createElement('a');
                    link.href = formData.npwp_file;
                    link.download = `NPWP_${formData.company_name || 'document'}.pdf`;
                    link.click();
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  title="Download NPWP File"
                >
                  <FaDownload />
                </button>
              </div>
            )}
          </div>
          {formData.npwp_file && formData.npwp_file !== "" && formData.npwp_file !== null && (
            <div className="mt-1 text-sm text-gray-600">
              Current file: {formData.npwp_file.split('/').pop() || formData.npwp_file}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1">SKPP File*</label>
          <div className="flex gap-2">
            <input
              type="file"
              name="skpp_file"
              onChange={handleChange}
              required
              className="flex-1 p-2 border rounded border-primary"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {formData.skpp_file && formData.skpp_file !== "" && formData.skpp_file !== null && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onViewFile(formData.skpp_file, `SKPP_${formData.company_name || 'document'}.pdf`)}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                  title="View SKPP File"
                >
                  <FaEye />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Create download link for SKPP file
                    const link = document.createElement('a');
                    link.href = formData.skpp_file;
                    link.download = `SKPP_${formData.company_name || 'document'}.pdf`;
                    link.click();
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  title="Download SKPP File"
                >
                  <FaDownload />
                </button>
              </div>
            )}
          </div>
          {formData.skpp_file && formData.skpp_file !== "" && formData.skpp_file !== null && (
            <div className="mt-1 text-sm text-gray-600">
              Current file: {formData.skpp_file.split('/').pop() || formData.skpp_file}
            </div>
          )}
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Address Line 1*</label>
          <input
            type="text"
            name="adr_line_1"
            value={formData.adr_line_1}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Address Line 2</label>
          <input
            type="text"
            name="adr_line_2"
            value={formData.adr_line_2}
            onChange={handleChange}
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Address Line 3</label>
          <input
            type="text"
            name="adr_line_3"
            value={formData.adr_line_3}
            onChange={handleChange}
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Address Line 4</label>
          <input
            type="text"
            name="adr_line_4"
            value={formData.adr_line_4}
            onChange={handleChange}
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Province*</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">City*</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Postal Code*</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Company Status*</label>
        <select
          name="company_status"
          value={formData.company_status}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"
        >
          <option value="">Select Status</option>
          <option value="PMDN">PMDN (Penanaman Modal Dalam Negeri)</option>
          <option value="PMA">PMA (Penanaman Modal Asing)</option>
          <option value="BUMN">BUMN (Badan Usaha Milik Negara)</option>
          <option value="BUMD">BUMD (Badan Usaha Milik Daerah)</option>
          <option value="Swasta">Swasta</option>
        </select>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Phone 1*</label>
          <input
            type="tel"
            name="company_phone_1"
            value={formData.company_phone_1}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Phone 2</label>
          <input
            type="tel"
            name="company_phone_2"
            value={formData.company_phone_2}
            onChange={handleChange}
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Fax 1*</label>
          <input
            type="text"
            name="company_fax_1"
            value={formData.company_fax_1}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Fax 2</label>
          <input
            type="text"
            name="company_fax_2"
            value={formData.company_fax_2}
            onChange={handleChange}
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-1">Company URL*</label>
        <input
          type="url"
          name="company_url"
          value={formData.company_url}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"
          placeholder="https://example.com"
        />
      </div>
      
      <Button title="Save" type="submit" />
    </form>
  )
}

const ContactDataForm: React.FC<{ 
  data: any[]; 
  onSubmit: (data: any) => void;
  onUpdate?: (picId: number, contactData: any) => void;
  onDelete?: (picId: number) => void;
  markUnsaved: () => void;
}> = ({ data, onSubmit, onUpdate, onDelete, markUnsaved }) => {
  const [contacts, setContacts] = useState(
    data.map(contact => ({
      ...contact,
      // Convert null values to empty strings for form inputs
      department: contact.department || '',
      pic_telp_number_2: contact.pic_telp_number_2 || '',
      pic_email_2: contact.pic_email_2 || '',
      isNew: false // Track if this is a new contact
    }))
  )

  const handleAddContact = () => {
    setContacts([...contacts, { 
      job_position: "", 
      department: "", 
      pic_name: "", 
      pic_telp_number_1: "", 
      pic_telp_number_2: "", 
      pic_email_1: "", 
      pic_email_2: "",
      isNew: true // Mark as new contact
    }])
    markUnsaved();
  }
  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value, isModified: !contact.isNew } : contact
    )
    setContacts(updatedContacts)
    markUnsaved();
  }

  const handleRemoveContact = async (index: number) => {
    const contact = contacts[index];
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You will delete contact: ${contact.pic_name || 'this contact'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) {
      return;
    }
    
    if (contact.pic_id && !contact.isNew && onDelete) {
      // Existing contact - call delete API
      try {
        await onDelete(contact.pic_id);
        // After successful deletion, the component will be refreshed with new data
        // from the parent component, so we don't need to manually update local state here
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    } else {
      // New contact or no ID - just remove from state
      const updatedContacts = contacts.filter((_, i) => i !== index);
      setContacts(updatedContacts);
      markUnsaved();
      toast.success('Contact removed successfully');
    }
  }

  const handleSaveContact = async (index: number) => {
    const contact = contacts[index];
    
    // Validate required fields
    if (!contact.job_position || !contact.department || !contact.pic_name || 
        !contact.pic_telp_number_1 || !contact.pic_email_1) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (contact.pic_id && !contact.isNew && onUpdate) {
        // Existing contact - call update API
        await onUpdate(contact.pic_id, contact);
        // Mark as updated in local state
        const updatedContacts = contacts.map((c, i) => 
          i === index ? { ...c, isNew: false } : c
        );
        setContacts(updatedContacts);
      } else if (contact.isNew || !contact.pic_id) {
        // New contact - call create API
        await onSubmit([contact]);
        // After successful creation, the component will be refreshed with new data
        // so we don't need to manually update local state here
      }    } catch (error) {
      console.error('Error saving contact:', error);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit new contacts that haven't been individually saved
    const newContacts = contacts.filter(contact => contact.isNew && !contact.pic_id);
    
    if (newContacts.length > 0) {
      onSubmit(newContacts);
    } else {
      toast.info('No new contacts to save. Use individual Save buttons for existing contacts.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      {contacts.map((contact, index) => (
        <div key={index} className="border p-4 rounded border-black">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Contact {index + 1}</h3>
            <div className="flex gap-2">
              <Button 
                title={contact.pic_id && !contact.isNew ? "Update" : "Save"}
                onClick={() => handleSaveContact(index)}
                type="button"
                className="text-sm px-3 py-1"
              />
              <Button 
                title="Delete"
                onClick={() => handleRemoveContact(index)}
                type="button"
                className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Job Position*</label>
              <select
                value={contact.job_position}
                onChange={(e) => handleContactChange(index, "job_position", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
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
                className="w-full p-2 border rounded border-primary"
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">PIC Name*</label>
              <input
                type="text"
                value={contact.pic_name}
                onChange={(e) => handleContactChange(index, "pic_name", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
            <div>
              <label className="block mb-1">Phone Number 1*</label>
              <input
                type="tel"
                value={contact.pic_telp_number_1}
                onChange={(e) => handleContactChange(index, "pic_telp_number_1", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Phone Number 2</label>
              <input
                type="tel"
                value={contact.pic_telp_number_2}
                onChange={(e) => handleContactChange(index, "pic_telp_number_2", e.target.value)}
                className="w-full p-2 border rounded border-primary"
              />
            </div>
            <div>
              <label className="block mb-1">Email 1*</label>
              <input
                type="email"
                value={contact.pic_email_1}
                onChange={(e) => handleContactChange(index, "pic_email_1", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Email 2</label>
            <input
              type="email"
              value={contact.pic_email_2}
              onChange={(e) => handleContactChange(index, "pic_email_2", e.target.value)}
              className="w-full p-2 border rounded border-primary"
            />
          </div>          {contact.pic_id && !contact.isNew && (
            <div className={`mt-2 text-sm ${contact.isModified ? 'text-orange-600' : 'text-gray-600'}`}>
              Contact ID: {contact.pic_id} {contact.isModified ? '(Modified - needs update)' : '(Existing record)'}
            </div>
          )}
          {contact.isNew && (
            <div className="mt-2 text-sm text-green-600">
              New contact (not saved yet)
            </div>
          )}
        </div>
      ))}
      <Button title="Add Contact" onClick={handleAddContact} type="button" />
      <Button title="Save All New Contacts" type="submit" />
    </form>
  )
}

const NIBForm: React.FC<{ 
  data: any; 
  onSubmit: (data: any) => void;
  onUpdate?: (nibId: number, formData: any) => void;
  onDelete?: (nibId: number) => void;
  markUnsaved: () => void;
  onViewFile: (filePath: string, fileName: string) => void;
}> = ({ data, onSubmit, onUpdate, onDelete, markUnsaved, onViewFile }) => {
  const [formData, setFormData] = useState(data);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [e.target.name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    markUnsaved();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Determine if this is an update or create operation
    const isUpdate = formData.nib_id && formData.nib_id !== null;
    
    if (isUpdate && onUpdate) {
      onUpdate(formData.nib_id, formData);
    } else {
      onSubmit(formData);
    }
  }

  const handleDelete = () => {
    if (formData.nib_id && onDelete) {
      onDelete(formData.nib_id);
    }
  }

  const isExistingRecord = formData.nib_id && formData.nib_id !== null;
  const hasExistingFile = formData.nib_file && formData.nib_file !== "" && formData.nib_file !== null && typeof formData.nib_file === 'string';
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Issuing Agency*</label>
          <input
            type="text"
            name="issuing_agency"
            value={formData.issuing_agency}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">NIB Number*</label>
          <input
            type="text"
            name="nib_number"
            value={formData.nib_number}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Issuing Date*</label>
          <input
            type="date"
            name="issuing_date"
            value={formData.issuing_date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          />
        </div>
        <div>
          <label className="block mb-1">Investment Status*</label>
          <select
            name="investment_status"
            value={formData.investment_status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-primary"
          >
            <option value="">Select Status</option>
            <option value="Done">Done</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1">KBLI*</label>
        <input
          type="text"
          name="kbli"
          value={formData.kbli}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"
        />
      </div>      <div>
        <label className="block mb-1">NIB File{isExistingRecord && hasExistingFile ? '' : '*'}</label>
        <div className="flex gap-2">
          <input 
            type="file" 
            name="nib_file" 
            onChange={handleChange} 
            required={!isExistingRecord || !hasExistingFile}
            className="flex-1 p-2 border rounded border-primary"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {hasExistingFile && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onViewFile(formData.nib_file, `NIB_${formData.nib_number || 'document'}.pdf`)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                title="View NIB File"
              >
                <FaEye />
              </button>
              <button
                type="button"
                onClick={() => {
                  // Create download link for NIB file
                  const link = document.createElement('a');
                  link.href = formData.nib_file;
                  link.download = `NIB_${formData.nib_number || 'document'}.pdf`;
                  link.click();
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                title="Download NIB File"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>
        {hasExistingFile && (
          <div className="mt-1 text-sm text-gray-600">
            Current file: {formData.nib_file.split('/').pop() || formData.nib_file}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button title={isExistingRecord ? "Update" : "Save"} type="submit" />
        {isExistingRecord && (
          <Button 
            title="Delete" 
            onClick={handleDelete} 
            type="button" 
            className="bg-red-500 hover:bg-red-600 text-white"
          />
        )}
      </div>
    </form>
  )
}

const BusinessLicenseForm: React.FC<{ 
  data: any[]; 
  onSubmit: (data: any) => void;
  onUpdate?: (businessLicenseId: number, formData: any) => void;
  onDelete?: (businessLicenseId: number) => void;
  markUnsaved: () => void;
  onViewFile: (filePath: string, fileName: string) => void;
}> = ({ data, onSubmit, onUpdate: _onUpdate, onDelete: _onDelete, markUnsaved, onViewFile }) => {
  const [licenses, setLicenses] = useState(data)

  const handleAddLicense = () => {
    setLicenses([
      ...licenses,
      {
        business_type: "",
        issuing_agency: "",
        business_license_number: "",
        issuing_date: "",
        expiry_date: "",
        qualification: "",
        sub_classification: "",
        business_license_file: null,
      },
    ])
    markUnsaved();
  }

  const handleLicenseChange = (index: number, field: string, value: string | File | null) => {
    const updatedLicenses = licenses.map((license, i) => (i === index ? { ...license, [field]: value } : license))
    setLicenses(updatedLicenses)
    markUnsaved()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(licenses)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      {licenses.map((license, index) => (
        <div key={index} className="border p-4 rounded border-black">
          <h3 className="font-bold mb-2">Business License {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Business Type*</label>
              <input
                type="text"
                value={license.business_type}
                onChange={(e) => handleLicenseChange(index, "business_type", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
            <div>
              <label className="block mb-1">Issuing Agency*</label>
              <input
                type="text"
                value={license.issuing_agency}
                onChange={(e) => handleLicenseChange(index, "issuing_agency", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Business License Number*</label>
              <input
                type="text"
                value={license.business_license_number}
                onChange={(e) => handleLicenseChange(index, "business_license_number", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
            <div>
              <label className="block mb-1">Issuing Date*</label>
              <input
                type="date"
                value={license.issuing_date}
                onChange={(e) => handleLicenseChange(index, "issuing_date", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Expiry Date*</label>
              <input
                type="date"
                value={license.expiry_date}
                onChange={(e) => handleLicenseChange(index, "expiry_date", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
            <div>
              <label className="block mb-1">Qualification*</label>
              <input
                type="text"
                value={license.qualification}
                onChange={(e) => handleLicenseChange(index, "qualification", e.target.value)}
                required
                className="w-full p-2 border rounded border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Sub-classification*</label>
            <input
              type="text"
              value={license.sub_classification}
              onChange={(e) => handleLicenseChange(index, "sub_classification", e.target.value)}
              required
              className="w-full p-2 border rounded border-primary"
            />
          </div>
          <div>
            <label className="block mb-1">Business License File*</label>
            <div className="flex gap-2">
              <input
                type="file"
                onChange={(e) => handleLicenseChange(index, "business_license_file", e.target.files ? e.target.files[0] : '')}
                required
                className="flex-1 p-2 border rounded border-primary"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {license.business_license_file && license.business_license_file !== "" && license.business_license_file !== null && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onViewFile(license.business_license_file, `BusinessLicense_${license.business_license_number || 'document'}.pdf`)}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    title="View Business License File"
                  >
                    <FaEye />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Create download link for Business License file
                      const link = document.createElement('a');
                      link.href = license.business_license_file;
                      link.download = `BusinessLicense_${license.business_license_number || 'document'}.pdf`;
                      link.click();
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    title="Download Business License File"
                  >
                    <FaDownload />
                  </button>
                </div>
              )}
            </div>
            {license.business_license_file && license.business_license_file !== "" && license.business_license_file !== null && (
              <div className="mt-1 text-sm text-gray-600">
                Current file: {(typeof license.business_license_file === 'string' ? license.business_license_file.split('/').pop() : license.business_license_file.name) || license.business_license_file}
              </div>
            )}
          </div>
        </div>
      ))}
      <Button title="Add Business License" onClick={handleAddLicense} type="button" />
      <Button title="Save" type="submit" />
    </form>
  )
}

const IntegrityPactForm: React.FC<{ 
  data: any; 
  onSubmit: (data: any) => void;
  onUpdate?: (integrityPactId: number, formData: any) => void;
  onDelete?: (integrityPactId: number) => void;
  markUnsaved: () => void;
  onViewFile: (filePath: string, fileName: string) => void;
}> = ({ data, onSubmit, onUpdate, onDelete, markUnsaved, onViewFile }) => {
  const [formData, setFormData] = useState(data)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [e.target.name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    markUnsaved();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Determine if this is an update or create operation
    const isUpdate = formData.integrity_pact_id && formData.integrity_pact_id !== null;
    
    if (isUpdate && onUpdate) {
      onUpdate(formData.integrity_pact_id, formData);
    } else {
      onSubmit(formData);
    }
  }

  const handleDelete = () => {
    if (formData.integrity_pact_id && onDelete) {
      onDelete(formData.integrity_pact_id);
    }
  }

  const isExistingRecord = formData.integrity_pact_id && formData.integrity_pact_id !== null;
  const hasExistingFile = formData.integrity_pact_file && formData.integrity_pact_file !== "" && formData.integrity_pact_file !== null && typeof formData.integrity_pact_file === 'string';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <Button
          title="Download Template"
          icon={FaDownload}
          onClick={() => {
            /* Add download logic */
          }}
          type="button"
        />
      </div>      <div>
        <label className="block mb-1">Upload Integrity Pact{isExistingRecord && hasExistingFile ? '' : '*'}</label>
        <div className="flex gap-2">
          <input 
            type="file" 
            name="integrity_pact_file" 
            onChange={handleChange} 
            required={!isExistingRecord || !hasExistingFile}
            className="flex-1 p-2 border rounded border-primary"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {hasExistingFile && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onViewFile(formData.integrity_pact_file, `IntegrityPact_document.pdf`)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                title="View Integrity Pact File"
              >
                <FaEye />
              </button>
              <button
                type="button"
                onClick={() => {
                  // Create download link for Integrity Pact file
                  const link = document.createElement('a');
                  link.href = formData.integrity_pact_file;
                  link.download = `IntegrityPact_document.pdf`;
                  link.click();
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                title="Download Integrity Pact File"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>
        {hasExistingFile && (
          <div className="mt-1 text-sm text-gray-600">
            Current file: {formData.integrity_pact_file.split('/').pop() || formData.integrity_pact_file}
          </div>
        )}
      </div>
      <div>
        <label className="block mb-1">Description*</label>
        <textarea
          name="integrity_pact_desc"
          value={formData.integrity_pact_desc}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded border-primary"          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <Button title={isExistingRecord ? "Update" : "Save"} type="submit" />
        {isExistingRecord && (
          <Button 
            title="Delete" 
            onClick={handleDelete} 
            type="button" 
            className="bg-red-500 hover:bg-red-600 text-white"
          />
        )}
      </div>
    </form>
  )
}

export default SupplierCompanyData

