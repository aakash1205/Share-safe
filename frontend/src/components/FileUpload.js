import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; 

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFileUrl(response.data.fileUrl.url); 
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="file-upload-container">
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="file-upload-input" 
            />
            <button 
                onClick={handleFileUpload} 
                className="file-upload-button"
            >
                Upload
            </button>
            {fileUrl && (
                <p>
                    File URL: 
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-upload-link">
                        {fileUrl}
                    </a>
                </p>
            )}
        </div>
    );
};

export default FileUpload;
