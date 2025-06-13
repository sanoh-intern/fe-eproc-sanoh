import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Table/Pagination';
import SearchBar from '../../components/Table/SearchBar';
import { FaSortDown, FaSortUp, FaToggleOff, FaToggleOn, FaUserEdit, FaUserPlus, FaTrash } from 'react-icons/fa';
import MultiSelect from '../../components/Forms/MultiSelect';
import Button from '../../components/Forms/Button';
import { API_List_User_Admin, API_Update_Status_Admin, API_Delete_User_Admin } from '../../api/route-api';
import useFetch from '../../api/useFetch';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

type TypeUser = {
    id: string;
    id_tax: string;
    email: string;
    bp_code: string;
    verification_status : string;
    company_name: string;
    role: string;
    account_status: string;
    deleted: boolean;
}
const ManageUser: React.FC = () => {
    const [filteredData, setFilteredData] = useState<TypeUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    const { data: userData, loading } = useFetch(API_List_User_Admin(), 'GET');
    
    useEffect(() => {
        const savedPage = localStorage.getItem('list_user_current_page');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
        if (userData){
            setFilteredData(userData);
        }
    }, []);    const handleStatusChange = async (userId: string, status: string, company_name: string) => {
        const url = `${API_Update_Status_Admin()}${userId}`;
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: status.toString() }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            toast.success(`User ${company_name} status updated successfully!`);
            return true;
        } catch (error) {
            toast.error(`Failed to update status for "${company_name}": ${error}`);
            return false;
        }
    };

    const handleDeleteUser = async (userId: string, company_name: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete user "${company_name}"? This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            const url = `${API_Delete_User_Admin()}${userId}`;
            const token = localStorage.getItem('access_token');
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                toast.success(`User ${company_name} deleted successfully!`);
                // Update the local state to reflect the change
                const newData = filteredData.map(item => 
                    item.id === userId 
                        ? {...item, deleted: true} 
                        : item
                );
                setFilteredData(newData);
                return true;
            } catch (error) {
                toast.error(`Failed to delete user "${company_name}": ${error}`);
                return false;
            }
        }
    };

    useEffect(() => {
        if (!userData) return;

        let filtered = [...userData];
    
        if (selectedRoles.length > 0) {
            filtered = filtered.filter((row) => selectedRoles.includes(row.role));
        }
        
    
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((row) =>
                (row.email?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false) ||
                (row.company_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false)
            );
        }
    
        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof TypeUser];
                const bValue = b[sortConfig.key as keyof TypeUser];
                
                if (!aValue || !bValue) return 0;
                
                if (sortConfig.key === 'Status') {
                    return sortConfig.direction === 'asc'
                        ? aValue.toString().localeCompare(bValue.toString())
                        : bValue.toString().localeCompare(aValue.toString());
                }
                
                return sortConfig.direction === 'asc'
                    ? aValue.toString().localeCompare(bValue.toString())
                    : bValue.toString().localeCompare(aValue.toString());
            });
        }
    
        setFilteredData(filtered);
    }, [searchQuery, selectedRoles, sortConfig, userData]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        localStorage.setItem('list_user_current_page', page.toString());
    };

    const handleSort = (key: keyof TypeUser) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleEditPage = (UserId: string) => {
        navigate(`/edit-user?userId=${UserId}`);
    };

    return (
        <>
            <Breadcrumb pageName="Manage User" />
            <div className="bg-white">
                <div className="p-2 md:p-4 lg:p-6 space-y-6">

                    {/* Header Section */}
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-1/2'>
                            <Button
                                title="Add User"
                                onClick={() => navigate('/add-user')}
                                icon={FaUserPlus}
                                className='transition-colors whitespace-nowrap flex items-center justify-center'
                            />

                            {/* Search Bar */}
                            <div className="w-full">
                                <SearchBar
                                    placeholder="Search user here..."
                                    onSearchChange={setSearchQuery}
                                />
                            </div>
                        </div>
                        
                        {/* Filters */}
                        <div className="w-full lg:w-1/3">
                            <MultiSelect
                                id="roleSelect"
                                label="Filter by Role"
                                options={Array.from(new Set((userData || []).map((item: TypeUser) => item.role)) as Set<string>).map((role) => ({ value: role, text: role }))}
                                selectedOptions={selectedRoles}
                                onChange={setSelectedRoles}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Email</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Supplier Code</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Company Name</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Verification Status</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Role</th>
                                        <th
                                            className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b cursor-pointer"
                                            onClick={() => handleSort('account_status')}
                                        >
                                            <span className="flex items-center justify-center">
                                                {sortConfig.key === 'account_status' ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <FaSortUp className="mr-1" />
                                                    ) : (
                                                        <FaSortDown className="mr-1" />
                                                    )
                                                ) : (
                                                    <FaSortDown className="opacity-50 mr-1" />
                                                )}
                                                Status
                                            </span>
                                        </th>                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Action</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Edit User</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        Array.from({ length: rowsPerPage }).map((_, index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                </td>                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full"></div>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : paginatedData.length > 0 ? (
                                        paginatedData.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.email || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.bp_code || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.company_name || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.verification_status || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.role}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.account_status}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <div className="relative">
                                                        {row.id === loadingUserId ? (
                                                                <div className="animate-spin justify-center rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    const userId = row.id;
                                                                    setLoadingUserId(userId);
                                                                    const success = await handleStatusChange(
                                                                        userId, 
                                                                        (row.account_status === "1" ? "0" : "1"), 
                                                                        row.company_name
                                                                    );
                                                                    if (success) {
                                                                        const newData = filteredData.map(item => 
                                                                            item.id === userId 
                                                                                ? {...item, account_status: item.account_status === "1" ? "0" : "1"} 
                                                                                : item
                                                                        );
                                                                        setFilteredData(newData);
                                                                    }
                                                                    setLoadingUserId(null);
                                                                }}
                                                                className="hover:opacity-80 transition-opacity flex flex-col items-center"
                                                            >
                                                                {row.account_status === '1' ? (
                                                                    <>
                                                                        <FaToggleOn className="text-3xl text-primary" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaToggleOff className="text-3xl text-gray-400" />
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleEditPage(row.id)}
                                                        className="hover:opacity-80 transition-opacity"
                                                    >
                                                        <FaUserEdit className="text-2xl text-primary" />
                                                    </button>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteUser(row.id, row.company_name)}
                                                        disabled={row.deleted}
                                                        className={`hover:opacity-80 transition-opacity ${
                                                            row.deleted 
                                                                ? 'cursor-not-allowed opacity-50' 
                                                                : 'cursor-pointer'
                                                        }`}
                                                    >
                                                        <FaTrash className={`text-2xl ${
                                                            row.deleted 
                                                                ? 'text-gray-400' 
                                                                : 'text-red-500 hover:text-red-700'
                                                        }`} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (                                        <tr>
                                            <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                                                No User available for now
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        totalRows={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                </div>
            </div>
        </>
    );
};

export default ManageUser;