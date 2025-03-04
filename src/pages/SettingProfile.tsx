"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaCamera, FaEdit, FaSpinner } from "react-icons/fa"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Button from "../components/Forms/Button"
import VerificationCodeInput from "./Authentication/VerificationPage"
// import PasswordInput from "../components/PasswordInput"
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb"
import Loader from "../common/Loader"

interface ProfileData {
  photoUrl: string
  companyName: string
  supplierCode: string
  email: string
}

// Simulated API functions
const api = {
  fetchProfileData: async (): Promise<ProfileData> => {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      photoUrl: "data:image/jpeg;base64,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",
      companyName: "Coba IT Solutions",
      supplierCode: "SUP-20250200100492",
      email: "contact@cobait.com",
    }
  },
  updateProfilePhoto: async (file: File): Promise<string> => {
    // Simulating API delay and response
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return URL.createObjectURL(file)
  },
  sendVerificationCode: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Simulating success (in real scenario, this would send an email)
  },
  verifyCode: async (code: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return code === "123456" // Simulating a correct code
  },
  changePassword: async (newPassword: string): Promise<void> => {
    console.log("Changing password to:", newPassword)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Simulating success (in real scenario, this would update the password)
  },
}

const SettingProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [passwordStep, setPasswordStep] = useState(1)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await api.fetchProfileData()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data")
      }
    }

    loadProfileData()
  }, [])

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      try {
        const newPhotoUrl = await api.updateProfilePhoto(file)
        setProfileData((prev) => (prev ? { ...prev, photoUrl: newPhotoUrl } : null))
        toast.success("Profile photo updated successfully")
      } catch (error) {
        console.error("Error uploading photo:", error)
        toast.error("Failed to upload photo")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.sendVerificationCode()
      toast.success("Verification code sent to your email.")
      setPasswordStep(2)
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true)
    try {
      const isValid = await api.verifyCode(code)
      if (isValid) {
        toast.success("Verification code confirmed.")
        setPasswordStep(3)
      } else {
        toast.error("Invalid verification code. Please try again.")
      }
    } catch (error) {
      toast.error("Error verifying code. Please try again.")
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
      await api.changePassword(newPassword)
      toast.success("Password changed successfully.")
      setIsEditingPassword(false)
      setPasswordStep(1)
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error("Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!profileData) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <Breadcrumb pageName="Profile Settings" />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              <img
                src={profileData.photoUrl || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-dark transition-colors duration-200"
              >
                <FaCamera />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-primary">{profileData.companyName}</h2>
              <p className="text-primary mt-1">Supplier Code: {profileData.supplierCode}</p>
              <p className="text-primary mt-1">{profileData.email}</p>
            </div>
          </div>

            <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-primary">Account Security</h3>
            {!isEditingPassword ? (
              <Button
              title="Change Password"
              onClick={() => setIsEditingPassword(true)}
              className="w-full sm:w-auto"
              icon={FaEdit}
              iconClassName="mr-2"
              />
            ) : (
              <Button
                title="Cancel"
                onClick={() => {
                  setIsEditingPassword(false)
                  setPasswordStep(1)
                }}
                className="w-full sm:w-auto bg-red-600 text-primary hover:bg-red-700"
              />
            )}
            </div>
        </div>
      </div>

      {isEditingPassword && (
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Change Password</h2>
            {passwordStep === 1 && (
                <form onSubmit={handleSendVerification} className="flex flex-col w-full">
                <p className="mb-4 text-primary">We'll send a verification code to your email.</p>
                <Button
                  title={isLoading ? "Sending..." : "Send Verification Code"}
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                  icon={isLoading ? FaSpinner : undefined}
                  iconClassName={isLoading ? "animate-spin mr-2" : "mr-2"}
                />
                </form>
            )}
            {passwordStep === 2 && (
              <div className="flex flex-col w-full">
                <label htmlFor="verificationCode" className="text-base text-primary mb-4">
                  Enter Verification Code
                </label>
                <VerificationCodeInput onComplete={handleVerifyCode} />
                {isLoading && <p className="mt-4 text-center text-primary">Verifying...</p>}
              </div>
            )}
            {passwordStep === 3 && (
                <form onSubmit={handleResetPassword} className="flex flex-col w-full">
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-primary text-sm font-bold mb-2">
                  New Password
                  </label>
                  <input
                  type="password"
                  id="newPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="confirmPassword" className="block text-primary text-sm font-bold mb-2">
                  Confirm Password
                  </label>
                  <input
                  type="password"
                  id="confirmPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  />
                </div>
                <Button
                  title={isLoading ? "Changing..." : "Change Password"}
                  type="submit"
                  className="mt-6 w-full sm:w-auto"
                  disabled={isLoading}
                  icon={isLoading ? FaSpinner : undefined}
                  iconClassName={isLoading ? "animate-spin mr-2" : "mr-2"}
                />
                </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SettingProfile

