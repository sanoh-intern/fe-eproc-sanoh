import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaCog } from 'react-icons/fa';
import { streamFile } from '../api/Action/stream-file';
import { toast } from 'react-toastify';
import Button from './Forms/Button';

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface ModalSizeConfig {
  maxWidth: string;
  maxHeight: string;
  label: string;
}

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
}) => {  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');  const [modalSize, setModalSize] = useState<ModalSize>('medium');
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [customHeight, setCustomHeight] = useState<number>(85); // Percentage - default 85%
  const [isCustomSize, setIsCustomSize] = useState(true); // Default ke custom size
  const [iframeError, setIframeError] = useState(false); // Track iframe loading errors
  const sizeOptionsRef = useRef<HTMLDivElement>(null);const modalSizes: Record<ModalSize, ModalSizeConfig> = {
    small: {
      maxWidth: '672px', // max-w-2xl equivalent
      maxHeight: '50vh',
      label: 'Small (50%)'
    },
    medium: {
      maxWidth: '896px', // max-w-4xl equivalent
      maxHeight: '75vh',
      label: 'Medium (75%)'
    },
    large: {
      maxWidth: '1152px', // max-w-6xl equivalent
      maxHeight: '85vh',
      label: 'Large (85%)'
    },
    fullscreen: {
      maxWidth: '95vw',
      maxHeight: '95vh',
      label: 'Fullscreen (95%)'
    }
  };
  // Close size options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sizeOptionsRef.current && !sizeOptionsRef.current.contains(event.target as Node)) {
        setShowSizeOptions(false);
      }
    };

    if (showSizeOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSizeOptions]);
  useEffect(() => {
    if (isOpen && filePath) {
      console.log('Modal opened with filePath:', filePath);
      loadFile();
    }
    
    return () => {
      if (fileUrl) {
        console.log('Cleaning up blob URL:', fileUrl);
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, filePath]);

  // Add a separate useEffect to monitor fileUrl changes
  useEffect(() => {
    console.log('FileUrl state changed:', fileUrl);
    if (fileUrl) {
      console.log('FileUrl is available for rendering');
    }
  }, [fileUrl]);  const loadFile = async () => {
    setIsLoading(true);
    setError('');
    setIframeError(false); // Reset iframe error state
    
    console.log('LoadFile called with:', { filePath, fileName });
    
    try {
      const url = await streamFile(filePath);
      console.log('Received URL from streamFile:', url);
      setFileUrl(url);
    } catch (error) {
      console.error('Error in loadFile:', error);
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

  const handleSizeChange = (size: ModalSize) => {
    setModalSize(size);
    setIsCustomSize(false);
    setShowSizeOptions(false);
  };
  const handleCustomSizeChange = (height: number) => {
    setCustomHeight(height);
    setIsCustomSize(true);
  };  const getModalStyle = () => {
    if (isCustomSize) {
      return { 
        maxWidth: '1152px', // Large width untuk custom
        maxHeight: `${customHeight}vh`,
        height: `${customHeight}vh`
      };
    }
    return {
      maxWidth: modalSizes[modalSize].maxWidth,
      maxHeight: modalSizes[modalSize].maxHeight
    };
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
  
  return (    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        className={`bg-white rounded-lg shadow-xl w-full flex flex-col`}
        style={getModalStyle()}
      >
        {/* Header */}        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {fileName}
            </h3>
            {isCustomSize && (
              <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded">
                Custom {customHeight}%
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Size Options */}
            <div className="relative" ref={sizeOptionsRef}>
              <button
                onClick={() => setShowSizeOptions(!showSizeOptions)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                title="Resize Modal"
              >
                <FaCog size={16} />
              </button>
              
              {showSizeOptions && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64 p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Modal Size</h4>
                  
                  {/* Size Presets */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(modalSizes).map(([size, config]) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size as ModalSize)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          modalSize === size && !isCustomSize
                            ? 'bg-blue-100 text-primary'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                    {/* Custom Size */}
                  <div className="border-t pt-3">
                    <label className={`block text-sm font-medium mb-2 ${
                      isCustomSize ? 'text-primary' : 'text-gray-700'
                    }`}>
                      Custom Height: {customHeight}%
                      {isCustomSize && <span className="ml-2 text-xs bg-blue-100 text-primary px-2 py-1 rounded">Active</span>}
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="95"
                      value={customHeight}
                      onChange={(e) => handleCustomSizeChange(Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        isCustomSize ? 'bg-blue-200' : 'bg-gray-200'
                      }`}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30%</span>
                      <span>95%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
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
                <FaSpinner className="animate-spin text-primary" size={32} />
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
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}          
          {fileUrl && !isLoading && !error && (
            <div className="h-full">
              {fileName.toLowerCase().includes('.pdf') ? (
                <div className="h-full flex flex-col">
                  {/* Try multiple PDF display methods */}
                  <div className="flex-1 relative">
                    {!iframeError ? (
                      <iframe
                        src={`${fileUrl}#view=FitH`}
                        className="w-full h-full border-0 rounded"
                        title={fileName}
                        allow="fullscreen"
                        onLoad={(e) => {
                          console.log('PDF iframe loaded successfully');
                          // Check if iframe actually has content
                          const iframe = e.target as HTMLIFrameElement;
                          setTimeout(() => {
                            try {
                              // If iframe is empty or has navigation issues, fallback
                              if (!iframe.contentDocument && !iframe.contentWindow) {
                                console.log('Iframe empty, switching to embed fallback');
                                setIframeError(true);
                              }
                            } catch (err) {
                              console.log('Iframe access restricted, but this is normal for blob URLs');
                            }
                          }, 1000);
                          setIframeError(false);
                        }}
                        onError={(e) => {
                          console.error('PDF iframe error:', e);
                          setIframeError(true);
                        }}
                      />
                    ) : (
                      /* Fallback: Use object tag which is more reliable for PDFs */
                      <object
                        data={fileUrl}
                        type="application/pdf"
                        className="w-full h-full border-0 rounded"
                        title={fileName}
                      >
                        {/* If object fails, show embed */}
                        <embed
                          src={fileUrl}
                          type="application/pdf"
                          className="w-full h-full border-0 rounded"
                          title={fileName}
                        />
                        {/* If both fail, show fallback message */}
                        <div className="flex items-center justify-center h-full bg-gray-50">
                          <div className="text-center p-4">
                            <p className="text-gray-600 mb-4">Unable to display PDF in browser</p>
                            <div className="space-x-2">
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Open in New Tab
                              </a>
                              <Button
                                onClick={handleDownload}
                                title="Download PDF"
                                icon={FaDownload}
                              />
                            </div>
                          </div>
                        </div>
                      </object>
                    )}
                    
                    {/* Force fallback button */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setIframeError(!iframeError)}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                        title="Toggle display method"
                      >
                        {iframeError ? 'Try IFrame' : 'Try Object'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Alternative: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open in new tab</a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => console.error('Image error:', e)}
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
            className="px-4 py-2 text-white bg-red hover:bg-red-600 rounded transition-colors"
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
