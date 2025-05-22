import { FaHandshake } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

export default function OffersAvailable () {
    const location = useLocation();
    const currentPath = location.pathname;

    const offersAvailablePaths = [
        '/offers/available', 
        '/offers/details',
    ];

    const isOffersAvailable = offersAvailablePaths.some(path => currentPath.includes(path));
    
    return (
        <li>
            <NavLink
                to="/offers/available"
                end
                className={
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                        isOffersAvailable
                            ? 'bg-primary text-white'
                            : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                        }`
                    }
                >
                <FaHandshake className="fill-current" size={18} />
                List Project
            </NavLink>
        </li>
    )
}
