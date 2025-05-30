const API = 'https://api.e-proc.profileporto.site/api/v1';
// const API = 'http://127.0.0.1:8000/api';
// const API = 'https://be-eproc.sanohindonesia.co.id:8444/api/v1';

const getRolePath = () => {
    const userRole = localStorage.getItem('role');
    return userRole ? `/${userRole}` : '';
};

// AUTH API endpoint
export const API_Login = () => API + '/login';
export const API_Logout = () => API + getRolePath() + `/logout`;

export const API_Register = () => API + '/guest/register';
export const API_Resend_Password = () => API + getRolePath() + `/guest/resend-password`;
export const API_OTP_Mail_Reset_Password = () => API + '/guest/reset-password';
export const API_Verify_OTP = () => API + getRolePath() + `/guest/verification-token/`;
export const API_Reset_Password = () => API + getRolePath() + `/guest/reset-password/`;

export const API_Email = () => API + `/email`;

// Global API
export const API_Dashboard = () => API + getRolePath() + `/dashboard`;
export const API_Detail_Offer = () => API + getRolePath() + `/project-header/get/`;
export const API_Download_Document = () => API + `/download/project/attachment/`;
export const API_Stream_Document = () => API + getRolePath() + `/stream/file`;

// Global Admin API
export const API_List_Offer_Admin = () => API + getRolePath() + `/project-header/manage-offer/get/all`;
export const API_Create_Offer_Admin = () => API + getRolePath() + `/project-header/create`;
export const API_Update_Status_Offer_Admin = () => API + getRolePath() + `/project-header/update/regis-status/`;
export const API_Delete_Offer_Admin = () => API + getRolePath() + `/project-header/delete/`;
export const API_Update_Offer_Admin = () => API + getRolePath() + `/project-header/update/`;
export const API_Get_Edit_Detail_Offer_Admin = () => API + getRolePath() + `/project-header/edit/`;

export const API_List_Registered_Offer_Admin = () => API + getRolePath() + `/project-header/registered-offer/get/all`;
export const API_List_Supplier_Proposal_Admin = () => API + getRolePath() + `/project-header/list-proposal/`;
export const API_List_Supplier_Registered_Admin = () => API + getRolePath() + `/project-header/registered/`;

export const API_History_Proposal_Admin = () => API + getRolePath() + `/project-detail/list-offer/get/`;

export const API_Accepted_Proposal_Admin = () => API + getRolePath() + `/project-header/accepted`;
export const API_Declined_Proposal_Admin = () => API + getRolePath() + `/project-detail/declined/`;

export const API_Last_Seen_Admin = () => API + getRolePath() + `/project-header/view/`;

// Manage User Admin
export const API_User_Online_Admin = () => API + getRolePath() + `/user/online`;
export const API_User_Logout_Admin = () => API + getRolePath() + `/user/logout`;
export const API_User_Login_Performance__Admin = () => API + getRolePath() + `/user/monthly`;

export const API_Create_User_Admin = () => API + getRolePath() + '/user/create';
export const API_Edit_User_Admin = () => API + getRolePath() + '/user/edit/';
// export const API_Get_Email_Admin = () => API + getRolePath() + '/user/email/';
export const API_Update_User_Admin = () => API + getRolePath() + '/user/update/';
export const API_List_User_Admin = () => API + getRolePath() + '/user/list';
export const API_Update_Status_Admin = () => API + getRolePath() + `/user/update/status/`;

// Supplier API
export const API_Project_Public_Supplier = () => API + getRolePath() + '/project-header/list-public/get';
export const API_Project_Private_Supplier = () => API + getRolePath() + '/project-header/list-invited/get';
export const API_Project_Followed_Supplier = () => API + getRolePath() + '/project-header/followed/get';
export const API_Register_Project_Supplier = () => API + getRolePath() + '/project-header/join/';
export const API_Negotiation_Supplier = () => API + getRolePath() + '/project-detail/list-offer/get/';
export const API_Post_Proposal_Supplier = () => API + getRolePath() + '/project-detail/create';
export const API_Mini_Profile_Supplier = () => API + getRolePath() + '/dashboard/mini-profile/get';

export const API_Company_Profile_Supplier = () => API + getRolePath() + '/user/profile';
export const API_Update_General_Data_Supplier = () => API + getRolePath() + '/company-profile/update/';
export const API_Create_Person_In_Charge_Supplier = () => API + getRolePath() + '/pic/create';
export const API_Update_Person_In_Charge_Supplier = () => API + getRolePath() + '/pic/update/';
export const API_Delete_Person_In_Charge_Supplier = () => API + getRolePath() + '/pic/delete/';
export const API_Create_Intergrity_Supplier = () => API + getRolePath() + '/intergrity-pact/create';
export const API_Update_Intergrity_Supplier = () => API + getRolePath() + '/intergrity-pact/update/';
export const API_Delete_Intergrity_Supplier = () => API + getRolePath() + '/intergrity-pact/delete/';
export const API_Create_NIB_Supplier = () => API + getRolePath() + '/nib/create';
export const API_Update_NIB_Supplier = () => API + getRolePath() + '/nib/update/';
export const API_Delete_NIB_Supplier = () => API + getRolePath() + '/nib/delete/';
export const API_Create_Business_License_Supplier = () => API + getRolePath() + '/business-license/create';
export const API_Update_Business_License_Supplier = () => API + getRolePath() + '/business-license/update/';
export const API_Delete_Business_License_Supplier = () => API + getRolePath() + '/business-license/delete/';

export const API_Status_Verification_Supplier = () => API + getRolePath() + '/verification/status';
export const API_Request_Verification_Supplier = () => API + getRolePath() + '/verification/create';
export const API_History_Verification_Supplier = () => API + getRolePath() + '/verification/history/get';