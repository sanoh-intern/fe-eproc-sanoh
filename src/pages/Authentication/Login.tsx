import FotoSanoh from '../../assets/images/cover/maskot2.png';
import Logo from '../../assets/images/logo-sanoh.png'
import PasswordInput from '../../components/PasswordInput';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthContext';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

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
              src={FotoSanoh}
              alt="Login illustration"
              className="object-contain grow w-full h-auto aspect-[0.71] max-w-[710px] max-md:mt-10 max-md:max-w-[286px] max-sm:self-stretch max-sm:m-auto max-sm:w-full max-sm:max-w-[296px]"
            />
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full my-auto">
            <div className="flex flex-col mr-auto w-full max-w-[500px] max-md:mt-10 max-md:ml-0 max-sm:mt-5 max-sm:ml-auto max-sm:max-w-[301px]">
              <img
                loading="lazy"
                src={Logo}
                alt="Company logo"
                className="object-contain max-w-full aspect-[2.79] w-[120px] max-md:ml-1"
              />
              <form className="flex flex-col mt-6 w-full" onSubmit={onSubmit} autoComplete="off">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-base text-black-800 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    autoFocus
                    placeholder="email@company.com"
                    className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-secondary border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col mt-3">
                  <PasswordInput password={password} setPassword={setPassword} isRequired />
                </div>

                <div className="mt-3 text-right">
                  <Link to="/auth/reset/password" className="text-sm text-black hover:underline">
                    Forgot Password ?
                  </Link>
                </div>

                <button
                  id="login-button"
                  type="submit"
                  className="gap-2 self-stretch px-5 py-3 mt-3 text-base text-white whitespace-nowrap rounded-lg bg-primary min-h-[48px] hover:ring-4 focus:ring-4 hover:ring-primarylight focus:ring-primarylight"
                  disabled={isLoading}
                >
                  {isLoading ? (
                      <>
                          <FaSpinner className="inline w-4 h-4 me-3 animate-spin" />
                          Signing in...
                      </>
                      ) : (
                      "Sign in"
                  )}
                </button>
              </form>
              <div className="mt-6 text-left text-sm">
                <p>
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-primary hover:underline">
                  Register here
                  </Link>
                </p>
                <p className="mt-2">
                  <Link to="/" className="text-primary hover:underline">
                  Back to Home
                  </Link>
                </p>
              </div>
              <p className="self-center mt-9 text-xs font-medium text-center text-black w-[259px] max-md:mt-10 max-sm:self-center">
                <span className="text-primary">By Signing in, I accept the company&apos;s</span>
                <br />
                  <button
                  onClick={() => {
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
                    
                    // Handle click outside to close
                    modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                      modal.remove();
                    }
                    });

                    modal.innerHTML = `
                    <div class="bg-white p-8 rounded-lg relative max-w-2xl">
                      <button class="absolute top-2 right-2 text-black hover:text-primary" onclick="this.parentElement.parentElement.remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <h2 class="text-xl text-black font-bold mb-4">Terms of Use & Privacy Policy</h2>
                      <div class="text-black">
                        <h3 class="font-semibold mb-2">Terms of Use</h3>
                        <p class="mb-4">By using our service, you agree to follow all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account.</p>
                        <h3 class="font-semibold mb-2">Privacy Policy</h3>
                        <p>We collect and process your personal information in accordance with our privacy policy. Your data is protected and will only be used for service-related purposes.</p>
                      </div>
                    </div>
                    `;
                    document.body.appendChild(modal);
                  }}
                  className="text-primary hover:text-secondary underline cursor-pointer"
                  >
                  Terms of Use & Privacy Policy
                  </button>
              </p>
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
