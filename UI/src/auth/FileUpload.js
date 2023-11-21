import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadFile = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('https://backend.danner.repl.co/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.blob_link)
        setResult({
          message: data.message,
          blobLink: data.blob_link
        });
      })
      .catch(error => {
        setResult({ error: error.message });
      });
    } else {
      alert('Please choose a file to upload.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>File Upload Example</h2>
      <input
        type="file"
        className="custom-file-input"
        onChange={handleFileChange}
        accept=".png, .heif, .jpg, .jpeg, .webp, .heic"
      />
      <button type="button" className="btn btn-primary" onClick={uploadFile}>
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
