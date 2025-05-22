import { FaClipboardCheck } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

export default function OffersFollowed () {

    const location = useLocation();
    const currentPath = location.pathname;

    const offersFollowedPaths = [
        '/offers/followed', 
        '/offers/followed/negotiation/details',
    ];

    const isOffersFollowed = offersFollowedPaths.some(path => currentPath.includes(path));

    return (
        <li>
            <NavLink
            to="/offers/followed"
            end
            className={
                `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                isOffersFollowed
                    ? 'bg-primary text-white'
                    : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                }`
                }
            >
            <FaClipboardCheck className="fill-current" size={18} />
                Project Registered
            </NavLink>
        </li>
    )
}