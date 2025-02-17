import { useEffect, useState } from "react";
import SupplierCompanyData from "./Supplier/SupplierCompanyData";
import AdminCompanyData from "./Admin/AdminCompanyData";

const IndexCompanyData: React.FC = () => {
    const [userRole, setUserRole] = useState<string>('');
    
    useEffect(() => {
        const role = localStorage.getItem('role') || '';
        setUserRole(role);
    }, []);
    
    if (userRole === 'admin-purchasing' || userRole === 'admin-presdir' || userRole === 'admin-review') {
        return <AdminCompanyData />;
    } else if (userRole === 'supplier') {
        return <SupplierCompanyData />;
    } else {
        return <div>No dashboard available for your role.</div>;
    }
};

export default IndexCompanyData;