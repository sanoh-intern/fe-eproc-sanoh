import { FaHandshake } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

export default function ManageOffers () {
    const location = useLocation();
    const currentPath = location.pathname;

    const manageOffersPaths = [
        '/offers/manage', 
        '/offers/details/',
        '/offers/edit/',
        '/offers/create',

    ];

    const isManageOffers = manageOffersPaths.some(path => currentPath.includes(path));
    
    return (
        <li>
            <NavLink
                to="/offers/manage"
                end
                className={
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                        isManageOffers
                            ? 'bg-primary text-white'
                            : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                        }`
                    }
                >
                <FaHandshake className="fill-current" size={18} />
                Manage Offers
            </NavLink>
        </li>
    )
}
