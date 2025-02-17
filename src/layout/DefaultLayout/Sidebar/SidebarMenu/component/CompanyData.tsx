import { FaBuilding } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

export default function CompanyDetails() {
    const location = useLocation();
    const currentPath = location.pathname;

    const companyDataPaths = [
        '/company-data',
        '/company-data/detail',
    ];

    const isCompanyData = companyDataPaths.some(path => currentPath.includes(path));

    return (
        <li>
            <NavLink
                to="/company-data"
                end
                className={
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                        isCompanyData
                            ? 'bg-primary text-white'
                            : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                    }`
                }
            >
            <FaBuilding className="fill-current" size={18} />
                Company Data
            </NavLink>
        </li>
    )
}