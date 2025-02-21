import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Button from "../../components/Forms/Button";
import { roles } from "../../authentication/Role";
import { editUserAdmin, fetchUserDataAdmin } from "../../api/Action/Admin/ManageUser/manage-specific-user";


const EditUser = () => {
  const [companyName, setCompanyName] = useState("");
  const [npwp, setNpwp] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const validateEmail = (value: string) => {
    const atPos = value.indexOf("@");
    const dotPos = value.lastIndexOf(".");
    return atPos > 0 && dotPos > atPos + 1 && dotPos < value.length - 1;
  };

  useEffect(() => {
    if (userId) {
      fetchUserDataAdmin(userId).then((data) => {
        if (data) {
          setCompanyName(data.company_name);
          setNpwp(data.tax_id);
          setRole(data.role);
          setEmail(data.email);
        }
      });
    }
  }, [userId]);


  const generateRandomPassword = () => {
    if (companyName) {
      let nameForPassword = companyName.trim();
      const prefixRegex = /^(PT|CV|LLC|Ltd|Co\.?)\s+/i;
      if (prefixRegex.test(nameForPassword)) {
        nameForPassword = nameForPassword.replace(prefixRegex, "");
      }
      // Get the first word and extract its first 4 letters
      const firstWord = nameForPassword.split(" ")[0];
      const base = firstWord.substring(0, 4).toUpperCase();

      // Generate 6 random characters
      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      const randomChars = Array.from({ length: 6 }, () =>
        characters[Math.floor(Math.random() * characters.length)]
      ).join("");

      const finalPassword = base + randomChars;
      setPassword(finalPassword);
    } else {
      toast.warning("Please enter company name first to generate a password");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyName || !npwp || !role || !email) {
      Swal.fire(
        "Error",
        "Please fill all required fields correctly.",
        "error"
      );
      return;
    }

    const payload = {
      company_name: companyName,
      tax_id: npwp,
      role: role,
      email: email,
      password: password, // if left blank, API can decide how to handle (i.e., keep current)
    };

    if (userId) {
      editUserAdmin(payload, userId, navigate);
    } else {
      console.error("User ID is null");
      toast.error("User ID is missing.");
    }
  };

  return (
    <>
      <Breadcrumb 
        pageName="Edit User" 
        isSubMenu={true}
        parentMenu={{
          name: "Manage User",
          link: "/list-user" // Explicit link to parent
        }}
      />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="max-w-[1024px] mx-auto">
          <div className="p-4 md:p-6.5">
            {/* Company Name */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Company Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(e.target.value.toUpperCase())
                }
                placeholder="Enter company name"
                required
                style={{ textTransform: "uppercase" }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* NPWP */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                NPWP <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                placeholder="Enter NPWP"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Role */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Role <span className="text-meta-1">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  if (!validateEmail(email)) {
                    setEmailError("Please enter a valid email address");
                  } else {
                    setEmailError("");
                  }
                }}
                placeholder="Enter email"
                required
                className="w-full text-black rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {emailError && (
                <span className="text-red-500 text-sm mt-1">
                  {emailError}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Password <span className="text-meta-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
                {password.length > 0 && password.length < 8 && (
                  <span className="text-meta-1 text-sm mt-1">
                    Password must be at least 8 characters
                  </span>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  title="Generate Random Password"
                  onClick={generateRandomPassword}
                  className="px-4 py-2 bg-primary text-white rounded"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              title="Save Changes"
              type="submit"
              className="w-full justify-center"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;