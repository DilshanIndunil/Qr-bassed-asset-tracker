/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getAssetById, updateAssetById, uploadImage } from '../../api/apiService.js';

import './AssetsDetails.scss';

function AssetDetails() {
    const { assetId } = useParams();
    const [asset, setAsset] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableAsset, setEditableAsset] = useState({
        name: '',
        type: '',
        condition: '',
        location: '',
        maintenanceDue: '',
        assetTag: '',
        assetImage: null
    });

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const fetchedAsset = await getAssetById(assetId);
                console.log("Fetched Asset:", fetchedAsset); // Debugging
                setAsset(fetchedAsset);
                setEditableAsset(fetchedAsset);
            } catch (error) {
                console.error("Failed to fetch asset details:", error);
            }
        };

        fetchAsset();
    }, [assetId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateClick = async () => {
        try {
            const { assetID, assetImage, ...updateData } = editableAsset; // Exclude assetID from the update payload
            let updatedAsset;

            if (assetImage instanceof File) {
                // Handle image upload if a new image is selected
                const imageUrl = await uploadImage(assetId, assetImage);
                console.log("Uploaded Image URL:", imageUrl); // Debugging

                updatedAsset = await updateAssetById(assetId, { ...updateData, assetImage: imageUrl });
            } else {
                updatedAsset = await updateAssetById(assetId, updateData);
            }

            setAsset(updatedAsset);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update asset details:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableAsset((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditableAsset((prev) => ({
            ...prev,
            assetImage: file,
        }));
    };

    if (!asset) return <div>Loading...</div>;

    const qrCodeValue = `
        ID: ${asset.assetID},
        Name: ${asset.name},
        Brand: ${asset.brand},
        Purchase Date: ${asset.purchaseDate},
        Company ID: ${asset.companyId}
    `;

    return (
        <div className="asset-details-container">
            <div className="details-container">
                <div className="asset-info">
                    <h2 className="asset-title">
                        {asset.name}
                    </h2>

                    <div className="asset-field">
                        <label>Type:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="type"
                                value={editableAsset.type || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{asset.type}</span>
                        )}
                    </div>

                    <div className="asset-field">
                        <label>Condition:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="condition"
                                value={editableAsset.condition || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{asset.condition}</span>
                        )}
                    </div>

                    <div className="asset-field">
                        <label>Location:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={editableAsset.location || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{asset.location}</span>
                        )}
                    </div>

                    <div className="asset-field">
                        <label>Asset Image:</label>
                        {isEditing ? (
                            <input
                                type="file"
                                name="assetImage"
                                onChange={handleImageChange}
                                className="edit-input"
                            />
                        ) : (
                            <div className="image-preview">
                                {asset.image ? (
                                    <img src={`http://localhost:5000/uploads${asset.image}`} alt="Asset" />
                                ) : (
                                    <p>No asset image uploaded</p>
                                )}
                            </div>
                        )}
                    </div>




                </div>

                <div className="subscription-info">
                    <h2 className="subscription-title">Maintenance Info</h2>

                    <div className="subscription-field">
                        <label>Maintenance Due:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="maintenanceDue"
                                value={editableAsset.maintenanceDue || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{asset.maintenanceDue}</span>
                        )}
                    </div>

                    <div className="subscription-field">
                        <label>Asset Tag:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="assetTag"
                                value={editableAsset.assetTag || ''}
                                onChange={handleInputChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{asset.assetTag}</span>
                        )}
                    </div>

                    <div className="qr-code">
                        <label>QR Code - </label>
                        <div className="qr-code-image">
                            <QRCode
                                size={256}
                                value={qrCodeValue}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
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

export default AssetDetails;
