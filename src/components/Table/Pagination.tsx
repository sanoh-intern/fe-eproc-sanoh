import React from 'react';

interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalRows,
  rowsPerPage,
  currentPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const maxPageNumbersToShow = 5;
  const pageNumbers = [];

  const firstEntry = (currentPage - 1) * rowsPerPage + 1;
  const lastEntry = Math.min(currentPage * rowsPerPage, totalRows);

  if (totalPages <= maxPageNumbersToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{firstEntry}</span> to <span className="font-medium">{lastEntry}</span> of <span className="font-medium">{totalRows}</span> results
      </div>

      <div className="flex items-center gap-4">
        <select
          className="px-2 py-1 border rounded-md"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((value) => (
            <option key={value} value={value}>
              Show {value}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center pagination">
          <button
            className="px-3 py-3 text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-white"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M8.766.566A2 2 0 0 0 6.586 1L1 6.586a2 2 0 0 0 0 2.828L6.586 15A2 2 0 0 0 10 13.586V2.414A2 2 0 0 0 8.766.566Z" />
            </svg>
          </button>

          {pageNumbers.map((number, index) => (
            <button
              key={index}
              className={`px-4 py-2 ${
                number === currentPage ? 'bg-primary text-white' : 'bg-gray-200 text-primary'
              } rounded-md hover:bg-primarylight hover:text-black ${
                number === '...' ? 'cursor-default' : ''
              }`}
              onClick={() => typeof number === 'number' && onPageChange(number)}
              disabled={number === '...'}
            >
              {number}
            </button>
          ))}

          <button
            className="px-3 py-3 text-black bg-gray-200 rounded-md hover:bg-gray-300 hover:text-white"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
              <path d="M1.234 15.434A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1A2 2 0 0 0 1 2.414v11.172a2 2 0 0 0 1.234 1.848Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
