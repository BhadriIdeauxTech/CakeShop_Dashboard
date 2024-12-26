import React, { useState } from 'react'; 
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import the jsPDF autotable plugin
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormFeedback } from 'reactstrap'; // Import Reactstrap FormFeedback for validation messages

const RemoveItemTable = () => {
    const dummyData = [
        { removalDate: '2024-10-01', product: 'Shirt', quantity: 2, reason: 'Defective' },
        { removalDate: '2024-10-02', product: 'Pants', quantity: 1, reason: 'Wrong Size' },
        { removalDate: '2024-10-03', product: 'T-Shirt', quantity: 3, reason: 'Color Mismatch' },
        { removalDate: '2024-10-04', product: 'Jacket', quantity: 1, reason: 'Not as Described' },
        { removalDate: '2024-10-05', product: 'Shoes', quantity: 2, reason: 'Defective' },
        { removalDate: '2024-10-06', product: 'Dress', quantity: 1, reason: 'Wrong Size' },
        { removalDate: '2024-10-07', product: 'Bag', quantity: 1, reason: 'Not Satisfied' },
        { removalDate: '2024-10-08', product: 'Hat', quantity: 1, reason: 'Defective' },
    ];

    const [removalDate, setRemovalDate] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [filteredData, setFilteredData] = useState(dummyData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};
        if (!removalDate) formErrors.removalDate = "Removal Date is required";
        if (!product) formErrors.product = "Product is required";
        if (!quantity) formErrors.quantity = "Quantity is required";
        if (!reason) formErrors.reason = "Reason for removal is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleRemoveSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newRemoval = {
                removalDate,
                product,
                quantity,
                reason,
            };
            setFilteredData([...filteredData, newRemoval]);
            setRemovalDate('');
            setProduct('');
            setQuantity('');
            setReason('');
            setErrors({});
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Removal Date', 'Product', 'Quantity', 'Reason for Removal']],
            body: filteredData.map(item => [
                item.removalDate,
                item.product,
                item.quantity,
                item.reason
            ])
        });
        doc.save("remove-item-report.pdf");
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Remove Report");
        XLSX.writeFile(wb, "remove-item-report.xlsx");
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="removeItem">
            <h5 className="mb-4">Add Remove Item</h5>
            <div className="mb-4">
                <form onSubmit={handleRemoveSubmit}>
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Removal Date: </label>
                            <input
                                type="date"
                                className={`form-control ${errors.removalDate ? 'is-invalid' : ''}`}
                                value={removalDate}
                                onChange={(e) => setRemovalDate(e.target.value)}
                            />
                            {errors.removalDate && <FormFeedback>{errors.removalDate}</FormFeedback>}
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
                
                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Quantity: </label>
                            <input
                                type="text"
                                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
                        </div>

                        <div className="col-md-3 mb-2">
                            <label className='mb-1'>Reason for Removal: </label>
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
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary mt-3">Remove Item</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between ">
                    <h5>Remove Item List</h5>

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
                                    <th>Removal Date</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Reason for Removal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.removalDate}</td>
                                        <td>{item.product}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.reason}</td>
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
};

export default RemoveItemTable;
