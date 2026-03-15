import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: 'application/pdf' 
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">PDF Analytics</h1>
          <p className="mt-2 text-gray-400">Upload your PDF to get a shareable link and track analytics.</p>
        </div>

        {!uploadData ? (
          <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-gray-600'}`}>
            <input {...getInputProps()} />
            {uploading ? (
              <p>Uploading...</p>
            ) : (
              <p>{isDragActive ? 'Drop the PDF here ...' : 'Drag \'n\' drop a PDF here, or click to select one'}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Upload Successful!</h2>
            <div>
              <label className="font-bold">Shareable Link:</label>
              <input type="text" readOnly value={`${window.location.origin}${uploadData.viewerUrl}`} className="w-full p-2 mt-1 text-gray-900 bg-gray-200 rounded" />
            </div>
            <button onClick={() => navigate(uploadData.dashboardUrl)} className="w-full py-2 px-4 font-bold text-white bg-primary rounded hover:bg-indigo-700">
              Go to Dashboard
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default UploadPage;
