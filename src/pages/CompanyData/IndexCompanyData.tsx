import { useEffect, useState } from "react";
// import SupplierCompanyData from "./Supplier/SupplierCompanyData";
// import AdminCompanyData from "./Admin/AdminCompanyData";
import ComingSoon from "../ComingSoon";

const IndexCompanyData: React.FC = () => {
    const [userRole, setUserRole] = useState<string>('');
    
    useEffect(() => {
        const role = localStorage.getItem('role') || '';
        setUserRole(role);
    }, []);
    
    if (userRole === 'purchasing' || userRole === 'presdir' || userRole === 'review') {
        // return <AdminCompanyData />;
        return <ComingSoon />;
    } else if (userRole === 'supplier') {
        // return <SupplierCompanyData />;
        return <ComingSoon />;
    } else {
        return <div>No dashboard available for your role.</div>;
    }
};

export default IndexCompanyData;