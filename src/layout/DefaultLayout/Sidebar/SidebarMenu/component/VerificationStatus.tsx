import { FaCheckCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function VerificationStatus () {
    return (
        <li>
            <NavLink
                to="/verification-status"
                end
                className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out ${
                        isActive
                            ? 'bg-primary text-white'
                            : 'text-black-2 dark:text-bodydark2 hover:bg-primary hover:text-white dark:hover:bg-meta-4'
                        }`
                    }
                >
                <FaCheckCircle className="fill-current" size={18} />
                Verification Status
            </NavLink>
        </li>
    )
}