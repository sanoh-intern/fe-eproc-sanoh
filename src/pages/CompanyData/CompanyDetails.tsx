import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb"
import Loader from "../../common/Loader"
import CompanyDetailsComponent from "../../components/CompanyDetails"
import { fetchCompanyDataAdmin, TypeCompanyData } from "../../api/Data/company-data"

const CompanyDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [companyData, setCompanyData] = useState<TypeCompanyData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                toast.error("Company ID not provided")
                setLoading(false)
                return
            }

            try {
                const data = await fetchCompanyDataAdmin(id)
                setCompanyData(data)
            } catch (error) {
                console.error("Error fetching company data:", error)
                toast.error("Failed to load company details")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) return <Loader />

    return (
        <>
            <Breadcrumb pageName="Company Details" />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CompanyDetailsComponent companyData={companyData} />
            </div>
        </>
    )
}

export default CompanyDetails
