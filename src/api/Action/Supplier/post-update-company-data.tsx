export const postUpdateCompanyData = async (tabName: string, tabData: any) => {
    try {
        const response = await fetch('/api/company/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [tabName]: tabData }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()
        return responseData
    } catch (error) {
        throw error
    }
}