import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import AddCompany from "./pages/addCompany/AddCompany";
import AssetsManagment from "./pages/assetsManagment/AssetsManagment";
import CompanyDetails from "./pages/companyDetails/CompanyDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import DeactivateCompany from "./pages/deactivateCompany/DeactivateCompany";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import SLTDashboard from "./pages/sltDashboard/SltDashboard";
import SystemAdminstrator from "./pages/systemAdminstrator/SystemAdminstrator";
import UserManagement from "./pages/userManagement/UserManagement";
import CompanyUsage from "./pages/companyUsage/CompanyUsage";
import AssetsDetails from "./pages/assetsDetails/AssetsDetails";

function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/user-managment", element: <UserManagement /> },
      { path: "/assets-managment", element: <AssetsManagment /> },
      { path: "/reports", element: <Reports /> },
      { path: "/settings", element: <Settings /> },
      { path: "/slt-dashboard", element: <SLTDashboard /> },
      { path: "/add-company", element: <AddCompany /> },
      { path: "/system-adminstrator", element: <SystemAdminstrator /> },
      { path: "/deactivate-company", element: <DeactivateCompany /> },
      { path: "/company-details", element: <CompanyDetails /> },
      { path: "/company-usage", element: <CompanyUsage /> },
      // Updated route for AssetsDetails
      { path: "/assets-details/:assetId", element: <AssetsDetails /> },
      // Fallback route for non-existing pages
      { path: "*", element: <div>Page Not Found</div> },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </div>
  );
}

export default App;
