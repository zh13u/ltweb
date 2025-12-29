import React from "react";

const Pagination = ({currentPage, totalPages, onPageChange}) => {
    const pageNumbers = [];
    for(let i = 1; i <= totalPages; i++){
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return(
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            {pageNumbers.map((number)=>(
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`btn ${number === currentPage ? 'active' : ''}`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    )
}
export default Pagination;