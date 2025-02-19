export type TypeDashboardCompanyData = {
    name: string
    id: string
    description: string | null
    field: string | null
    subFields: string[] | null
    profileImage?: string | null
}
interface DashboardCompanyData {
    name: string
    id: string
    description: string | null
    field: string | null
    subFields: string[] | null
    profileImage?: string | null
}

const fetchDashboardCompanyData = async (): Promise<DashboardCompanyData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return Array.from({ length: 25 }, (_, i) => ({
        name: `Company ${i + 1}`,
        id: `company-${i + 1}`,
        description: `Description for Company ${i + 1}`,
        field: `Field ${i + 1}`,
        subFields: Array.from({ length: 3 }, (_, j) => `Subfield ${j + 1}`),
        profileImage: `https://i.pravatar.cc/150?img=${i + 1}`,
    }))
}

export default fetchDashboardCompanyData;