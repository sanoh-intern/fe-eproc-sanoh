import { NavLink, Link } from 'react-router-dom';
import LogoIcon from '../../assets/images/logo-sanoh.png';

const Header = (props: {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
    }) => {
        const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
            `px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-black font-bold text-md" : "text-gray-500 hover:text-black hover:font-bold"
            }`;
        const registerLinkClasses = () =>
            `rounded-full px-6 py-2 text-sm font-medium border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white`;
    return (
        <>
            <header className="sticky top-0 z-999 bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none shadow-[0_2px_2px_rgba(55,55,55,0.5)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
                {/* Mobile Header */}
                    <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                        {/* Hamburger Toggle BTN */}
                        <button
                            aria-label="Toggle Sidebar"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.setSidebarOpen(!props.sidebarOpen);
                            }}
                            className="mr-4 rounded border border-stroke bg-white p-2 shadow-sm dark:border-strokedark dark:bg-boxdark"
                        >
                            <div className="space-y-1">
                                <span
                                    className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${
                                        !props.sidebarOpen ? "rotate-0" : "rotate-45 translate-y-1.5"
                                    }`}
                                ></span>
                                <span
                                    className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${
                                        !props.sidebarOpen ? "opacity-100" : "opacity-0"
                                    }`}
                                ></span>
                                <span
                                    className={`block h-0.5 w-6 bg-black dark:bg-white transition-all duration-300 ${
                                        !props.sidebarOpen ? "rotate-0" : "-rotate-45 -translate-y-1.5"
                                    }`}
                                ></span>
                            </div>
                        </button>
                        <Link className="block flex-shrink-0" to="/">
                            <img src={LogoIcon} alt="Logo" className="h-8 w-auto" />
                        </Link>
                    </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex w-full items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className={`${navLinkClasses} flex-shrink-0`}>
                            <img src={LogoIcon} alt="Logo" className="h-8 w-auto" />
                        </Link>
                        <NavLink to="/contact-us" className={navLinkClasses}>
                            Contact Us
                        </NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        <NavLink to="/auth/login" className="rounded-full px-6 py-2 text-sm font-medium border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white">
                            Login
                        </NavLink>
                        <NavLink to="/auth/register" className={registerLinkClasses}>
                            Register
                        </NavLink>
                    </div>
                </div>
                </div>
            </header>

            {/* Mobile Sidebar Menu */}
            {props.sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="w-64 bg-white p-6 shadow-lg dark:bg-boxdark">
                        <div className="mb-6">
                            <Link
                                to="/"
                                onClick={() => props.setSidebarOpen(false)}
                                className="flex-shrink-0"
                            >
                                <img src={LogoIcon} alt="Logo" className="h-8 w-auto" />
                            </Link>
                        </div>
                        <nav className="flex flex-col space-y-4">
                            <NavLink
                                to="/"
                                onClick={() => props.setSidebarOpen(false)}
                                className={navLinkClasses}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/contact-us"
                                onClick={() => props.setSidebarOpen(false)}
                                className={navLinkClasses}
                            >
                                Contact Us
                            </NavLink>
                            <div className="flex flex-col items-center space-y-4 mt-8">
                                <NavLink
                                    to="/auth/login"
                                    onClick={() => props.setSidebarOpen(false)}
                                    className="w-40 text-center rounded-full px-6 py-2 text-sm font-medium border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/auth/register"
                                    onClick={() => props.setSidebarOpen(false)}
                                    className="w-40 text-center rounded-full px-6 py-2 text-sm font-medium border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white"
                                >
                                    Register
                                </NavLink>
                            </div>
                        </nav>
                    </div>
                    {/* Overlay */}
                    <div
                        className="flex-grow bg-black bg-opacity-50"
                        onClick={() => props.setSidebarOpen(false)}>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;