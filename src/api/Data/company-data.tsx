export type TypeCompanyData = {    
    general_data: {
        bp_code: string
        company_name: string
        company_description: string
        business_field: string
        sub_business_field: string
        product: string
        tax_id: string
        adr_line_1: string
        adr_line_2: string
        adr_line_3: string
        adr_line_4: string
        province: string
        city: string
        postal_code: string
        company_status: string
        company_phone_1: string
        company_phone_2: string
        company_fax_1: string
        company_fax_2: string
        company_url: string
        npwp_number: string
        npwp_file: string
        skpp_file: string
    }
    person_in_charge: {
        job_position: string
        department: string
        pic_name: string
        pic_telp_number_1: string
        pic_telp_number_2?: string
        pic_email_1: string
        pic_email_2?: string
    }[]
    nib: {
        issuing_agency: string
        nib_number: string
        issuing_date: string
        investment_status: string
        kbli: string
        nib_file: string
    }
    business_licenses: {
        business_type: string
        issuing_agency: string
        business_license_number: string
        issuing_date: string
        expiry_date: string
        qualification: string
        sub_classification: string
        business_license_file: string
    }[]
    integrity_pact: {
        integrity_pact_file: string
        integrity_pact_desc: string
    }
}

const fetchCompanyData = async () => {
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
    return {        general_data: {
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
            npwp_number: "12.345.678.9-012.000",
            npwp_file: "npwp_document.pdf",
            skpp_file: "skpp_document.pdf",
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