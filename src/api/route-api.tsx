const API = 'https://api.e-proc.profileporto.site/api/v1';
// const API = 'http://127.0.0.1:8000/api';
// const API = 'https://be-sss-dev.sanohindonesia.co.id:8443/api';

const getRolePath = () => {
    const userRole = localStorage.getItem('role');
    return userRole ? `/${userRole}` : '';
};

// AUTH API endpoint
export const API_Login = () => API + '/login';
export const API_Logout = () => API + getRolePath() + `/logout`;

export const API_Email = () => API + `/email`;

// Global API
export const API_Dashboard = () => API + getRolePath() + `/dashboard`;
export const API_Detail_Offer = () => API + getRolePath() + `/project-header/get/`;

// Global Admin API
export const API_Create_Offer_Admin = () => API + getRolePath() + `/project-header/create`;
export const API_Update_Offer_Admin = () => API + getRolePath() + `/project-header/update/`;
export const API_Update_Status_Offer_Admin = () => API + getRolePath() + `/project-header/update/regis-status/`;
export const API_Delete_Offer_Admin = () => API + getRolePath() + `/project-header/delete/`;
export const API_List_Offer_Admin = () => API + getRolePath() + `/project-header/index`;
export const API_Edit_Detail_Offer_Admin = () => API + getRolePath() + `/project-header/edit/`;
export const API_Select_Winner_Offer_Admin = () => API + getRolePath() + `/project-header/winner`;

// Manage User Admin
export const API_User_Online_Admin = () => API + getRolePath() + `/user/online`;
export const API_User_Logout_Admin = () => API + getRolePath() + `/user/logout`;
export const API_User_Login_Performance__Admin = () => API + getRolePath() + `/user/monthly`;

export const API_Create_User_Admin = () => API + getRolePath() + '/user/create';
export const API_Edit_User_Admin = () => API + getRolePath() + '/user/edit/';
export const API_Get_Email_Admin = () => API + getRolePath() + '/user/email/';
export const API_Update_User_Admin = () => API + getRolePath() + '/user/update/';
export const API_List_User_Admin = () => API + getRolePath() + '/user/index';
export const API_Update_Status_Admin = () => API + getRolePath() + `/user/update/status/`;

// Supplier API
export const API_Project_Public_Supplier = () => API + getRolePath() + '/project-header/list-public/get';
export const API_Project_Private_Supplier = () => API + getRolePath() + '/project-header/list-invited/get';
export const API_Project_Followed_Supplier = () => API + getRolePath() + '/project-header/followed/get';
export const API_Register_Project_Supplier = () => API + getRolePath() + '/project-header/join/';
export const API_Negotiation_Supplier = () => API + getRolePath() + '/project-detail/list-offer/get/';
export const API_Post_Proposal_Supplier = () => API + getRolePath() + '/project-detail/create';

// // Purchase Order Admin
// export const API_PO_Admin = () => API + getRolePath() + `/po/index/`;
// export const API_PO_Detail_Admin = () => API + getRolePath() + `/po/detail/`;
// export const API_PO_History_Admin = () => API + getRolePath() + `/po/history/`;

// // Performance Report Admin
// export const API_Performance_Report_Admin = () => API + getRolePath() + `/performance-report/index/`;
// export const API_Create_Performance_Report_Admin = () => API + getRolePath() + `/performance-report/store`;

// export const API_Forecast_Report_Admin = () => API + getRolePath() + `/forecast/index/`;
// export const API_Create_Forecast_Report_Admin = () => API + getRolePath() + `/forecast/store`;
// export const API_Delete_Forecast_Report_Admin = () => API + getRolePath() + `/forecast/delete/`;

// // Delivery Note Admin
// export const API_DN_Admin = () => API + getRolePath() + `/dn/index/`;
// export const API_DN_Detail_Admin = () => API + getRolePath() + `/dn/detail/`;
// export const API_DN_History_Admin = () => API + getRolePath() + `/dn/history/`;

// // Subcont Admin
// export const API_Create_Item_Subcont_Admin = () => API + getRolePath() + `/item/store`;
// export const API_List_Item_Subcont_Admin = () => API + getRolePath() + `/item/list/`;
// export const API_Stock_Item_Subcont_Admin = () => API + getRolePath() + `/item/index/`;
// export const API_Transaction_Report_Subcont_Admin = () => API + getRolePath() + `/transaction/index/`;
// export const API_List_Item_ERP_Subcont_Admin = () => API + getRolePath() + `/item/list/item`;
// export const API_Manage_Item_Subcont_Admin = () => API + getRolePath() + `/item/all-list/`;
// export const API_Update_Item_Subcont_Admin = () => API + getRolePath() + `/item/update`;
// export const API_Delete_Item_Subcont_Admin = () => API + getRolePath() + `/item/delete`;
// export const API_Initial_Stock_Subcont_Admin = () => API + getRolePath() + `/item/stock/initial`;
// export const API_Create_Transaction_Subcont_Admin = () => API + getRolePath() + `/transaction/store/`;
// export const API_Transaction_Review_Subcont_Admin = () => API + getRolePath() + `/transaction-review/header/`;
// export const API_Transaction_Review_Detail_Subcont_Admin = () => API + getRolePath() + `/transaction-review/detail/`;
// export const API_Transaction_Review_Update_Subcont_Admin = () => API + getRolePath() + `/transaction-review/update`;
// export const API_Dashboard_Performance_Subcont_Admin = () => API + getRolePath() + `/dashboard/performance-subcont/`;

// // Purchase Order Supplier
// export const API_PO = () => API + getRolePath() + `/po/index`;
// export const API_PO_Detail = () => API + getRolePath() + `/po/detail/`;
// export const API_Update_PO = () => API + getRolePath() + `/po/update/`;
// export const API_PO_History = () => API + getRolePath() + `/po/history`;

// // Delivery Note Supplier
// export const API_DN = () => API + getRolePath() + `/dn/index`;
// export const API_DN_Detail = () => API + getRolePath() + `/dn/detail/`;
// export const API_DN_Edit = () => API + getRolePath() + `/dn/edit/`;
// export const API_Update_DN = () => API + getRolePath() + `/dn/update`;
// export const API_DN_History = () => API + getRolePath() + `/dn/history`;

// // Performance Report Supplier
// export const API_Performance_Report = () => API + getRolePath() + `/performance-report/index`;

// // Forecast Report Supplier
// export const API_Forecast_Report = () => API + getRolePath() + `/forecast/index`;

// // Subcont Supplier
// export const API_Item_Subcont = () => API + getRolePath() + `/item/index`;
// export const API_List_Item_Subcont = () => API + getRolePath() + `/item/list`;
// export const API_Transaction_Subcont = () => API + getRolePath() + `/transaction/index`;
// export const API_Create_Transaction_Subcont = () => API + getRolePath() + `/transaction/store`;