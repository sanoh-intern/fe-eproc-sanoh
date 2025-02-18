import { useEffect, useState } from "react";
import fetchCompanyData, { TypeCompanyData } from "../../api/Data/company-data";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import CompanyDetails from "../../components/CompanyDetails";
import { toast } from "react-toastify";

const CompanyDetail = () => {
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null);

    useEffect(() => {

        const loadData = async () => {
            try {
                const [companyData] = await Promise.all([fetchCompanyData("1")])
                setCompanyData(companyData)
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