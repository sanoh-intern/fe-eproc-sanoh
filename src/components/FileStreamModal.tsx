import React, { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaSpinner } from 'react-icons/fa';
import { streamFile } from '../api/Action/stream-file';
import { toast } from 'react-toastify';
import Button from './Forms/Button';

interface FileStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
}

const FileStreamModal: React.FC<FileStreamModalProps> = ({
  isOpen,
  onClose,
  filePath,
  fileName
}) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && filePath) {
      loadFile();
    }
    
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, filePath]);

  const loadFile = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const url = await streamFile(filePath);
      setFileUrl(url);
    } catch (error) {
      setError('Failed to load file');
      toast.error('Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl('');
    }
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {fileName}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-2">
                <FaSpinner className="animate-spin text-blue-500" size={32} />
                <span className="text-gray-600">Loading file...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={loadFile}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {fileUrl && !isLoading && !error && (
            <div className="h-full">
              {fileName.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0 rounded"
                  title={fileName}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            Close
          </button>
          {fileUrl && (
            <Button
              onClick={handleDownload}
              title="Download File"
              icon={FaDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileStreamModal;
