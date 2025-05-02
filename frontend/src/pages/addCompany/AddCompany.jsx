import { useState } from 'react';
import { addCompany } from '../../api/apiService.js'; // Import the API function
import './AddCompany.scss';

function AddCompany() {
    const [companyName, setCompanyName] = useState('');
    const [industryType, setIndustryType] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [hotline, setHotline] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Placeholder: Replace with real token
    const token = 'your_slt_admin_jwt_token_here';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!companyName || !industryType || !companyEmail || !hotline || !address || !description) {
            alert("All fields are required!");
            return;
        }

        const companyData = {
            name: companyName,
            industry: industryType,
            email: companyEmail,
            hotline,
            address,
            description,
        };

        try {
            setLoading(true);
            const response = await addCompany(companyData, token);
            alert(response.message || 'Company added successfully!');

            // Clear form fields
            setCompanyName('');
            setIndustryType('');
            setCompanyEmail('');
            setHotline('');
            setAddress('');
            setDescription('');
        } catch (error) {
            console.error('Add Company Error:', error);
            alert(error.message || 'Failed to add company. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='add-company'>
                <div className="add-company-container">
                    <form className="add-company-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Company Name - </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder='@company name'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Industry Type - </label>
                            <select
                                value={industryType}
                                onChange={(e) => setIndustryType(e.target.value)}
                                required
                            >
                                <option value="">@industry type</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Supplier">Supplier</option>
                                <option value="Service">Service</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Company Email - </label>
                            <input
                                type="email"
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                placeholder='@email'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Hotline - </label>
                            <input
                                type="tel"
                                value={hotline}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d{0,10}$/.test(inputValue)) {
                                        setHotline(inputValue);
                                    }
                                }}
                                placeholder='@hotline'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='@address'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='@description'
                                required
                            ></textarea>
                        </div>

                        <button type='submit' className='submit-button' disabled={loading}>
                            {loading ? 'Adding...' : 'Add Company'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddCompany;
