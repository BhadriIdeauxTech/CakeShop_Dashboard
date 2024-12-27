import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormFeedback } from 'reactstrap';
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productData, setProductData] = useState({ productId: '', productName: '', description: '' });
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Fetch product data
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://192.168.29.120:8086/product/all');
            setProducts(response.data);  // Directly set the products without pagination
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    
    const handleEditProduct = (product) => {
        setProductData({
            productId: product.productId,
            productName: product.productName,
            description: product.description
        });
        setModalOpen(true);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://192.168.29.120:8086/product/${productId}`);
            toast.success('Product deleted successfully!');
            fetchProducts(); // Re-fetch products after delete
        } catch (error) {
            toast.error('Error deleting product');
            console.error('Error deleting product:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleUpdateProduct = async () => {
        const { productName, description } = productData;
        if (!productName || !description) {
            setErrors({
                productName: !productName ? 'Product Name is required' : '',
                description: !description ? 'Description is required' : ''
            });
            return;
        }

        try {
            await axios.put(`http://192.168.29.120:8086/product/${productData.productId}`, productData);
            toast.success('Product updated successfully!');
            setModalOpen(false);
            fetchProducts(); // Re-fetch products after update
        } catch (error) {
            toast.error('Error updating product');
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className='text-center mb-0'>Product List</h5>
            </div>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead>
                        <tr>
                            <th>Product Id</th>
                            <th>Product Name</th>
                            <th>Description</th>
 
                            <th>Price</th>
                            <th>Weight</th>
                            <th>Pieces</th>
                            <th>Quantity </th>
                  
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productId}</td>
                                <td>{product.productName}</td>
                                <td>{product.description}</td>
                   
                                <td>{product.weight}</td>
                                <td>{product.pieces}</td>
                                <td>{product.quantityAvailable}</td>

 
                                <td>{product.totalPrice ? product.totalPrice : 'N/A'}</td>
                                <td>
                                    <span onClick={() => handleEditProduct(product)} className="edit-button me-3"><MdEditSquare /> </span>
                                    <span onClick={() => handleDeleteProduct(product.productId)} className='delete-button'><MdDelete /> </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages >= 1 && (
                    <nav className="d-flex justify-content-end m-2">
                        <ul className="pagination">
                            <li className="page-item">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`ms-1 page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="btn btn-sm btn-primary" onClick={() => handlePageChange(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item ms-1">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}

<Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
    <ModalHeader toggle={() => setModalOpen(false)}>Edit Product</ModalHeader>
    <ModalBody>
        <FormGroup>
            <Label for="productId">Product ID</Label>
            <Input
                type="text"
                name="productId"
                value={productData.productId}
                onChange={handleChange}
                disabled
            />
        </FormGroup>
        <FormGroup>
            <Label for="categoryId">Category ID</Label>
            <Input
                type="text"
                name="categoryId"
                value={productData.categoryId}
                onChange={handleChange}
                disabled
            />
        </FormGroup>
        <FormGroup>
            <Label for="subcategoryId">Subcategory ID</Label>
            <Input
                type="text"
                name="subcategoryId"
                value={productData.subcategoryId}
                onChange={handleChange}
                disabled
            />
        </FormGroup>
        <FormGroup>
            <Label for="productName">Product Name</Label>
            <Input
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                invalid={!!errors.productName}
            />
            {errors.productName && <FormFeedback>{errors.productName}</FormFeedback>}
        </FormGroup>
        <FormGroup>
            <Label for="price">Price</Label>
            <Input
                type="text"
                name="price"
                value={productData.price}
                onChange={handleChange}
            />
        </FormGroup>
        <FormGroup>
            <Label for="weight">Weight</Label>
            <Input
                type="text"
                name="weight"
                value={productData.weight}
                onChange={handleChange}
            />
        </FormGroup>
        <FormGroup>
            <Label for="pieces">Pieces</Label>
            <Input
                type="text"
                name="pieces"
                value={productData.pieces}
                onChange={handleChange}
            />
        </FormGroup>
        <FormGroup>
            <Label for="description">Description</Label>
            <Input
                type="text"
                name="description"
                value={productData.description}
                onChange={handleChange}
                invalid={!!errors.description}
            />
            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
        </FormGroup>
        <FormGroup>
            <Label for="quantityAvailable">Quantity Available</Label>
            <Input
                type="text"
                name="quantityAvailable"
                value={productData.quantityAvailable}
                onChange={handleChange}
            />
        </FormGroup>
        <FormGroup>
            <Label for="totalPrice">Total Price</Label>
            <Input
                type="text"
                name="totalPrice"
                value={productData.totalPrice || ''}
                onChange={handleChange}
            />
        </FormGroup>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" onClick={handleUpdateProduct}>Update Product</Button>
        <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
    </ModalFooter>
</Modal>

                <ToastContainer />
            </div>
        </div>
    );
};

export default ProductList;
