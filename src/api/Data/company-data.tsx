export type TypeCompanyData = {
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

const fetchCompanyData = async (companyId: string) => {
    // await fetch(`https://api.example.com/company/${companyId}`, {
    //     method: 'GET',
    //     headers: {
    //         token: 'your-token-here'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     return data;
    // })
    // .catch(error => {
    //     console.error('Error fetching company data:', error);
    //     return error.message || 'Error';
    // }
    // );
    return {
        general_data: {
            bp_code: "TEST123",
            company_name: "ABC Corp",
            company_description: "Leading IT solutions provider",
            business_field: "Information Technology",
            sub_business_field: "Software Development",
            product: "Software Solutions",
            tax_id: "123456789",
            adr_line_1: "123 Tech Street, Silicon Valley",
            adr_line_2: "Suite 100",
            adr_line_3: "Building A",
            adr_line_4: "Tech Park",
            province: "California",
            city: "San Francisco",
            postal_code: "94105",
            company_status: "PMDN",
            company_phone_1: "+1 (555) 123-4567",
            company_phone_2: "+1 (555) 765-4321",
            company_fax_1: "+1 (555) 987-6543",
            company_fax_2: "+1 (555) 654-3210",
            company_url: "https://v0.blob.com/DPYHH.png",
        },
        person_in_charge: [
            {
                job_position: "Director",
                department: "Marketing",
                pic_name: "John Doe",
                pic_telp_number_1: "+1 (555) 111-2222",
                pic_telp_number_2: "+1 (555) 222-3333",
                pic_email_1: "john@abccorp.com",
                pic_email_2: "john@abccorp.com",
            },
            {
                job_position: "Department Head",
                department: "Marketing",
                pic_name: "John 88",
                pic_telp_number_1: "+1 (555) 111-2222",
                pic_email_1: "john@abccorp.com",
            },
        ],
        nib: {
            issuing_agency: "Business Registration Office",
            nib_number: "NIB123456",
            issuing_date: "2022-01-01",
            investment_status: "Done",
            kbli: "KBLI62019",
            nib_file: "nib_document.pdf",
        },
        business_licenses: [
            {
                business_type: "Software Development License",
                issuing_agency: "Tech Regulatory Board",
                business_license_number: "SDL987654",
                issuing_date: "2022-02-15",
                expiry_date: "2025-02-14",
                qualification: "Advanced",
                sub_classification: "Enterprise Software",
                business_license_file: "software_license.pdf",
            },
        ],
        integrity_pact: {
            integrity_pact_file: "integrity_pact.pdf",
            integrity_pact_desc: "Signed integrity pact for ethical business conduct",
        },
    }
}

export default fetchCompanyData;