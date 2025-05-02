import './CompanyDetails.scss';
import { useState, useEffect } from 'react';
import { getCompanies, updateCompany } from '../../api/apiService.js'; // Import both functions

function CompanyDetails() {
    const [companyData, setCompanyData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableCompany, setEditableCompany] = useState(null);

    useEffect(() => {
        // Fetch companies when the component mounts
        const fetchCompanies = async () => {
            const companies = await getCompanies();
            setCompanyData(companies);
            if (companies.length > 0) {
                setSelectedCompany(companies[0]); // Set the first company as default
                setEditableCompany({ ...companies[0] });
            }
        };

        fetchCompanies();
    }, []);

    const handleCompanyChange = (event) => {
        const company = companyData.find(c => c.name === event.target.value);
        setSelectedCompany(company);
        setEditableCompany({ ...company });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateClick = async () => {
        setIsEditing(false);

        try {
            // Send the updated company data to the server
            const response = await updateCompany(selectedCompany._id, editableCompany);

            if (response) {
                console.log('Company details updated successfully');
                // Trigger a re-fetch of the companies to get updated data
                const companies = await getCompanies();
                setCompanyData(companies);
                // Set the updated selected company
                setSelectedCompany(companies.find(c => c._id === selectedCompany._id));
                setEditableCompany({ ...companies.find(c => c._id === selectedCompany._id) });
            }
        } catch (error) {
            console.error('Failed to update company:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableCompany((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!selectedCompany) {
        return <div>Loading...</div>;
    }

    return (
        <div className="company-details-container">
            <div className="company-select-container">
                <label htmlFor="company-name" className="input-label">Select Company:</label>
                <select
                    id="company-name"
                    className="company-input"
                    onChange={handleCompanyChange}
                    value={selectedCompany.name}
                >
                    {companyData.map((company) => (
                        <option key={company._id} value={company.name}>
                            {company.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="details-container">
                <div className="company-info">
                    <h2 className="company-title">{selectedCompany.name}</h2>

                    <div className="company-field">
                        <label>Address:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address"
                                value={editableCompany.address}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.address}</span>
                        )}
                    </div>

                    <div className="company-field">
                        <label>Industry Type:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="industry"
                                value={editableCompany.industry}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.industry}</span>
                        )}
                    </div>

                    <div className="company-field">
                        <label>Company Email:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editableCompany.email}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.email}</span>
                        )}
                    </div>

                    <div className="company-field">
                        <label>Hotline:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="hotline"
                                value={editableCompany.hotline}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.hotline}</span>
                        )}
                    </div>
                </div>

                <div className="subscription-info">
                    <h2 className="subscription-title">Subscription</h2>

                    <div className="subscription-field">
                        <label>Subscription Type:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="subscription"
                                value={editableCompany.subscription}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.subscription}</span>
                        )}
                    </div>

                    <div className="subscription-field">
                        <label>Payment Date:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="paymentDate"
                                value={editableCompany.paymentDate}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.paymentDate}</span>
                        )}
                    </div>

                    <div className="subscription-field">
                        <label>Payment No:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="paymentNo"
                                value={editableCompany.paymentNo}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.paymentNo}</span>
                        )}
                    </div>

                    <div className="subscription-field">
                        <label>Bank Details:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="bankDetails"
                                value={editableCompany.bankDetails}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{selectedCompany.bankDetails}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="button-container">
                {isEditing ? (
                    <button className="update-button" onClick={handleUpdateClick}>Update</button>
                ) : (
                    <button className="edit-button" onClick={handleEditClick}>Edit</button>
                )}
            </div>
        </div>
    );
}

export default CompanyDetails;
