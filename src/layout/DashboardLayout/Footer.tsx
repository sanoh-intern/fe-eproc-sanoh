import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">
              About e-Proc PT. Sanoh Indonesia
            </h3>
            <p className="mt-4 text-sm text-white">
              PT. Sanoh Indonesia E-Procurement is an application system used as a
              performance support facility and manages the procurement process at PT.
              Sanoh Indonesia.
            </p>
          </div>
          {/* Tautan Lainnya Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold">Tautan Lainnya</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="https://sanohindonesia.co.id/" className="text-sm text-white underline hover:text-secondary" target="_blank">
                  About Sanoh Indonesia
                </Link>
              </li>
              <li>
                <Link to="#https://sms.sanohindonesia.co.id/" className="text-sm text-white underline hover:text-secondary" target="_blank">
                  Supplier Management System
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info Section */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2 text-sm text-white">
              <li>Phone: (021) 8990 7965</li>
              <li>Email: info@sanohindonesia.co.id</li>
              <li>Fax: (021) 897 4449</li>
            </ul>
            <p className="mt-4 text-sm text-white">
              Address: Jl Inti II Blok C-4 No. 10, Kawasan Industri Hyundai, Cikarang - Bekasi
            </p>
          </div>
        </div>
        {/* Copyright Section */}
        <div className="mt-12 border-t border-primarylight pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} PT. Sanoh Indonesia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;