import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormFeedback } from 'reactstrap';

const ReturnItemTable = () => {
    const dummyData = [
        { returnDate: '2024-10-01', invoiceNumber: 'INV001', customerName: 'John Doe', product: 'Shirt', quantity: 2, reason: 'Defective', refundAmount: 50, refundMethod: 'Credit' },
        { returnDate: '2024-10-02', invoiceNumber: 'INV002', customerName: 'Jane Smith', product: 'Pants', quantity: 1, reason: 'Wrong Size', refundAmount: 40, refundMethod: 'Cash' },
        { returnDate: '2024-10-03', invoiceNumber: 'INV003', customerName: 'Alice Brown', product: 'T-Shirt', quantity: 3, reason: 'Color Mismatch', refundAmount: 60, refundMethod: 'Credit' },
        { returnDate: '2024-10-04', invoiceNumber: 'INV004', customerName: 'Bob White', product: 'Jacket', quantity: 1, reason: 'Not as Described', refundAmount: 100, refundMethod: 'Cash' },
        { returnDate: '2024-10-05', invoiceNumber: 'INV005', customerName: 'Charlie Green', product: 'Shoes', quantity: 2, reason: 'Defective', refundAmount: 80, refundMethod: 'Credit' },
        { returnDate: '2024-10-06', invoiceNumber: 'INV006', customerName: 'David Black', product: 'Dress', quantity: 1, reason: 'Wrong Size', refundAmount: 70, refundMethod: 'Cash' },
        { returnDate: '2024-10-07', invoiceNumber: 'INV007', customerName: 'Eve White', product: 'Bag', quantity: 1, reason: 'Not Satisfied', refundAmount: 50, refundMethod: 'Credit' },
        { returnDate: '2024-10-08', invoiceNumber: 'INV008', customerName: 'Frank Blue', product: 'Hat', quantity: 1, reason: 'Defective', refundAmount: 20, refundMethod: 'Cash' },
    ];

    const [returnDate, setReturnDate] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [refundMethod, setRefundMethod] = useState('');
    const [filteredData, setFilteredData] = useState(dummyData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};
        if (!returnDate) formErrors.returnDate = "Return Date is required";
        if (!invoiceNumber) formErrors.invoiceNumber = "Invoice Number is required";
        if (!customerName) formErrors.customerName = "Customer Name is required";
        if (!product) formErrors.product = "Product is required";
        if (!quantity) formErrors.quantity = "Quantity is required";
        if (!reason) formErrors.reason = "Reason for return is required";
        if (!refundAmount) formErrors.refundAmount = "Refund Amount is required";
        if (!refundMethod) formErrors.refundMethod = "Refund Method is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleReturnSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newReturn = {
                returnDate,
                invoiceNumber,
                customerName,
                product,
                quantity,
                reason,
                refundAmount,
                refundMethod,
            };
            setFilteredData([...filteredData, newReturn]);
            setReturnDate('');
            setInvoiceNumber('');
            setCustomerName('');
            setProduct('');
            setQuantity('');
            setReason('');
            setRefundAmount('');
            setRefundMethod('');
            setErrors({});
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Return Date', 'Invoice Number', 'Customer Name', 'Product', 'Quantity', 'Reason for Return', 'Refund Amount', 'Refund Method']],
            body: filteredData.map(item => [
                item.returnDate,
                item.invoiceNumber,
                item.customerName,
                item.product,
                item.quantity,
                item.reason,
                item.refundAmount,
                item.refundMethod
            ])
        });
        doc.save("return-item-report.pdf");
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Return Report");
        XLSX.writeFile(wb, "return-item-report.xlsx");
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="  returnItem">
            <h5 className="mb-4">Add Return Item </h5>
            <div className="mb-4">
                <form onSubmit={handleReturnSubmit}>
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Return Date: </label>
                            <input
                                type="date"
                                className={`form-control ${errors.returnDate ? 'is-invalid' : ''}`}
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                            {errors.returnDate && <FormFeedback>{errors.returnDate}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Invoice Number: </label>
                            <input
                                type="text"
                                className={`form-control ${errors.invoiceNumber ? 'is-invalid' : ''}`}
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                            />
                            {errors.invoiceNumber && <FormFeedback>{errors.invoiceNumber}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Customer Name: </label>
                            <input
                                type="text"
                                className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                            {errors.customerName && <FormFeedback>{errors.customerName}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Product: </label>
                            <input
                                type="text"
                                className={`form-control ${errors.product ? 'is-invalid' : ''}`}
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                            />
                            {errors.product && <FormFeedback>{errors.product}</FormFeedback>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Quantity: </label>
                            <input
                                type="number"
                                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Reason for Return: </label>
                            <select
                                className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">Select Reason</option>
                                <option value="Defective">Defective</option>
                                <option value="Wrong Size">Wrong Size</option>
                                <option value="Color Mismatch">Color Mismatch</option>
                                <option value="Not as Described">Not as Described</option>
                                <option value="Not Satisfied">Not Satisfied</option>
                            </select>
                            {errors.reason && <FormFeedback>{errors.reason}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Refund Amount: </label>
                            <input
                                type="text"
                                className={`form-control ${errors.refundAmount ? 'is-invalid' : ''}`}
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                            />
                            {errors.refundAmount && <FormFeedback>{errors.refundAmount}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Refund Method: </label>
                            <select
                                className={`form-control ${errors.refundMethod ? 'is-invalid' : ''}`}
                                value={refundMethod}
                                onChange={(e) => setRefundMethod(e.target.value)}
                            >
                                <option value="">Select Method</option>
                                <option value="Credit">Credit</option>
                                <option value="Cash">Cash</option>
                            </select>
                            {errors.refundMethod && <FormFeedback>{errors.refundMethod}</FormFeedback>}
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary mt-3">Add Return</button>
                    </div>
                </form>
            </div>
            <div className="card">
                <div className="card-header d-flex justify-content-between ">
                    <h5>Return Item List</h5>

                    <div >
                        <button className="btn btn-sm  btn-success  mr-4" onClick={exportToPDF}>Export to PDF</button>
                        <button className="btn btn-sm  btn-success ms-3 " onClick={exportToExcel}>Export to Excel</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Return Date</th>
                                    <th>Invoice Number</th>
                                    <th>Customer Name</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Reason</th>
                                    <th>Refund Amount</th>
                                    <th>Refund Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.returnDate}</td>
                                        <td>{item.invoiceNumber}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.product}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.reason}</td>
                                        <td>{item.refundAmount}</td>
                                        <td>{item.refundMethod}</td>
                                    </tr>
                                ))}
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
}

export default ReturnItemTable;
