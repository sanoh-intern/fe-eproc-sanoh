import { FaClipboardCheck } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const OffersRegistered = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const offersRegisteredPaths = [
        '/offers/registered', 
        '/offers/registered/:id',
        '/offers/registered/:id/:id',
    ];

    const isOffersRegistered = offersRegisteredPaths.some(path => currentPath.includes(path));
    return (
        <li>
            <NavLink
                to="/offers/registered"
                end
                className={
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                        isOffersRegistered
                            ? 'bg-primary text-white'
                            : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                    }`
                }
            >
                <FaClipboardCheck className="fill-current" size={18} />
                Offers Registered
            </NavLink>
        </li>
    );
};

export default OffersRegistered;