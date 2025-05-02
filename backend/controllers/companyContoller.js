import Company from "../models/Company.js";

export const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    const { name, industry, email, hotline, address, description } = req.body;

    try {
        // Ensure only SLT Admin can perform this action
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { name, industry, email, hotline, address, description },
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({
            message: 'Company details updated successfully',
            company: updatedCompany,
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a company
export const deleteCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        // Ensure only SLT Admin can perform this action
        if (req.user.role !== 'slt-admin') {
            return res.status(403).json({ message: 'Access forbidden: Admin role required' });
        }

        // Find and delete the company
        const deletedCompany = await Company.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({
            message: 'Company deleted successfully',
            company: deletedCompany,
        });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
