import { useEffect, useState } from "react";
import fetchCompanyData, { TypeCompanyData } from "../../api/Data/company-data";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CompanyDetails, { CompanyData } from "../../components/CompanyDetails";
import { toast } from "react-toastify";

// Function to transform TypeCompanyData to CompanyData
const transformCompanyData = (data: TypeCompanyData): CompanyData => {
    return {
        generalData: {
            companyName: data.general_data.company_name,
            description: data.general_data.company_description || '',
            field: data.general_data.business_field || '',
            subField: data.general_data.sub_business_field || '',
            taxId: data.general_data.tax_id || '',
            address: [
                data.general_data.adr_line_1,
                data.general_data.adr_line_2,
                data.general_data.adr_line_3,
                data.general_data.adr_line_4
            ].filter(Boolean).join(', '),
            state: data.general_data.province || '',
            city: data.general_data.city || '',
            postalCode: data.general_data.postal_code || '',
            companyStatus: data.general_data.company_status || '',
            phone: data.general_data.company_phone_1 || '',
            fax: data.general_data.company_fax_1 || '',
            website: data.general_data.company_url || '',
            profileImage: '', // No equivalent in TypeCompanyData
            products: data.general_data.product ? [data.general_data.product] : []
        },
        contacts: data.person_in_charge.map(contact => ({
            position: contact.job_position,
            departement: contact.departement || '',
            name: contact.pic_name,
            phone: contact.pic_telp_number_1,
            email: contact.pic_email_1
        })),
        nib: {
            issuingAgency: data.nib.issuing_agency,
            number: data.nib.nib_number,
            issueDate: data.nib.issuing_date,
            investmentStatus: data.nib.investment_status,
            kbli: data.nib.kbli,
            file: data.nib.nib_file
        },
        businessLicenses: data.business_licenses.map(license => ({
            type: license.business_type,
            issuingAgency: license.issuing_agency,
            number: license.business_license_number,
            issueDate: license.issuing_date,
            expiryDate: license.expiry_date,
            qualification: license.qualification,
            subClassification: license.sub_classification,
            file: license.business_license_file
        })),
        integrityPact: {
            file: data.integrity_pact.integrity_pact_file,
            description: data.integrity_pact.integrity_pact_desc
        }
    };
};

const CompanyDetail = () => {
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);

    useEffect(() => {

        const loadData = async () => {
            try {
                const rawCompanyData = await fetchCompanyData();
                const transformedData = transformCompanyData(rawCompanyData);
                setCompanyData(transformedData);
            } catch (error) {
                toast.error("Failed to load company data.")
            }
        }

        loadData()
    }, []);
    return (
        <>
            <Breadcrumb pageName="Company Detail" isSubMenu={true} parentMenu={{name: "Company Data", link: "/company-data"}}/>
            <CompanyDetails companyData={companyData} />
        </>
    );
}

export default CompanyDetail