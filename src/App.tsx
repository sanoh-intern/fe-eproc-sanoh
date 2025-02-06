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
            <Route
              path="/dashboard"
              element={
                <>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </>
              }
            />

            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['1','2','3','4','5','6','7','8','9']}>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}
            
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