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
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-card rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">PDF Analytics</h1>
          <p className="mt-2 text-muted-foreground">Upload a PDF to generate a shareable link and track viewer engagement.</p>
        </div>

        {!uploadData ? (
          <div 
            {...getRootProps()} 
            className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold">{isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF or click to select'}</p>
                <p className="text-sm text-muted-foreground mt-1">Max file size: 20MB</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in space-y-4 text-center">
            <h2 className="text-2xl font-bold text-primary">Upload Successful!</h2>
            <div className="space-y-2">
              <label className="font-semibold text-left block">Shareable Viewer Link:</label>
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}${uploadData.viewerUrl}`}
                className="w-full p-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onFocus={(e) => e.target.select()} 
              />
            </div>
            <button 
              onClick={() => navigate(uploadData.dashboardUrl)} 
              className="w-full py-3 px-4 font-bold text-white bg-primary rounded-md hover:bg-primary/90 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Go to Dashboard
            </button>
          </div>
        )}

        {error && <p className="text-destructive text-center font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default UploadPage;
