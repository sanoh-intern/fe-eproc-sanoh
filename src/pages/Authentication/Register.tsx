import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft, FaCheckCircle, FaSpinner } from "react-icons/fa"
import Logo from "../../assets/images/logo-sanoh.png"
import FotoSanoh from "../../assets/images/cover/maskot2.png"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import { registerUser, resendPassword } from "../../api/Action/Auth/auth-actions"

const Register: React.FC = () => {
    const [npwp, setNpwp] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
        }
        return () => clearTimeout(timer)
    }, [resendCooldown])    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const payload = {
                tax_id: npwp,
                company_name: companyName,
                email: email
            };

            const result = await registerUser(payload);
            
            if (result.success) {
                setIsRegistered(true)
                toast.success(result.message)
            } else {
                // Handle validation errors
                if (result.errors) {
                    if (typeof result.errors === 'object') {
                        Object.values(result.errors).forEach((errorArray: any) => {
                            if (Array.isArray(errorArray)) {
                                errorArray.forEach((error: string) => toast.error(error));
                            } else {
                                toast.error(errorArray);
                            }
                        });
                    } else {
                        toast.error(result.errors);
                    }
                } else {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.")        } finally {
            setIsLoading(false)
        }
    }

    const handleResendPassword = async () => {
        if (resendCooldown > 0) return
        setIsLoading(true)
        try {
            const payload = { email: email };
            const result = await resendPassword(payload);
            
            if (result.success) {
                toast.success(result.message)
                setResendCooldown(30)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to resend password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Link
                to="/"
                className="absolute top-10 left-10 flex items-center justify-center w-10 h-10 rounded-full bg-primarylight shadow hover:bg-primary hover:text-white transition-colors"
            >
                <FaArrowLeft className="w-6 h-6 text-black hover:text-white" />
            </Link>
            <section className="flex h-screen w-screen overflow-y-auto flex-col p-5 bg-white max-md:pr-12 max-sm:flex max-sm:flex-col max-sm:mx-5 max-sm:mt-5">
                <div className="flex gap-5 max-md:flex-col my-auto mx-auto">
                    <div className="flex-col ml-auto w-6/12 max-md:ml-0 max-md:w-full hidden md:flex">
                        <img
                            loading="lazy"
                            src={FotoSanoh || "/placeholder.svg"}
                            alt="Register illustration"
                            className="object-contain grow w-full h-auto aspect-[0.71] max-w-[710px] max-md:mt-10 max-md:max-w-[286px] max-sm:self-stretch max-sm:m-auto max-sm:w-full max-sm:max-w-[296px]"
                        />
                    </div>
                    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full my-auto">
                        <div className="flex flex-col mr-auto w-full max-w-[500px] max-md:mt-10 max-md:ml-0 max-sm:mt-5 max-sm:ml-auto max-sm:max-w-[301px]">
                        <img
                            loading="lazy"
                            src={Logo || "/placeholder.svg"}
                            alt="Company logo"
                            className="object-contain max-w-full aspect-[2.79] w-[120px] max-md:ml-1"
                        />
                        {!isRegistered ? (
                            <form className="flex flex-col mt-6 w-full" onSubmit={handleSubmit} autoComplete="off">
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="npwp" className="text-base text-black-800 mb-2">
                                        NPWP Number
                                    </label>
                                    <input
                                        type="text"
                                        id="npwp"
                                        autoFocus
                                        placeholder="Enter NPWP Number"
                                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                                        value={npwp}
                                        onChange={(e) => setNpwp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="companyName" className="text-base text-black-800 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        placeholder="Enter Company Name"
                                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="email" className="text-base text-black-800 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="email@company.com"
                                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="gap-2 self-stretch px-5 py-3 mt-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="inline w-4 h-4 me-3 animate-spin" />
                                            Registering...
                                        </>
                                        ) : (
                                        "Register"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 text-left">
                                <div className="flex mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white rounded-full opacity-20 "></div>
                                        <FaCheckCircle className="w-16 h-16 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-black mb-4">Registration Successful!</h2>
                                <p className="mb-4">Please check your email to get your password.</p>
                                <div className="flex gap-4 items-center ">
                                    <button
                                        onClick={handleResendPassword}
                                        className="gap-2 px-5 py-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[46px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                                        disabled={isLoading || resendCooldown > 0}
                                    >
                                        {isLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Password"}
                                    </button>
                                    <Link
                                        to="/auth/login"
                                        className="gap-2 px-5 py-3 text-base text-primary whitespace-nowrap rounded-lg border border-primary min-h-[48px] hover:bg-primarylight focus:bg-primarylight transition-colors"
                                    >
                                        Go to Sign In
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 text-left text-sm">
                            <p>
                                Already have an account?{" "}
                                <Link to="/auth/login" className="text-primary hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Register

