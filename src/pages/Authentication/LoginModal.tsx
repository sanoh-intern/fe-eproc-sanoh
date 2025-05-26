import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/images/logo-sanoh.png"
import { useAuth } from "../../authentication/AuthContext"
import { FaTimes } from "react-icons/fa"
import Button from "../../components/Forms/Button"
import PasswordInput from "../../components/PasswordInput"
import { ForgotPasswordModal } from "./ForgotPasswordModal"

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const success = await login(email, password)
        if (success) {
            onClose()
            navigate("/dashboard")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="relative bg-white rounded-lg shadow-2xl dark:bg-gray-800 p-8">
                    <button
                        type="button"
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        onClick={onClose}
                    >
                        <FaTimes className="w-6 h-6" />
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <img src={Logo || "/placeholder.svg"} alt="Company logo" className="w-32 mb-6" />
                        <h3 className="mb-6 text-2xl font-semibold text-primary dark:text-white text-center">
                            Sign in to our platform
                        </h3>
                        <form className="w-full space-y-6" onSubmit={onSubmit}>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-base text-black  mb-2">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    autoFocus
                                    placeholder="name@company.com"
                                    className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mt-3">
                                <PasswordInput password={password} setPassword={setPassword} isRequired />
                            </div>                            <div className="flex justify-between items-center">
                                <button 
                                    type="button"
                                    onClick={() => setIsForgotPasswordOpen(true)}
                                    className="text-sm text-black hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Button
                                title={isLoading ? "Signing in..." : "Sign In"}
                                type="submit"
                                className="w-full py-2 px-4  text-white font-semibold rounded-md transition-colors"
                                disabled={isLoading}
                            />
                        </form>
                        <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
                        Not registered?{" "}
                            <Link to="/auth/register" className="text-primary hover:underline">
                                Register here
                            </Link>                        </div>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal 
                isOpen={isForgotPasswordOpen} 
                onClose={() => setIsForgotPasswordOpen(false)} 
            />
        </div>
    )
}

