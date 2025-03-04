import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Table/Pagination';
import SearchBar from '../../components/Table/SearchBar';
import { FaSortDown, FaSortUp, FaToggleOff, FaToggleOn, FaUserEdit, FaUserPlus } from 'react-icons/fa';
import MultiSelect from '../../components/Forms/MultiSelect';
import Button from '../../components/Forms/Button';
import { fetchUserListAdmin, TypeUser, updateUserStatusAdmin } from '../../api/Action/Admin/ManageUser/manage-user';

const ManageUser: React.FC = () => {
    const [data, setData] = useState<TypeUser[]>([]);
    const [filteredData, setFilteredData] = useState<TypeUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserListAdmin()
        .then((users) => {
            setData(users);
        setFilteredData(users);
        setLoading(false);
        })
        const savedPage = localStorage.getItem('list_user_current_page');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
    }, []);
    // handleStatusChange = async (userId: string, status: number, username: string) => {
    //     const token = localStorage.getItem('access_token');

    //     try {
    //         const response = await toast.promise(
    //             fetch(`${API_Update_Status_Admin()}${userId}`, {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ status: status.toString() }),
    //             }),
    //             {
    //                 pending: {
    //                     render: `Updating status for "${username}"...`,
    //                     autoClose: 3000
    //                 },
    //                 success: {
    //                     render: `Status for "${username}" Successfully Updated to ${status === 1 ? 'Active' : 'Deactive'}`,
    //                     autoClose: 3000
    //                 },
    //                 error: {
    //                     render({data}) {
    //                         return `Failed to update status for "${username}": ${data}`;
    //                     },
    //                     autoClose: 3000
    //                 }
    //             }
    //         );

    //         if (!response.ok) {
    //             throw new Error(`${response.status} ${response.statusText}`);
    //         }

    //         await response.json();
    //         // await fetchListUser();
    //         setData(data.map((item) => item.UserID === userId ? { ...item, Status: status === 1 ? 'Active' : 'Deactive', isLoading: false } : item));
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    useEffect(() => {
        let filtered = [...data];
    
        if (selectedRoles.length > 0) {
            filtered = filtered.filter((row) => selectedRoles.includes(row.Role));
        }
        
    
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((row) =>
                (row.Email?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false) ||
                (row.CompanyName?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false)
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
    }, [searchQuery, selectedRoles, sortConfig, data]);

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
                                options={Array.from(new Set(data.map(item => item.Role))).map(role => ({ value: role, text: role }))}
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
                                            onClick={() => handleSort('Status')}
                                        >
                                            <span className="flex items-center justify-center">
                                                {sortConfig.key === 'Status' ? (
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
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Action</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Edit User</th>
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
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.Email || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.SupplierCode || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.CompanyName || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.VerificationStatus || '-'}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.Role}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">{row.Status}</td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={async () => {
                                                            const updatedData = data.map(item =>
                                                                item.UserID === row.UserID ? { ...item, isLoading: true } : item
                                                            );
                                                            setData(updatedData);
                                                            const updateResult = await updateUserStatusAdmin(row.UserID, (row.Status === "1" ? "0" : "1"), row.CompanyName);
                                                            if (updateResult.status) {
                                                                setData(prevData =>
                                                                    prevData.map(item =>
                                                                        item.UserID === row.UserID
                                                                            ? { ...item, Status: row.Status === "1" ? "0" : "1", isLoading: false }
                                                                            : item
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        className="hover:opacity-80 transition-opacity"
                                                    >
                                                        {row.Status === '1' ?
                                                            <FaToggleOn className="text-3xl text-primary" /> :
                                                            <FaToggleOff className="text-3xl text-gray-400" />
                                                        }
                                                    </button>
                                                </td>
                                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleEditPage(row.UserID)}
                                                        className="hover:opacity-80 transition-opacity"
                                                    >
                                                        <FaUserEdit className="text-2xl text-primary" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                                                No List User available for now
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