import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { getAdministratorDetails, getAssetCountByCompany, getUserCountByCompany } from "../../api/apiService.js"; // Import the API service functions
import "./Dashboard.scss";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [adminName, setAdminName] = useState("");
    const [totalAssets, setTotalAssets] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null); // Initial state set to null

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const details = await getAdministratorDetails(); // Fetch the details from the backend
                setAdminName(details.name); // Set only the administrator's name
            } catch (error) {
                console.error("Failed to fetch administrator details:", error);
            }
        };

        const fetchAssetCount = async () => {
            try {
                const count = await getAssetCountByCompany(); // Fetch the total asset count using the API function
                setTotalAssets(count); // Set the total asset count
            } catch (error) {
                console.error("Failed to fetch asset count:", error);
            }
        };

        const fetchActiveUsers = async () => {
            try {
                const userCount = await getUserCountByCompany(); // Fetch the active users count using the API function
                setTotalUsers(userCount); // Set the active users count
            } catch (error) {
                console.error("Failed to fetch active users count:", error);
            }
        };

        fetchAdminDetails();
        fetchAssetCount();
        fetchActiveUsers(); // Call the function to fetch the active users count
    }, []);

    // Safely access properties of totalUsers with fallback values
    const activeUsersPieData = {
        labels: ["System Administrator", "Maintenance Staff", "Inventory Manager"],
        datasets: [
            {
                data: [
                    totalUsers?.administratorCount || 0,  // Safely access administrator count
                    totalUsers?.factoryWorkerCount || 0,   // Safely access factory worker count
                    totalUsers?.totalUserCount - (totalUsers?.administratorCount || 0) - (totalUsers?.factoryWorkerCount || 0) // Safely calculate remaining users
                ],
                backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
            },
        ],
    };

    const barChartData = {
        labels: ["Mon", "Tue", "Wed", "Thu"],
        datasets: [
            {
                label: "Active Users",
                data: [12, 19, 3, 5], // You can replace this with real data later
                backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
            },
        },
    };

    const assetsPieData = {
        labels: ["In Use", "Not In Use"],
        datasets: [
            {
                data: [2, 1], // You can replace this with real data later
                backgroundColor: ["#36a2eb", "#ffce56"],
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    font: { size: 12 },
                    color: "#ffffff",
                },
            },
        },
    };

    const recentActivities = [
        { userId: 1, userType: "Admin", activity: "Checked Report", time: "12:30 PM" },
        { userId: 2, userType: "Worker", activity: "Scanned Tool", time: "12:31 PM" },
        { userId: 3, userType: "Manager", activity: "Updated Inventory", time: "12:32 PM" },
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Hello, {adminName}!</h1>
            </header>

            <div className="summary-section">
                <div className="summary-card">
                    <div className="title">
                        <h3>Total Assets</h3>
                        <p>{totalAssets !== null ? totalAssets : "Loading..."}</p> {/* Display the total asset count */}
                    </div>
                </div>

                <div className="summary-card">
                    <div className="title">
                        <h3>Assets in Use</h3>
                        <p>{totalAssets !== null ? totalAssets : "Loading..."}</p> {/* Display the assets in use */}
                    </div>
                    <div className="pie-chart">
                        <Pie data={assetsPieData} options={pieChartOptions} />
                    </div>
                </div>

                <div className="summary-card">
                    <div className="title">
                        <h3>Active Users</h3>
                        <p>{totalUsers !== null ? totalUsers.totalUserCount : "Loading..."}</p> {/* Display the total user count */}
                    </div>
                    <div className="pie-chart">
                        <Pie data={activeUsersPieData} options={pieChartOptions} />
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="chart-section">
                    <Bar data={barChartData} options={barChartOptions} />
                </div>

                <div className="recent-activities">
                    <h3>Recent Activities</h3>
                    <ul>
                        {recentActivities.map((activity, index) => (
                            <li key={index}>
                                <p>User ID: {activity.userId}</p>
                                <p>User Type: {activity.userType}</p>
                                <p>Activity: {activity.activity}</p>
                                <p>Time: {activity.time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
