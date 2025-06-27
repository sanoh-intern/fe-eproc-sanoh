import React from 'react';
import { FaTimes, FaDownload, FaFileAlt, FaEye } from 'react-icons/fa';
import Button from './Forms/Button';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  url: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  filename,
  url,
}) => {
  if (!isOpen) return null

  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename)
  const isPDF = /\.pdf$/i.test(filename)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Preview: {filename}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <img
              src={url}
              alt={filename}
              className="w-full h-auto max-h-full object-contain"
            />
          ) : isPDF ? (
            <iframe
              src={url}
              title={filename}
              className="w-full h-[70vh] border-0"
            />
          ) : (
            <div className="text-center py-8">
              <FaFileAlt size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Preview not available for this file type
              </p>
              <a
                href={url}
                download={filename}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="mr-2" />
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
          <Button
            onClick={onClose}
            title="Close"
            icon={FaTimes}
            className="text-white bg-red hover:bg-red-600 transition-colors"
          />
          <Button
            onClick={() => {
              window.open(url, '_blank')
            }}
            title="Open in New Tab"
            icon={FaEye}
          />
          <Button
            title="Download File"
            onClick={() => {
              const link = document.createElement('a')
              link.href = url
              link.download = filename
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            icon={FaDownload}
          />
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal
