import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import Logo from "../../assets/images/logo-sanoh.png"
import FotoSanoh from "../../assets/images/cover/maskot2.png"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const handleSendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
        // Simulating API call to send verification code
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Verification code sent to your email.")
        setStep(2)
        } catch (error) {
        toast.error("Failed to send verification code. Please try again.")
        } finally {
        setIsLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
        // Simulating API call to verify code
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Verification code confirmed.")
        setStep(3)
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
        // Simulating API call to reset password
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Password reset successfully. You can now login with your new password.")
        setStep(4)
        } catch (error) {
        toast.error("Failed to reset password. Please try again.")
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <>
        <ToastContainer position="top-right" />
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
                alt="Forgot Password illustration"
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
                <h2 className="text-2xl font-bold text-primary mt-6 mb-4">Forgot Password</h2>
                {step === 1 && (
                    <form onSubmit={handleSendVerification} className="flex flex-col w-full">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="text-base text-black-800 mb-2">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
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
                        {isLoading ? "Sending..." : "Send Verification Code"}
                    </button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="flex flex-col w-full">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="verificationCode" className="text-base text-black-800 mb-2">
                        Verification Code
                        </label>
                        <input
                        type="text"
                        id="verificationCode"
                        placeholder="Enter verification code"
                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        />
                    </div>
                    <button
                        type="submit"
                        className="gap-2 self-stretch px-5 py-3 mt-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col w-full">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="newPassword" className="text-base text-black-800 mb-2">
                        New Password
                        </label>
                        <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="confirmPassword" className="text-base text-black-800 mb-2">
                        Confirm New Password
                        </label>
                        <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />
                    </div>
                    <button
                        type="submit"
                        className="gap-2 self-stretch px-5 py-3 mt-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    </form>
                )}
                {step === 4 && (
                    <div className="text-center">
                    <p className="mb-4">Your password has been reset successfully.</p>
                    <Link
                        to="/login"
                        className="gap-2 self-stretch px-5 py-3 mt-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight inline-block"
                    >
                        Go to Login
                    </Link>
                    </div>
                )}
                <div className="mt-6 text-left text-sm">
                    <p>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                        Register here
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

export default ForgotPassword

