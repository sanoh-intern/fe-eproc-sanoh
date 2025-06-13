"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FaCamera, FaEdit, FaSpinner, FaBuilding, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import Button from "../components/Forms/Button"
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb"
import Loader from "../common/Loader"
import useFetch from "../api/useFetch"
import { API_Mini_Profile_Supplier, API_Update_File_General_Data_Supplier, API_Change_Password } from "../api/route-api"

interface ProfileData {
  id: string
  company_photo: string | null
  bp_code: string | null
  email: string
  company_name: string | null
  tax_id: string
  company_description: string
  business_field: string
  sub_business_field: string
  profile_verified_at: string | null
}

const SettingProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  // Fetch profile data using the real API
  const { data: miniProfileData, loading: profileLoading, refetch } = useFetch(API_Mini_Profile_Supplier(), "GET")

  useEffect(() => {
    if (miniProfileData) {
      setProfileData(miniProfileData)
    }
  }, [miniProfileData])

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploadingPhoto(true)
      try {
        const formData = new FormData()
        formData.append('company_photo', file)

        const token = localStorage.getItem("access_token")
        const headers: Record<string, string> = {}
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const response = await fetch(API_Update_File_General_Data_Supplier(), {
          method: 'POST',
          headers,
          body: formData,
        })

        const result = await response.json()

        if (result.status === true) {
          toast.success("Profile photo updated successfully")
          // Refetch profile data to get updated photo
          refetch()
        } else {
          toast.error(result.error || "Failed to upload photo")
        }
      } catch (error) {
        console.error("Error uploading photo:", error)
        toast.error("Failed to upload photo")
      } finally {
        setIsUploadingPhoto(false)
      }
    }  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate password length
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: 'Change Password?',
      text: 'Are you sure you want to change your password?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#374151', // abu tua (gray-700)
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const response = await fetch(API_Change_Password(), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            new_password: newPassword,
            new_password_confirmation: confirmPassword
          }),
        })

        const apiResult = await response.json()

        if (apiResult.status === true) {
          await Swal.fire({
            title: 'Success!',
            text: 'Password changed successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#374151', // abu tua (gray-700)
          })
          setIsEditingPassword(false)
          setNewPassword("")
          setConfirmPassword("")
          setShowPassword(false)
        } else {
          toast.error(apiResult.error || "Failed to change password")
        }
      } catch (error) {
        console.error("Error changing password:", error)
        toast.error("Failed to change password")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!profileData || profileLoading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      <Breadcrumb pageName="Profile Settings" />
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              {profileData.company_photo ? (
                <img
                  src={profileData.company_photo}
                  alt="Company Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  onError={(e) => {
                    // If image fails to load, show building icon
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const iconDiv = document.createElement('div');
                      iconDiv.className = 'w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-gray-100';
                      iconDiv.innerHTML = `
                        <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <!-- Building / Company icon -->
                          <path d="M4 3h12v14H4V3zm2 2v2h2V5H6zm0 4v2h2V9H6zm0 4v2h2v-2H6zm4-8v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2zm4-8v2h2V5h-2zm0 4v2h2V9h-2z"/>
                        </svg>
                      `;
                      parent.appendChild(iconDiv);
                    }
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-gray-100">
                  <FaBuilding className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-dark transition-colors duration-200"
              >
                {isUploadingPhoto ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-primary">
                {profileData.company_name || "Company Name Not Set"}
              </h2>
              <p className="text-primary mt-1">
                Supplier Code: {profileData.bp_code || "Not Available"}
              </p>
              <p className="text-primary mt-1">{profileData.email}</p>
              <div className="mt-2 flex items-center">
                {profileData.profile_verified_at ? (
                  <div className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-2" />
                    <span>Verified on {new Date(profileData.profile_verified_at).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <FaTimesCircle className="mr-2" />
                    <span>Not Verified</span>
                  </div>
                )}
              </div>
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
              />            ) : (
              <Button
                title="Cancel"
                onClick={() => {
                  setIsEditingPassword(false)
                  setNewPassword("")
                  setConfirmPassword("")
                  setShowPassword(false)
                }}
                className="w-full sm:w-auto bg-red-600 text-primary hover:bg-red-700"
              />
            )}
            </div>
        </div>
      </div>      {isEditingPassword && (
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Change Password</h2>
            <form onSubmit={handleChangePassword} className="flex flex-col w-full">
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-primary text-sm font-bold mb-2">
                  New Password
                </label>
                <p className="text-sm text-gray-600 mb-2">Wajib 8 karakter bebas</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-primary leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter new password (minimum 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>
                )}
              </div>
              <div className="mb-6">
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
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
              <Button
                title={isLoading ? "Changing..." : "Change Password"}
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                icon={isLoading ? FaSpinner : undefined}
                iconClassName={isLoading ? "animate-spin mr-2" : "mr-2"}
              />
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingProfile

