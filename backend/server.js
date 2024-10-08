const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { uploadFile } = require('./storage'); // Import your uploadFile function

const app = express();
const PORT = 5000;

// Use CORS middleware
app.use(cors()); // This will allow all origins by default

// Set up your file upload route
const upload = multer();
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileUrl = await uploadFile(req.file); // Call your uploadFile function
        res.status(200).json({ fileUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
