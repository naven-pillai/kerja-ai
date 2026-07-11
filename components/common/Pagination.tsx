'use client';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:bg-gray-300"
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(index + 1)}
          className={`px-4 py-2 text-sm rounded-md ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm bg-gray-200 rounded-md disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
}
