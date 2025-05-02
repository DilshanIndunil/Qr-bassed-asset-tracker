import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../../api/apiService'; // Import the getCompanies function
import './SltDashboard.scss';

function SltDashboard() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch companies when the component mounts
        const fetchCompanies = async () => {
            try {
                // Get the token from local storage
                const token = localStorage.getItem('token');

                // Ensure the token exists
                if (!token) {
                    setError("No token found. Please log in again.");
                    return;
                }

                // Make API call to fetch companies using the imported getCompanies function
                const data = await getCompanies(token);

                // Set companies data in the state
                setCompanies(data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError("Failed to fetch companies. Please try again later.");
            }
        };

        fetchCompanies();
    }, []);

    return (
        <div className="sltDashboard">
            <div className="dashboard">
                <div className="admin-panel">
                    <h1>Admin Panel</h1>
                    <button onClick={() => navigate('/add-company')} className="add-company-button">
                        Add Company
                    </button>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Hotline</th>
                                    <th>Industry Type</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="table-body-container">
                            <table>
                                <tbody>
                                    {error && (
                                        <tr>
                                            <td colSpan="4" style={{ color: 'red' }}>
                                                {error}
                                            </td>
                                        </tr>
                                    )}
                                    {companies.length === 0 ? (
                                        <tr>
                                            <td colSpan="4">No companies found.</td>
                                        </tr>
                                    ) : (
                                        companies.map((company, index) => (
                                            <tr key={index}>
                                                <td>{company.name}</td>
                                                <td>{company.hotline}</td>
                                                <td>{company.industry}</td>
                                                <td>{company.email}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="button-group">
                        <button onClick={() => navigate('/system-adminstrator')} className="action-button">
                            System Administrator
                        </button>
                        <button onClick={() => navigate('/company-usage')} className="action-button">
                            Usage
                        </button>
                        <button onClick={() => navigate('/company-details')} className="action-button">
                            Details
                        </button>
                        <button onClick={() => navigate('/deactivate-company')} className="action-button">
                            Deactivate Company
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SltDashboard;
