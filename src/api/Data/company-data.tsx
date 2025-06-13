import { API_Company_Profile_Supplier } from "../route-api"

export type TypeCompanyData = {    
    general_data: {
        bp_code: string
        company_name: string
        company_description: string | null
        business_field: string | null
        sub_business_field: string | null
        product: string | null
        tax_id: string | null
        adr_line_1: string | null
        adr_line_2: string | null
        adr_line_3: string | null
        adr_line_4: string | null
        province: string | null
        city: string | null
        postal_code: string | null
        company_status: string | null
        company_phone_1: string | null
        company_phone_2: string | null
        company_fax_1: string | null
        company_fax_2: string | null
        company_url: string | null
        npwp_file?: string | null
        sppkp_file?: string | null
    }
    person_in_charge: {
        pic_id?: number | null
        job_position: string
        departement: string | null
        pic_name: string
        pic_telp_number_1: string
        pic_telp_number_2?: string
        pic_email_1: string
        pic_email_2?: string
    }[]
    nib: {
        nib_id?: number | null
        issuing_agency: string
        nib_number: string
        issuing_date: string
        investment_status: string
        kbli: string
        nib_file: string
    }
    business_licenses: {
        business_license_id?: number
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
        integrity_pact_id?: number
        integrity_pact_file: string
        integrity_pact_desc: string
    }
}

const fetchCompanyData = async (): Promise<TypeCompanyData> => {
    try {
        const response = await fetch(API_Company_Profile_Supplier(), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token') || '',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status && result.data) {
            // Transform the API response to match our interface
            const transformedData: TypeCompanyData = {
                general_data: {
                    ...result.data.general_data,
                    npwp_file: result.data.general_data.npwp_file || null,
                    sppkp_file: result.data.general_data.sppkp_file || null,
                },
                person_in_charge: result.data.person_in_charge || [],
                nib: result.data.nib || {
                    nib_id: null,
                    issuing_agency: '',
                    nib_number: '',
                    issuing_date: '',
                    investment_status: '',
                    kbli: '',
                    nib_file: ''
                },
                // Handle business_licences vs business_licenses naming difference
                business_licenses: result.data.business_licences || result.data.business_licenses || [],
                integrity_pact: result.data.integrity_pact || {
                    integrity_pact_id: null,
                    integrity_pact_file: '',
                    integrity_pact_desc: ''
                }
            };
            
            return transformedData;
        } else {
            throw new Error(result.message || 'Failed to fetch company data');
        }
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    }
}


export default fetchCompanyData;