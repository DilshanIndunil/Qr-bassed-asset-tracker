import Asset from '../models/Assets.js';  // Import the Asset model

// ✅ Upload and Associate Image with Asset
export const importSingle = async (req, res) => {
    const { assetID } = req.params;  // Extract assetID from the URL parameter

    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        // Find the asset by assetID in the database
        const asset = await Asset.findOne({ assetID });
        if (!asset) {
            return res.status(404).send({ message: `Asset with ID ${assetID} not found!` });
        }

        // ✅ Save image path in database
        asset.image = `/images/${req.file.filename}`;

        // Save updated asset
        await asset.save();

        return res.status(201).send({
            asset,
            message: 'Image uploaded and associated with asset successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error! Try again, please!' });
    }
};



// ✅ Fetch Image by Asset ID
export const fetchImage = async (req, res) => {
    const { assetID } = req.params;  // Extract assetID from the URL parameter

    try {
        // Find the asset by assetID in the database
        const asset = await Asset.findOne({ assetID });
        if (!asset) {
            return res.status(404).send({ message: `Asset with ID ${assetID} not found!` });
        }

        // Check if the asset has an associated image
        if (!asset.image) {
            return res.status(404).send({ message: `No image found for asset with ID ${assetID}` });
        }

        // ✅ Send the image URL stored in the database
        return res.status(200).send({
            image: asset.image,
            message: 'Image fetched successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error! Try again, please!' });
    }
};
