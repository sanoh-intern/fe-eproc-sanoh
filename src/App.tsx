import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/Authentication/AuthContext";
import ProtectedRoute from "./pages/Authentication/ProtectedRoute";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./layout/DefaultLayout/DefaultLayout";
import NotFound from "./pages/404";
import Unauthorized from "./pages/Authentication/Pages/Unauthorized";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/Authentication/Pages/SignIn";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/auth/register" element={<SignIn/>} />
          <Route path="/auth/login" element={<SignIn />} />

          <Route element={<DashboardLayout/>}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Protected Routes with DefaultLayout */}
          <Route element={<DefaultLayout/>}>
            {/* <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['1','2','3','4','5','6','7','8','9']}>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['1','2','3','4','5','6','7','8','9']}>
                  <PageTitle title="Dashboard | PT SANOH INDONESIA" />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <>              
                <PageTitle title="Page Not Found | PT SANOH INDONESIA" />
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
      </HashRouter>
    </AuthProvider>
  );
};

export default App;