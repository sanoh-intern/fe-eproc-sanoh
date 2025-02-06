import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLogo from '../../../assets/images/user/user_logo_default.png';
import ClickOutside from '../../../components/ClickOutside';
import { FaCheckCircle, FaChevronDown, FaUserCog } from 'react-icons/fa';


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierImage, setSupplierImage] = useState('');

  // Ambil data dari localStorage pada saat komponen dimuat
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedSupplierName = localStorage.getItem('supplier_name');

    if (storedName) {
      setName(storedName);
    }

    if (storedSupplierName) {
      setSupplierName(storedSupplierName);
      setSupplierImage(`https://picsum.photos/seed/${storedSupplierName}/200`);
    }
  }, []);

  

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2"
        to="#"
      >
        <div className='flex items-center gap-4'>
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              {name || 'User Testing'}
            </span>
            <span className="block text-sm text-black">
              {supplierName || 'Non Verified'} 
            </span>
          </span>

          <div className="h-12 w-12 rounded-full relative bg-white border-2 border-primary p-0.5">
            <img
              src={supplierImage || UserLogo}
              alt="User"
              onError={(e) => {
              e.currentTarget.src = UserLogo;
              }}
              className="rounded-full"
            />
            {localStorage.getItem('verified') === 'true' && (
              <FaCheckCircle 
              className="absolute -top-1 -right-1 text-green-600 dark:text-emerald-300 bg-white rounded-full shadow-lg border-2 border-white" 
              size={20}
              />
            )}
          </div>
        </div>

        <FaChevronDown 
          className="hidden sm:block transition-colors text-primary duration-300 hover:text-dark" 
          size={14} 
        />
      </Link>

      {/* Dropdown Start */}
      {dropdownOpen && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        > 
          <Link
            to="/profile-settings"
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-black lg:text-base text-primary"
          >
            <FaUserCog className="fill-current" size={18} />
            Profile Settings
          </Link>
        </div>
      )}
      {/* Dropdown End */}
    </ClickOutside>
  );
};

export default DropdownUser;
