import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTimes, FaCheckCircle } from "react-icons/fa"
import Logo from "../../assets/images/logo-sanoh.png"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import { registerUser, resendPassword } from "../../api/Action/Auth/auth-actions"
import Button from "../../components/Forms/Button"

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
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
            toast.error("Registration failed. Please try again.")
        } finally {
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
                setResendCooldown(61)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to resend password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setNpwp("")
        setCompanyName("")
        setEmail("")
        setIsRegistered(false)
        setResendCooldown(0)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800 p-8">
                    <button
                        type="button"
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={handleClose}
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center">
                        <img
                            loading="lazy"
                            src={Logo}
                            alt="Company logo"
                            className="object-contain max-w-full aspect-[2.79] w-[120px] mb-6"
                        />
                        
                        {!isRegistered ? (
                            <>
                                <h2 className="text-2xl font-bold text-primary mb-6">Register</h2>
                                <form className="flex flex-col w-full" onSubmit={handleSubmit} autoComplete="off">
                                    <div className="flex flex-col mb-4">
                                        <label htmlFor="npwp" className="text-base text-black-800 mb-2">
                                            NPWP Number <span className="text-red-500">*</span>
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
                                            Company Name <span className="text-red-500">*</span>
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
                                            Email <span className="text-red-500">*</span>
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
                                    <Button
                                        title={isLoading ? "Registering..." : "Register"}
                                        type="submit"
                                        className="w-full py-2 px-4 text-white font-semibold rounded-md transition-colors"
                                        disabled={isLoading}
                                    />
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
                                        <FaCheckCircle className="w-16 h-16 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-black mb-4">Registration Successful!</h2>
                                <p className="mb-4">Please check your email to get your password.</p>
                                <div className="flex gap-4 items-center justify-center">
                                    <button
                                        onClick={handleResendPassword}
                                        className="gap-2 px-5 py-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[46px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                                        disabled={isLoading || resendCooldown > 0}
                                    >
                                        {isLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Password"}
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="gap-2 px-5 py-3 text-base text-primary whitespace-nowrap rounded-lg border border-primary min-h-[48px] hover:bg-primarylight focus:bg-primarylight transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link to="/auth/login" className="text-primary hover:underline" onClick={handleClose}>
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
