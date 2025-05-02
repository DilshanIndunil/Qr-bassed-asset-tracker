import { useState, useEffect } from 'react';
import './DeactivateCompany.scss';
import { getCompanies } from '../../api/apiService.js';  // Assuming you have an API service for fetching companies
import { deleteCompany } from '../../api/apiService.js'; // Assuming you have an API service for deleting companies

function DeactivateCompany() {
    const [companyName, setCompanyName] = useState('');
    const [companies, setCompanies] = useState([]);
    const [reason, setReason] = useState('');
    const [other, setOther] = useState('');

    useEffect(() => {
        // Fetch the list of companies when the component mounts
        const fetchCompanies = async () => {
            try {
                const response = await getCompanies();  // Fetch companies from API
                setCompanies(response);  // Store companies in state
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);  // Empty dependency array to run only once

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!companyName) {
            return alert('Please select a company.');
        }

        try {
            // Call the delete API to delete the company
            await deleteCompany(companyName);  // Pass companyName as the company ID or name based on your backend
            alert('Company deleted successfully');

            // Clear the form fields after successful deletion
            setCompanyName('');
            setReason('');
            setOther('');

            // Refresh the page to reflect changes
            window.location.reload();
        } catch (error) {
            console.error('Error deleting company:', error);
            alert('Failed to delete company');
        }
    };

    return (
        <div className='deactivate-company'>
            <form onSubmit={handleSubmit} className='deactivate-company-form'>
                <div className="form-group inline">
                    <label>Company Name - </label>
                    <select
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    >
                        <option value="">@company name</option>
                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Reason - </label>
                    <input type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder='Reason'
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Other - </label>
                    <textarea
                        value={other}
                        onChange={(e) => setOther(e.target.value)}
                        placeholder='Other details (Optional)'
                    ></textarea>
                </div>

                <button type='submit' className='deactivate-button'>Deactivate Company</button>
            </form>
        </div>
    );
}

export default DeactivateCompany;
