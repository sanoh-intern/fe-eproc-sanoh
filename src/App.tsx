import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthContext";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./layout/DefaultLayout/DefaultLayout";
import NotFound from "./pages/404";
import Unauthorized from "./pages/Authentication/Unauthorized";
import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import SettingProfile from "./pages/SettingProfile";
import CompanyDetail from "./pages/CompanyDetail/Supplier/SupplierCompanyDetail";
import OffersDetails from "./pages/Offers/OffersDetails";
import AdminCreateOffers from "./pages/Offers/Admin/ManageOffers/AdminCreateOffers";
import AdminEditOffers from "./pages/Offers/Admin/ManageOffers/AdminEditOffers";
import AdminRegisteredDetail from "./pages/Offers/Admin/Negotiation/AdminRegisteredDetail";
import AdminRegistered from "./pages/Offers/Admin/Negotiation/AdminRegistered";
import AdminNegotiation from "./pages/Offers/Admin/Negotiation/AdminNegotiation";
import IndexVerification from "./pages/Verification/IndexVerification";
import AdminManageOffers from "./pages/Offers/Admin/ManageOffers/AdminManageOffers";
import SupplierOffersAvailable from "./pages/Offers/Supplier/OffersAvailable/SupplierOffersAvailable";
import SupplierOffersFollowed from "./pages/Offers/Supplier/OffersFollowed/SupplierOffersFollowed";
import SupplierNegotiation from "./pages/Offers/Supplier/OffersFollowed/SupplierNegotiation";

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route
            path="/auth/register"
            element={
              <>
                <PageTitle title="Register | PT SANOH INDONESIA" />
                <Register/>
              </>
            } 
          />
          <Route
            path="/auth/login"
            element={
              <>
                <PageTitle title="login | PT SANOH INDONESIA" />
                <Login/>
              </>
            } 
          />
          <Route
            path="/auth/reset/password"
            element={
              <>
                <PageTitle title="Reset Password | PT SANOH INDONESIA" />
                <ForgotPassword/>
              </>
            } 
          />

          {/* Public Routes with DashboardLayout */}
          <Route element={<DashboardLayout/>}>
            <Route 
              path="/" 
              element={
                <>
                  <PageTitle title="E-Proc | PT SANOH INDONESIA" />
                  <LandingPage />
                </>
              } 
            />
            <Route
              path="/contact-us"
              element={
                <>
                  <PageTitle title="Contact Us | PT SANOH INDONESIA" />
                  <ContactUs />
                </>
              }
            />
          </Route>

          {/* Protected Routes with DefaultLayout */}
          <Route element={<DefaultLayout/>}>
            {/* <Route
              path="/dashboard"
              element={
                <>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </>
              }
            /> */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['1','2','3','4','5']}>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setting-profile"
              element={
                <ProtectedRoute allowedRoles={['1','2','3','4','5']}>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <SettingProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-details"
              element={
                <ProtectedRoute allowedRoles={['2','3','4','5']}>
                  <PageTitle title="Company Details | PT SANOH INDONESIA" />
                  <CompanyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute allowedRoles={['2','3','4','5']}>
                  <PageTitle title="Verification | PT SANOH INDONESIA" />
                  <IndexVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/available"
              element={
                <ProtectedRoute allowedRoles={['5']}>
                  <PageTitle title="Offers Available | PT SANOH INDONESIA" />
                  <SupplierOffersAvailable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/details/:id"
              element={
                <ProtectedRoute allowedRoles={['2','3','4','5']}>
                  <PageTitle title="Offers Detail | PT SANOH INDONESIA" />
                  <OffersDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/followed"
              element={
                <ProtectedRoute allowedRoles={['5']}>
                  <PageTitle title="Offers Followed | PT SANOH INDONESIA" />
                  <SupplierOffersFollowed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/followed/negotiation/details/:id"
              element={
                <ProtectedRoute allowedRoles={['2','3','4','5']}>
                  <PageTitle title="Offers Negotiation | PT SANOH INDONESIA" />
                  <SupplierNegotiation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/manage"
              element={
                <ProtectedRoute allowedRoles={['2','3','4']}>
                  <PageTitle title="Manage Offers | PT SANOH INDONESIA" />
                  <AdminManageOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/create"
              element={
                <ProtectedRoute allowedRoles={['3']}>
                  <PageTitle title="Offers Create | PT SANOH INDONESIA" />
                  <AdminCreateOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['3']}>
                  <PageTitle title="Offers Edit | PT SANOH INDONESIA" />
                  <AdminEditOffers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/registered"
              element={
                <ProtectedRoute allowedRoles={['2','3','4']}>
                  <PageTitle title="Offers Registered | PT SANOH INDONESIA" />
                  <AdminRegistered />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/registered/:id"
              element={
                <ProtectedRoute allowedRoles={['2','3','4']}>
                  <PageTitle title="Offers Registered Detail | PT SANOH INDONESIA" />
                  <AdminRegisteredDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers/negotiation/details/:id"
              element={
                <ProtectedRoute allowedRoles={['2','3','4']}>
                  <PageTitle title="Offers Negotiation | PT SANOH INDONESIA" />
                  <AdminNegotiation />
                </ProtectedRoute>
              }
            />

            
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <>              
                <PageTitle title="404 | PT SANOH INDONESIA" />
                <NotFound />
              </>
            }
          />

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={
              <>
                <PageTitle title="Unauthorized | PT SANOH INDONESIA" />
                <Unauthorized /> 
              </>
            }
          />

        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;