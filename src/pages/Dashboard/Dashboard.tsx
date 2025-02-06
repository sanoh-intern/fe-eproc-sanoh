import React, { useEffect, useState } from 'react';
import DashboardSuperAdmin from './Pages/Admin/SuperAdmin';
import DashboardSupplier from './Pages/Customer/Supplier';
import DashboardPurchasing from './Pages/Admin/Purchasing';
import DashboardReview from './Pages/Admin/Review';
import DashboardPresdir from './Pages/Admin/Presdir';

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('role') || '';
    setUserRole(role);
  }, []);

  if (userRole === 'super-admin') {
    return <DashboardSuperAdmin />;
  } else if (userRole === 'admin-presdir') {
    return <DashboardPresdir />;
  } else if (userRole === 'admin-review') {
    return <DashboardReview />;
  } else if (userRole === 'admin-purchasing') {
    return <DashboardPurchasing />;
  } else if (userRole === 'supplier') {
    return <DashboardSupplier />;
  } else {
    return <div>No dashboard available for your role.</div>;
  }
};

export default Dashboard;
