import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAssetsByCompanyId, addAsset, deleteAssetById, getAssetCountByCompany } from "../../api/apiService.js"; // Import getAssetCountByCompany
import "./AssetsManagement.scss";

function AssetManagement() {
    const [assets, setAssets] = useState([]);
    const [assetCount, setAssetCount] = useState(0); // State to store the total number of assets
    const [showNewAssetInput, setShowNewAssetInput] = useState(false);
    const [newAssetData, setNewAssetData] = useState({
        name: "",
        brand: "",
        purchaseDate: "",
        status: "Active",
    });

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = assets.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(assets.length / itemsPerPage);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const fetchedAssets = await getAssetsByCompanyId(); // Fetch assets by company ID
                setAssets(fetchedAssets);
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        };

        const fetchAssetCount = async () => {
            try {
                const count = await getAssetCountByCompany(); // Fetch the total number of assets
                setAssetCount(count);
            } catch (error) {
                console.error("Failed to fetch asset count:", error);
            }
        };

        fetchAssets();
        fetchAssetCount(); // Fetch the asset count when the component loads
    }, []);

    const handleAddAssetClick = () => {
        setShowNewAssetInput(true);
    };

    const handleSaveAsset = async () => {
        if (!newAssetData.name || !newAssetData.brand || !newAssetData.purchaseDate) {
            alert("All fields are required. Please fill in the missing information.");
            return;
        }

        try {
            const addedAsset = await addAsset(newAssetData); // Add a new asset
            setAssets([...assets, addedAsset]);
            setAssetCount(assetCount + 1); // Update the asset count
            setShowNewAssetInput(false);
            setNewAssetData({ name: "", brand: "", purchaseDate: "", status: "Active" });
        } catch (error) {
            console.error("Failed to add asset:", error);
        }
    };

    const handleCancelAddAsset = () => {
        setShowNewAssetInput(false);
        setNewAssetData({ name: "", brand: "", purchaseDate: "", status: "Active" });
    };

    const handleInputChange = (field, value) => {
        setNewAssetData({ ...newAssetData, [field]: value });
    };

    const handleViewDetails = (assetId) => {
        navigate(`/assets-details/${assetId}`);
    };

    const handleDeleteAsset = async (assetId) => {
        try {
            await deleteAssetById(assetId); // Delete the asset
            setAssets(assets.filter((asset) => asset.assetID !== assetId));
            setAssetCount(assetCount - 1); // Update the asset count
        } catch (error) {
            console.error("Failed to delete asset:", error);
        }
    };

    return (
        <div className="asset-management">
            {/* Actions Section */}
            <div className="actions">
                <button className="add-asset-btn" onClick={handleAddAssetClick}>
                    + Add Assets
                </button>
                <input className="search-bar" type="text" placeholder="Search" />
            </div>

            {/* Statistics Section */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-value">{assetCount}</div> {/* Display asset count */}
                    <div className="stat-label">Number of Assets</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{assetCount}</div>
                    <div className="stat-label">Checked Out</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Lost / Missing</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Maintenance Due</div>
                </div>
            </div>

            {/* Assets Table */}
            <table className="assets-table">
                <thead>
                    <tr>
                        <th>Asset ID</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Purchase Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAssets.map((asset) => (
                        <tr key={asset.assetID}>
                            <td>{asset.assetID}</td>
                            <td>{asset.name}</td>
                            <td>{asset.brand}</td>
                            <td>{asset.purchaseDate}</td>
                            <td>{asset.status}</td>
                            <td>
                                <button
                                    className="view-btn"
                                    onClick={() => handleViewDetails(asset.assetID)}
                                >
                                    View
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteAsset(asset.assetID)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {showNewAssetInput && (
                        <tr className="new-asset-row">
                            <td>#</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newAssetData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    value={newAssetData.brand}
                                    onChange={(e) => handleInputChange("brand", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={newAssetData.purchaseDate}
                                    onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    value={newAssetData.status}
                                    onChange={(e) => handleInputChange("status", e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Checked Out">Checked Out</option>
                                    <option value="Maintenance Due">Maintenance Due</option>
                                </select>
                            </td>
                            <td>
                                <button className="save-btn" onClick={handleSaveAsset}>
                                    Save
                                </button>
                                <button className="cancel-btn" onClick={handleCancelAddAsset}>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AssetManagement;
