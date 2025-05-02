import { NavLink, useLocation, useNavigate, matchPath, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.scss";

const Navbar = () => {
    const adminPaths = [
        "/dashboard",
        "/user-managment",
        "/assets-managment",
        "/reports",
        "/settings",
    ];

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminPage = adminPaths.includes(location.pathname);

    // Checking for dynamic route
    const isAssetsDetailsPage = matchPath("/assets-details/:assetID", location.pathname);

    const getTitle = () => {
        if (location.pathname === "/slt-dashboard") return "Slt Admin Panel";
        if (location.pathname === "/add-company") return "Add Company";
        if (location.pathname === "/system-adminstrator") return "System Administrator";
        if (location.pathname === "/company-usage") return "Company Usage";
        if (location.pathname === "/deactivate-company") return "Deactivate Company";
        if (location.pathname === "/company-details") return "Company Details";
        if (isAssetsDetailsPage) return "Assets Details";
        return "";
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("token");
        navigate("/");
    };

    // Dropdown click outside handler
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {isAdminPage ? (
                    <ul className="nav-links">
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                            >
                                Administrator Dashboard
                            </NavLink>
                            <hr className="active-link-hr" />
                        </li>
                        <li>
                            <NavLink
                                to="/user-managment"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                            >
                                User Management
                            </NavLink>
                            <hr className="active-link-hr" />
                        </li>
                        <li>
                            <NavLink
                                to="/assets-managment"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                            >
                                Asset Management
                            </NavLink>
                            <hr className="active-link-hr" />
                        </li>
                        <li>
                            <NavLink
                                to="/reports"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                            >
                                Reports
                            </NavLink>
                            <hr className="active-link-hr" />
                        </li>
                        {/* <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                            >
                                Settings
                            </NavLink>
                            <hr className="active-link-hr" />
                        </li> */}
                    </ul>
                ) : (
                    <h2 className={`page-title ${adminPaths.includes(location.pathname) ? "active-title" : ""}`}>
                        {(location.pathname !== '/slt-dashboard' || isAssetsDetailsPage) && (
                            <span>
                                <Link
                                    style={{ color: "white", textDecoration: "none" }}
                                    to={isAssetsDetailsPage ? '/assets-managment' : '/slt-dashboard'}
                                >
                                    {"<"}&nbsp;&nbsp;&nbsp;&nbsp;
                                </Link>
                            </span>
                        )}
                        {getTitle()}
                        {adminPaths.includes(location.pathname) && <hr className="active-link-hr" />}
                    </h2>
                )}
            </div>
            <div className="navbar-right">
                <div className="profile-notification">
                    <button className="icon-button notification-icon">🔔</button>
                    <img
                        src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Profile"
                        className="profile-pic"
                        onClick={handleProfileClick}
                    />
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="dropdown-menu">
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
