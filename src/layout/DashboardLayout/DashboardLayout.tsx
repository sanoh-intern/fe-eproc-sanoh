import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import Footer from "./Footer";

const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            {/* Content Area */}
            <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
                <main className="">
                    {/* Render halaman sesuai route */}
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
                {/* <Footer /> */}
            </div>
        </>
    );
}

export default DashboardLayout;