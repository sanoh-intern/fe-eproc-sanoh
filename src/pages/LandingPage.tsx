import { ClipboardList, FileCheck, FileText, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom';
import fotoSanoh from '../assets/images/cover/maskot2.png';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-[#f8fafc] py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                                e-Proc
                                <br />
                                PT. Sanoh Indonesia
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                E-Procurement System PT. Sanoh Indonesia is an application system used as a performance support facility and manages the procurement process at PT. Sanoh Indonesia.
                            </p>
                            <div className="mt-8">
                                <Link
                                    to="/register"
                                    className="bg-gray-800 text-white hover:bg-primary px-6 py-3 rounded-lg text-base font-medium inline-block"
                                >
                                    Get Started
                                </Link>
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
                        <h2 className="text-3xl font-bold text-[#1e2f65]">Announce System</h2>
                        <p className="mt-2 text-gray-600">
                            Informasi pengumuman terbaru mengenai tender dan penawaran project.
                        </p>
                    </div>
                    <div className="mt-8">
                        <ul className="space-y-4">
                            <li className="bg-white p-4 rounded-md shadow">
                                <Link to="/pengumuman" className="text-xl font-semibold text-[#1e2f65] hover:underline">
                                    Pengumuman Tender Terbaru
                                </Link>
                                <p className="mt-2 text-gray-600">
                                    Detail pengumuman tender terbaru termasuk jadwal dan persyaratan.
                                </p>
                            </li>
                            <li className="bg-white p-4 rounded-md shadow">
                                <Link to="/pengumuman" className="text-xl font-semibold text-[#1e2f65] hover:underline">
                                    Informasi Vendor Terverifikasi
                                </Link>
                                <p className="mt-2 text-gray-600">
                                    Update tentang vendor-vendor terverifikasi yang ikut tender.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Service Flow */}
            <div className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#1e2f65]">Alur Pelayanan</h2>
                        <p className="mt-4 text-gray-600">Alur proses pelayanan yang akan dilalui</p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-[#1e2f65]">
                                <ClipboardList className="h-12 w-12" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-[#1e2f65]">Registrasi</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Permohonan (Perusahaan) melakukan registrasi melalui aplikasi.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-[#1e2f65]">
                                <FileText className="h-12 w-12" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-[#1e2f65]">Melengkapi Dokumen</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Permohonan/Perusahaan melakukan pengisian kelengkapan data.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-[#1e2f65]">
                                <FileCheck className="h-12 w-12" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-[#1e2f65]">Verifikasi Dokumen</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Proses verifikasi dokumen pemohon/perusahaan yang sudah di isi.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-[#1e2f65]">
                                <CheckCircle className="h-12 w-12" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-[#1e2f65]">Selesai</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Sertifikat dapat dilihat dan di unduh melalui aplikasi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <footer className="bg-[#1e2f65] text-white">
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-lg font-semibold">Tentang e-Procurement PT. Pos Indonesia</h3>
                            <p className="mt-4 text-sm text-gray-300">
                                E-Procurement PT. Pos Indonesia (Persero) merupakan sistem aplikasi yang digunakan untuk sarana pendukung kinerja dan mengatur pengelolaan proses pengadaan pada PT. Pos Indonesia (Persero).
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Produk</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pos Instan Plus
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pos Instan
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pos Express
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pos Kilat Khusus
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        EMS
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Tautan Lainnya</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pos Ekspor
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        e-Packet
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="text-sm text-gray-300 hover:text-white">
                                        Pospay
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer> */}
        </div>
    );
};

export default LandingPage;