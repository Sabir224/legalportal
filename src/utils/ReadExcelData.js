import React, { useState } from "react";

const PageIndexer = () => {
  // Example data: Replace this with your actual dataset
  const data = Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get data for the current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <h1>Page Indexing System</h1>
     

      {/* Pagination controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal",
              backgroundColor: currentPage === i + 1 ? "#ddd" : "#fff",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default PageIndexer;
