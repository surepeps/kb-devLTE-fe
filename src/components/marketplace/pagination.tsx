/** @format */

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-4">
      {/* Items count */}
      <div className="text-sm text-[#5A5D63]">
        Showing {startItem} to {endItem} of {totalItems} properties
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
            ${
              currentPage === 1 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#5A5D63] border border-[#C7CAD0] hover:border-[#8DDB90] hover:text-[#8DDB90]"
            }
          `}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() => {
                if (pageNumber !== "..." && typeof pageNumber === "number") {
                  onPageChange(pageNumber);
                }
              }}
              disabled={pageNumber === "..." || isLoading}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors
                ${
                  pageNumber === currentPage
                    ? "bg-[#8DDB90] text-white"
                    : pageNumber === "..."
                      ? "text-[#5A5D63] cursor-default"
                      : isLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-white text-[#5A5D63] border border-[#C7CAD0] hover:border-[#8DDB90] hover:text-[#8DDB90]"
                }
              `}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
            ${
              currentPage === totalPages || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-[#5A5D63] border border-[#C7CAD0] hover:border-[#8DDB90] hover:text-[#8DDB90]"
            }
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
