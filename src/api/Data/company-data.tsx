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

const fetchCompanyData = async (companyId?: string) => {
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
        generalData: {
            companyName: "ABC Corp",
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
            {
                position: "Marketing2",
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
}

export default fetchCompanyData;