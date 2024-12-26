import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const  DashboardSales = () => {
    const dummyData = [
        { id: 1, saleDate: '2024-10-01', customerName: 'John Doe', product: 'Shirt', quantitySold: 2, salePricePerUnit: 500, totalSaleAmount: 1000, paymentMode: 'Cash', saleStatus: 'Completed' },
        { id: 2, saleDate: '2024-10-02', customerName: 'Jane Smith', product: 'Pants', quantitySold: 1, salePricePerUnit: 700, totalSaleAmount: 700, paymentMode: 'Credit Card', saleStatus: 'Pending' },
        { id: 3, saleDate: '2024-10-03', customerName: 'Michael Brown', product: 'T-Shirt', quantitySold: 3, salePricePerUnit: 300, totalSaleAmount: 900, paymentMode: 'Debit Card', saleStatus: 'Completed' },
        { id: 4, saleDate: '2024-10-04', customerName: 'Emily Davis', product: 'Jacket', quantitySold: 1, salePricePerUnit: 1200, totalSaleAmount: 1200, paymentMode: 'Cash', saleStatus: 'Completed' },
        { id: 5, saleDate: '2024-10-05', customerName: 'Chris Wilson', product: 'Shoes', quantitySold: 2, salePricePerUnit: 800, totalSaleAmount: 1600, paymentMode: 'Credit Card', saleStatus: 'Pending' },
        { id: 6, saleDate: '2024-10-06', customerName: 'Linda Moore', product: 'Dress', quantitySold: 1, salePricePerUnit: 1500, totalSaleAmount: 1500, paymentMode: 'Cash', saleStatus: 'Completed' },
        { id: 7, saleDate: '2024-10-07', customerName: 'Mark Taylor', product: 'Bag', quantitySold: 1, salePricePerUnit: 900, totalSaleAmount: 900, paymentMode: 'Credit Card', saleStatus: 'Pending' },
        { id: 8, saleDate: '2024-10-08', customerName: 'Sara Martinez', product: 'Hat', quantitySold: 1, salePricePerUnit: 400, totalSaleAmount: 400, paymentMode: 'Debit Card', saleStatus: 'Completed' },
        { id: 9, saleDate: '2024-10-09', customerName: 'James Anderson', product: 'Socks', quantitySold: 5, salePricePerUnit: 100, totalSaleAmount: 500, paymentMode: 'Cash', saleStatus: 'Completed' },
        { id: 10, saleDate: '2024-10-10', customerName: 'Olivia Lee', product: 'Gloves', quantitySold: 2, salePricePerUnit: 250, totalSaleAmount: 500, paymentMode: 'Credit Card', saleStatus: 'Pending' }
    ];
    


    const [filteredData, setFilteredData] = useState(dummyData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;



    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Sale Date', 'Customer Name', 'Product', 'Quantity Sold', 'Sale Price per Unit', 'Total Sale Amount', 'Payment Mode', 'Sale Status']],
            body: filteredData.map(item => [
                item.saleDate,
                item.customerName,
                item.product,
                item.quantitySold,
                item.salePricePerUnit,
                item.totalSaleAmount,
                item.paymentMode,
                item.saleStatus
            ])
        });
        doc.save('sales_report.pdf');
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
        XLSX.writeFile(wb, 'sales_report.xlsx');
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'badge bg-success';
            case 'Pending':
                return 'badge bg-warning';
            case 'Cancelled':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    // Generate Invoice functionality
    const generateInvoice = (id) => {
        const sale = filteredData.find(item => item.id === id);
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Invoice - ${sale.id}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Customer: ${sale.customerName}`, 14, 32);
        doc.text(`Product: ${sale.product}`, 14, 42);
        doc.text(`Quantity Sold: ${sale.quantitySold}`, 14, 52);
        doc.text(`Sale Price per Unit: ${sale.salePricePerUnit}`, 14, 62);
        doc.text(`Total Sale Amount: ${sale.totalSaleAmount}`, 14, 72);
        doc.text(`Payment Mode: ${sale.paymentMode}`, 14, 82);
        doc.text(`Sale Date: ${sale.saleDate}`, 14, 92);
        doc.text(`Sale Status: ${sale.saleStatus}`, 14, 102);
        doc.save(`Invoice_${sale.id}.pdf`);
    };

    return (
        <div className=" salesReport">
            

            <div className="card">
            <div className="card-header d-flex justify-content-between">
                    <h5>Sales Report</h5>

                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>Sale Date</th>
                                    <th>Customer Name</th>
                                    <th>Product</th>
                                    <th>Quantity Sold</th>
                                    <th>Sale Price per Unit</th>
                                    <th>Total Sale Amount</th>
                                    <th>Payment Mode</th>
                                    <th>Sale Status</th>
                 
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">No data found</td>
                                    </tr>
                                ) : (
                                    currentRows.map((item) => (
                                        <tr key={item.id}>
                                            <td>{`INV-${item.id.toString().padStart(6, '0')}`}</td>
                                            <td>{item.saleDate}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.product}</td>
                                            <td>{item.quantitySold}</td>
                                            <td>{item.salePricePerUnit}</td>
                                            <td>{item.totalSaleAmount}</td>
                                            <td>{item.paymentMode}</td>
                                            <td className='text-center'>
                                                <div className="d-flex justify-content-evenly align-items-center">
                                                  
                                                    <p className={`badge mb-0 text-center ${getBadgeClass(item.saleStatus)}`}>
                                                        {item.saleStatus}
                                                    </p>
                                                </div>
                                            </td>
                                           
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>


                        {/* Pagination */}
                        <div className="d-flex justify-content-end">
                            <nav>
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button
                                            className="btn btn-sm btn-primary ms-1"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(Math.ceil(filteredData.length / rowsPerPage))].map((_, index) => (
                                        <li key={index} className="page-item">
                                            <button
                                                className="btn btn-sm btn-primary ms-1"
                                                onClick={() => paginate(index + 1)}
                                                disabled={currentPage === index + 1}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <button
                                            className="btn btn-sm btn-primary ms-1"
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
    </div >
  );
};

export default  DashboardSales;




