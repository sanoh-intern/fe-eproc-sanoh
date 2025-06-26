import fotoSanoh from '../assets/images/cover/maskot2.png';
import { Timeline } from 'flowbite-react';
import { FaCheckCircle, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import { FaFileCircleCheck } from 'react-icons/fa6';
import { LoginModal } from './Authentication/LoginModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-[#f8fafc] py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                                e-Proc
                                <br />
                                PT. Sanoh Indonesia
                            </h1>
                            <p className="mt-4 text-lg text-primary">
                                E-Procurement System PT. Sanoh Indonesia is an application system used as a performance support facility and manages the procurement process at PT. Sanoh Indonesia.
                            </p>                            
                            <div className="mt-8">
                                <div className="flex gap-4">
                                    <button
                                        className="bg-primary text-white hover:bg-secondary px-6 py-3 rounded-lg text-base font-medium"
                                        onClick={() => setIsLoginModalOpen(true)}
                                    >
                                        Sign In
                                    </button>
                                    <Link
                                        to="/auth/register"
                                        className="bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src={fotoSanoh}
                                alt="E-Procurement Illustration"
                                className="w-full max-w-md"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Announce System */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary">Announce System</h2>
                        <p className="mt-2 text-primary">
                            Latest announcements system status from PT. Sanoh Indonesia.
                        </p>
                    </div>
                    <div className="mt-8">
                        <ul className="space-y-4">
                            <li className="bg-white p-4 rounded-md shadow hover:shadow-md transition duration-300">
                                <span className="text-xl font-semibold text-primary">
                                    Pengumuman Tender Terbaru
                                </span>
                                <p className="mt-2 text-primary">
                                    Detail pengumuman tender terbaru termasuk jadwal dan persyaratan.
                                </p>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>

            {/* Service Flow */}
            <div className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-primary">Service Flow</h2>
                        <p className="mt-4 text-primary">Flow sistem e-Procurement</p>
                    </div>
                    <Timeline horizontal className="md:w-full">                        <Timeline.Item className='md:w-1/4'>
                            <Timeline.Point icon={FaClipboardList} />
                            <Timeline.Content>
                                <Timeline.Time>Step 1</Timeline.Time>
                                <Timeline.Title>Register</Timeline.Title>
                                <Timeline.Body>
                                    The applicant (company) registers through the application using the register button above.
                                </Timeline.Body>
                            </Timeline.Content>
                        </Timeline.Item>
                        <Timeline.Item className='md:w-1/4'>
                            <Timeline.Point icon={FaFileAlt} />
                            <Timeline.Content>
                                <Timeline.Time>Step 2</Timeline.Time>
                                <Timeline.Title>Complete Documents</Timeline.Title>
                                <Timeline.Body>
                                    The applicant/company completes the required data.
                                </Timeline.Body>
                            </Timeline.Content>
                        </Timeline.Item>
                        <Timeline.Item className='md:w-1/4'>
                            <Timeline.Point icon={FaFileCircleCheck} />
                            <Timeline.Content>
                                <Timeline.Time>Step 3</Timeline.Time>
                                <Timeline.Title>Document Verification</Timeline.Title>
                                <Timeline.Body>
                                    The verification process of the documents filled by the applicant/company.
                                </Timeline.Body>
                            </Timeline.Content>
                        </Timeline.Item>
                        <Timeline.Item className='md:w-1/4'>
                            <Timeline.Point icon={FaCheckCircle} />
                            <Timeline.Content>
                                <Timeline.Time>Step 4</Timeline.Time>
                                <Timeline.Title>Completion</Timeline.Title>
                                <Timeline.Body>
                                    The certificate can be viewed and downloaded through the application.
                                </Timeline.Body>
                            </Timeline.Content>
                        </Timeline.Item>
                    </Timeline>
                </div>
            </div>            
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
    );
};

export default LandingPage;