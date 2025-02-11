import { useEffect, useState } from "react";
import AdminCompanyDetail from "./Admin/AdminCompanyDetail";
import SupplierCompanyDetail from "./Supplier/SupplierCompanyDetail";

const IndexCompanyDetail: React.FC = () => {
    const [userRole, setUserRole] = useState<string>('');
    
    useEffect(() => {
        const role = localStorage.getItem('role') || '';
        setUserRole(role);
    }, []);
    
    if (userRole === 'admin-purchasing' || userRole === 'admin-presdir' || userRole === 'admin-review') {
        return <AdminCompanyDetail />;
    } else if (userRole === 'supplier') {
        return <SupplierCompanyDetail />;
    } else {
        return <div>No dashboard available for your role.</div>;
    }
};

export default IndexCompanyDetail;