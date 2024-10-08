const { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential, BlobSASPermissions } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

require('dotenv').config(); // Load environment variables

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage

const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Initialize BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Upload file function
const uploadFile = async (file) => {
    const blobName = `${uuidv4()}-${file.originalname}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container if it doesn't exist
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file
    await blockBlobClient.upload(file.buffer, file.size);

    // Generate a SAS token
    const expiresOn = new Date(new Date().valueOf() + 60 * 60 * 1000); // 1 hour
    const permissions = new BlobSASPermissions();
    permissions.read = true;

    const sasOptions = {
        containerName,
        blobName,
        expiresOn,
        permissions,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY)).toString();

    return {
        url: `${blockBlobClient.url}?${sasToken}`,
    };
};

module.exports = {
    upload,
    uploadFile,
};
