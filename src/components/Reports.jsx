import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const ReportTable = () => {
    const dummyData = [
        { date: '2024-10-01', reportType: 'Sales Report', category: 'Men\'s Clothing', type: 'Shirts', totalSales: 1200, profit: 300 },
        { date: '2024-10-02', reportType: 'Inventory Report', category: 'Women\'s Clothing', type: 'Dresses', totalSales: 850, profit: 200 },
        { date: '2024-10-03', reportType: 'Stock Movement Report', category: 'Accessories', type: 'Belts', totalSales: 650, profit: 150 },
        { date: '2024-10-04', reportType: 'Sales Report', category: 'Men\'s Clothing', type: 'Pants', totalSales: 1600, profit: 400 },
        { date: '2024-10-05', reportType: 'Profit/Loss Report', category: 'Women\'s Clothing', type: 'Skirts', totalSales: 950, profit: 180 },
        { date: '2024-10-06', reportType: 'Product-wise Sales Report', category: 'Men\'s Clothing', type: 'T-Shirts', totalSales: 2000, profit: 500 },
        { date: '2024-10-07', reportType: 'Inventory Report', category: 'Accessories', type: 'Shoes', totalSales: 750, profit: 220 },
        { date: '2024-10-08', reportType: 'Stock Movement Report', category: 'Women\'s Clothing', type: 'Jackets', totalSales: 450, profit: 120 },
        { date: '2024-10-09', reportType: 'Sales Report', category: 'Accessories', type: 'Watches', totalSales: 1300, profit: 350 },
        { date: '2024-10-10', reportType: 'Profit/Loss Report', category: 'Women\'s Clothing', type: 'Blouses', totalSales: 700, profit: 190 },
        { date: '2024-10-01', reportType: 'Sales Report', category: 'Men\'s Clothing', type: 'Shirts', totalSales: 1200, profit: 300 },
        { date: '2024-10-02', reportType: 'Inventory Report', category: 'Women\'s Clothing', type: 'Dresses', totalSales: 850, profit: 200 },
        { date: '2024-10-03', reportType: 'Stock Movement Report', category: 'Accessories', type: 'Belts', totalSales: 650, profit: 150 },
        { date: '2024-10-04', reportType: 'Sales Report', category: 'Men\'s Clothing', type: 'Pants', totalSales: 1600, profit: 400 },
        { date: '2024-10-05', reportType: 'Profit/Loss Report', category: 'Women\'s Clothing', type: 'Skirts', totalSales: 950, profit: 180 },
        { date: '2024-10-06', reportType: 'Product-wise Sales Report', category: 'Men\'s Clothing', type: 'T-Shirts', totalSales: 2000, profit: 500 },
        { date: '2024-10-07', reportType: 'Inventory Report', category: 'Accessories', type: 'Shoes', totalSales: 750, profit: 220 },
        { date: '2024-10-08', reportType: 'Stock Movement Report', category: 'Women\'s Clothing', type: 'Jackets', totalSales: 450, profit: 120 },
        { date: '2024-10-09', reportType: 'Sales Report', category: 'Accessories', type: 'Watches', totalSales: 1300, profit: 350 },
        { date: '2024-10-10', reportType: 'Profit/Loss Report', category: 'Women\'s Clothing', type: 'Blouses', totalSales: 700, profit: 190 },
    ];

    const [reportType, setReportType] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [filteredData, setFilteredData] = useState(dummyData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const filterReports = () => {
        const filtered = dummyData.filter(item => {
            return (
                (reportType ? item.reportType === reportType : true) &&
                (category ? item.category === category : true) &&
                (type ? item.type === type : true)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Date', 'Report Type', 'Category', 'Type', 'Total Sales', 'Profit']],
            body: filteredData.map(item => [
                item.date,
                item.reportType,
                item.category,
                item.type,
                item.totalSales,
                item.profit
            ])
        });
        doc.save("report.pdf");
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, "report.xlsx");
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className=" salesReport">
            <h5 className="mb-4">Report Menu</h5>
            <div className="mb-4">
                <div className="row">
                    <div className="col-md-3 mb-2">
                        <label className='mb-1'>Report Type: </label>
                        <select className="form-control" onChange={(e) => setReportType(e.target.value)} value={reportType}>
                            <option value="">Select Report Type</option>
                            <option value="Sales Report">Sales Report</option>
                            <option value="Inventory Report">Inventory Report</option>
                            <option value="Product-wise Sales Report">Product-wise Sales Report</option>
                            <option value="Profit/Loss Report">Profit/Loss Report</option>
                            <option value="Stock Movement Report">Stock Movement Report</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2">
                        <label className='mb-1'>Category: </label>
                        <select className="form-control" onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value="">Select Category</option>
                            <option value="Men's Clothing">Men's Clothing</option>
                            <option value="Women's Clothing">Women's Clothing</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2">
                        <label className='mb-1'>Type: </label>
                        <select className="form-control" onChange={(e) => setType(e.target.value)} value={type}>
                            <option value="">Select Type</option>
                            <option value="Shirts">Shirts</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Pants">Pants</option>
                            <option value="T-Shirts">T-Shirts</option>
                            <option value="Skirts">Skirts</option>
                            <option value="Jackets">Jackets</option>
                            <option value="Belts">Belts</option>
                            <option value="Shoes">Shoes</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2 d-flex align-items-end">
                        <button className="btn btn-primary" onClick={filterReports}>Show Report</button>
                    </div>
                </div>
            </div>

            {/* Report Table inside Card */}
            <div className="card">
                <div className="card-header d-flex justify-content-between ">
                    <h5>Generated Report</h5>

                    <div >
                        <button className="btn btn-sm  btn-success  mr-4" onClick={exportToPDF}>Export to PDF</button>
                        <button className="btn btn-sm  btn-success ms-3 " onClick={exportToExcel}>Export to Excel</button>
                    </div>
                </div>
                <div className="card-body">
                   
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Report Type</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Total Sales</th>
                                    <th>Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">No data found</td>
                                    </tr>
                                ) : (
                                    currentRows.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.date}</td>
                                            <td>{item.reportType}</td>
                                            <td>{item.category}</td>
                                            <td>{item.type}</td>
                                            <td>{item.totalSales}</td>
                                            <td>{item.profit}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-end">
                        <nav>
                            <ul className="pagination">
                                <li className="page-item">
                                    <button
                                        className="btn btn-sm  btn-primary"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {[...Array(Math.ceil(filteredData.length / rowsPerPage))].map((_, index) => (
                                    <li key={index} className={` ms-1 page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="btn btn-sm  btn-primary" onClick={() => paginate(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item ms-1">
                                    <button
                                        className="btn btn-sm  btn-primary"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportTable;
