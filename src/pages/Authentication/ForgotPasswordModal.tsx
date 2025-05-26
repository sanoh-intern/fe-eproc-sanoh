import type React from "react"
import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import Logo from "../../assets/images/logo-sanoh.png"
import "react-toastify/dist/ReactToastify.css"
import VerificationCodeInput from "./VerificationPage"
import Button from "../../components/Forms/Button"
import PasswordInput from "../../components/PasswordInput"
import { toast } from "react-toastify"
import { sendResetPasswordOTP, verifyResetOTP, resetPassword } from "../../api/Action/Auth/auth-actions"

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const handleSendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const payload = { email: email };
            const result = await sendResetPasswordOTP(payload);
            
            if (result.success) {
                toast.success(result.message)
                setStep(2)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to send verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyCode = async (code: string) => {
        setIsLoading(true)
        try {
            const payload = { token: code, email: email };
            const result = await verifyResetOTP(payload);
            
            if (result.success) {
                setToken(code)
                toast.success(result.message)
                setStep(3)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Invalid verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.")
            return
        }
        setIsLoading(true)
        try {
            const payload = { 
                token: token, 
                email: email, 
                password: newPassword 
            };
            const result = await resetPassword(payload);
            
            if (result.success) {
                toast.success(result.message)
                setStep(4)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Failed to reset password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setEmail("")
        setToken("")
        setNewPassword("")
        setConfirmPassword("")
        setStep(1)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                        
                        <h2 className="text-2xl font-bold text-primary mb-6">Forgot Password</h2>
                        
                        {step === 1 && (
                            <form onSubmit={handleSendVerification} className="flex flex-col w-full">
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="email" className="text-base text-black-800 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        autoFocus
                                        placeholder="Enter your email"
                                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    title={isLoading ? "Sending..." : "Send Verification Code"}
                                    type="submit"
                                    className="w-full py-2 px-4 text-white font-semibold rounded-md transition-colors"
                                    disabled={isLoading}
                                />
                            </form>
                        )}
                        
                        {step === 2 && (
                            <div className="flex flex-col w-full">
                                <label htmlFor="verificationCode" className="text-base text-black-800 mb-4">
                                    Verification Code
                                </label>
                                <VerificationCodeInput onComplete={handleVerifyCode} />
                                {isLoading && <p className="mt-4 text-center">Verifying...</p>}
                            </div>
                        )}
                        
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="flex flex-col w-full">
                                <PasswordInput 
                                    title="New Password" 
                                    password={newPassword} 
                                    setPassword={setNewPassword} 
                                    isRequired
                                    autofocus
                                    classname="mb-4"
                                />
                                <PasswordInput 
                                    title="Confirm Password" 
                                    password={confirmPassword} 
                                    setPassword={setConfirmPassword} 
                                    isRequired 
                                />
                                <Button
                                    title={isLoading ? "Resetting..." : "Reset Password"}
                                    type="submit"
                                    className="mt-4 w-full py-2 px-4 text-white font-semibold rounded-md transition-colors"
                                    disabled={isLoading}
                                /> 
                            </form>
                        )}
                        
                        {step === 4 && (
                            <div className="text-center">
                                <p className="mb-4">Your password has been reset successfully.</p>
                                <button
                                    onClick={handleClose}
                                    className="gap-2 px-4 py-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
