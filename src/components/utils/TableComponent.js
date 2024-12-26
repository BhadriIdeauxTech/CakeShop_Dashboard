import React, { useState } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const TableComponent = ({ headers, data, renderActions, itemsPerPage = 5 }) => {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get current page data slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    // Change page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <Table responsive>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        {renderActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, idx) => (
                                    <td key={idx}>{item[header]}</td>
                                ))}
                                {renderActions && (
                                    <td>
                                        <button onClick={() => renderActions(item)}>Action</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length + 1}>No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                                previous
                                onClick={() => handlePageChange(currentPage - 1)}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index} active={currentPage === index + 1}>
                                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                                next
                                onClick={() => handlePageChange(currentPage + 1)}
                            />
                        </PaginationItem>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default TableComponent;
