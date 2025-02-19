import { useEffect, useState } from "react";
import AdminVerification from "./Admin/AdminVerification";
import SupplierVerification from "./Supplier/SupplierVerification";

const IndexVerification: React.FC = () => {
    const [userRole, setUserRole] = useState<string>('');
    
    useEffect(() => {
        const role = localStorage.getItem('role') || '';
        setUserRole(role);
    }, []);
    
    if (userRole === 'purchasing' || userRole === 'presdir' || userRole === 'review') {
        return <AdminVerification />;
    } else if (userRole === 'supplier') {
        return <SupplierVerification />;
    } else {
        return <div>No dashboard available for your role.</div>;
    }
};

export default IndexVerification;