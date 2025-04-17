import { useEffect, useState } from "react";
// import AdminVerification from "./Admin/AdminVerification";
// import SupplierVerification from "./Supplier/SupplierVerification";
import ComingSoon from "../ComingSoon";
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
        // return <ComingSoon />;
    } else if (userRole === 'supplier') {
        return <SupplierVerification />;
        // return <ComingSoon />;
    } else {
        return <div>No dashboard available for your role.</div>;
    }
};

export default IndexVerification;