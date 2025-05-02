import { useState, useEffect } from 'react';
import {
    getCompanies,
    getAdministratorsByCompanyId,
    addAdministratorToCompany,
    removeAdministratorFromCompany, // Import the remove administrator API function
} from '../../api/apiService.js'; // Import the API functions
import './SystemAdministrator.scss';

const SystemAdministrator = () => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [administratorEmail, setAdministratorEmail] = useState('');
    const [administratorName, setAdministratorName] = useState('');
    const [position, setPosition] = useState('Administrator');
    const [isExistingAdmin, setIsExistingAdmin] = useState(false);
    const [administrators, setAdministrators] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [error, setError] = useState(null);
    const [adminError, setAdminError] = useState(null);

    // Fetch companies from the backend on component mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companies = await getCompanies();
                setCompanyOptions(companies);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to fetch company data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleCompanyChange = async (event) => {
        const companyName = event.target.value;
        setSelectedCompany(companyName);
        setAdministratorEmail('');
        setAdministratorName('');
        setIsExistingAdmin(false);
        setAdministrators([]);
        setLoadingAdmins(true);
        setAdminError(null);

        const selectedCompanyObj = companyOptions.find(company => company.name === companyName);

        if (selectedCompanyObj) {
            try {
                const admins = await getAdministratorsByCompanyId(selectedCompanyObj._id);
                setAdministrators(admins);
            } catch (err) {
                console.error('Error fetching administrators:', err);
                setAdminError('Failed to fetch administrator data. Please try again later.');
            } finally {
                setLoadingAdmins(false);
            }
        } else {
            setLoadingAdmins(false);
        }
    };

    const handleEmailChange = (event) => {
        const email = event.target.value;
        setAdministratorEmail(email);

        if (selectedCompany) {
            const adminExists = administrators.some(admin => admin.email === email);
            setIsExistingAdmin(adminExists);
        }
    };

    const handleNameChange = (event) => {
        setAdministratorName(event.target.value);
    };

    const handlePositionChange = (event) => {
        setPosition(event.target.value);
    };

    const handleAddOrRemoveAdministrator = async () => {
        if (administratorEmail && selectedCompany) {
            const selectedCompanyObj = companyOptions.find(company => company.name === selectedCompany);

            if (!selectedCompanyObj) {
                setAdminError('Company not found. Please select a valid company.');
                return;
            }

            if (isExistingAdmin) {
                // Remove Administrator Logic
                try {
                    await removeAdministratorFromCompany(selectedCompanyObj._id, administratorEmail);
                    setAdministrators(prevAdmins =>
                        prevAdmins.filter(admin => admin.email !== administratorEmail)
                    );
                    setAdministratorEmail('');
                    setAdministratorName('');
                    setIsExistingAdmin(false);
                    setAdminError(null);
                } catch (err) {
                    console.error(err);
                    setAdminError('Failed to remove administrator. Please try again.');
                }
            } else {
                // Add Administrator Logic
                try {
                    const newAdmin = await addAdministratorToCompany(
                        selectedCompanyObj._id,
                        administratorEmail,
                        administratorName
                    );

                    setAdministrators(prevAdmins => [...prevAdmins, newAdmin.admin]);
                    setAdministratorEmail('');
                    setAdministratorName('');
                    setPosition('Administrator');
                    setAdminError(null);
                } catch (err) {
                    console.error(err);
                    setAdminError('Failed to add administrator. Please try again.');
                }
            }
        }
    };

    return (
        <div className="system-administrator">
            <div className="company-name">
                <label>Company Name -</label>
                {loading ? (
                    <p>Loading company names...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <select value={selectedCompany} onChange={handleCompanyChange}>
                        <option value="">@company name</option>
                        {companyOptions.map(company => (
                            <option key={company._id} value={company.name}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedCompany && (
                <div>
                    {loadingAdmins ? (
                        <p>Loading administrators...</p>
                    ) : adminError ? (
                        <p className="error">{adminError}</p>
                    ) : administrators.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Administrator Email</th>
                                    <th>Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {administrators.map((admin, index) => (
                                    <tr key={index}>
                                        <td>{admin.name}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No administrators found for this company.</p>
                    )}
                </div>
            )}

            <div className="add-administrator-form">
                <input
                    type="email"
                    placeholder="@administrator email"
                    value={administratorEmail}
                    onChange={handleEmailChange}
                    required
                />

                {!isExistingAdmin && (
                    <input
                        type="text"
                        placeholder="@administrator name"
                        value={administratorName}
                        onChange={handleNameChange}
                        required
                    />
                )}

                {!isExistingAdmin && (
                    <select value={position} onChange={handlePositionChange}>
                        <option value="Administrator">Administrator</option>
                        <option value="Maintenance Staff">Maintenance Staff</option>
                    </select>
                )}

                <button onClick={handleAddOrRemoveAdministrator}>
                    {isExistingAdmin ? 'Remove Administrator' : 'Add Administrator'}
                </button>
            </div>
        </div>
    );
};

export default SystemAdministrator;
