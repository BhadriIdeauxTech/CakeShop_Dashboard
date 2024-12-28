import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormFeedback } from 'reactstrap';
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productData, setProductData] = useState({
        productId: '',
        productName: '',
        description: '',
        price: '',
        weight: '',
        pieces: '',
        quantityAvailable: '',
        totalPrice: ''
    });
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const productsPerPage = 5;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://192.168.29.120:8086/product/all');
            setProducts(response.data);
            setTotalPages(Math.ceil(response.data.length / productsPerPage));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEditProduct = (product) => {
        setProductData({
            productId: product.productId,
            productName: product.productName,
            description: product.description,
            price: product.price || '',
            weight: product.weight || '',
            pieces: product.pieces || '',
            quantityAvailable: product.quantityAvailable || '',
            totalPrice: product.totalPrice || '',
        });
        setModalOpen(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleUpdateProduct = async () => {
        const { productName, description, price, weight, pieces, quantityAvailable, totalPrice } = productData;
        if (!productName || !description || !price || !weight || !pieces || !quantityAvailable || !totalPrice) {
            setErrors({
                productName: !productName ? 'Product Name is required' : '',
                description: !description ? 'Description is required' : '',
                price: !price ? 'Price is required' : '',
                weight: !weight ? 'Weight is required' : '',
                pieces: !pieces ? 'Pieces is required' : '',
                quantityAvailable: !quantityAvailable ? 'Quantity is required' : '',
                totalPrice: !totalPrice ? 'Total Price is required' : '',
            });
            return;
        }
    
        // Log productData to check if it's correct
        console.log("Updating product with data:", productData);
    
        try {
            // PUT request to update the product
            await axios.put(`http://192.168.29.120:8086/product/${productData.productId}`, productData);
    
            // Success: Update state and close modal
            toast.success('Product updated successfully!');
    
            // Update the products list in state
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.productId === productData.productId ? { ...product, ...productData } : product
                )
            );
    
            // Close modal and clear errors
            setModalOpen(false);
            setErrors({});
        } catch (error) {
            // Handle error if the API call fails
            toast.error('Error updating product');
            console.error('Error updating product:', error);
        }
    };
    console.log(productData);  // Log data before sending the PUT request

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://192.168.29.120:8086/product/${productId}`);
            toast.success('Product deleted successfully!');

            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.productId !== productId)
            );
        } catch (error) {
            toast.error('Error deleting product');
            console.error('Error deleting product:', error);
        }
    };


    const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="text-center mb-0">Product List</h5>
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
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productId}</td>
                                <td>{product.productName}</td>
                                <td>{product.description}</td>
                                <td>{product.price || 'N/A'}</td>
                                <td>{product.weight || 'N/A'}</td>
                                <td>{product.pieces || 'N/A'}</td>
                                <td>{product.quantityAvailable || 'N/A'}</td>
                                <td>
                                    <span onClick={() => handleEditProduct(product)} className="edit-button me-3">
                                        <MdEditSquare />
                                    </span>
                                    <span onClick={() => handleDeleteProduct(product.productId)} className="delete-button">
                                        <MdDelete />
                                    </span>
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
                                <li
                                    key={index}
                                    className={`ms-1 page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
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
                        {/* Fields */}
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
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                invalid={!!errors.price}
                            />
                            {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="weight">Weight</Label>
                            <Input
                                name="weight"
                                value={productData.weight}
                                onChange={handleChange}
                                invalid={!!errors.weight}
                            />
                            {errors.weight && <FormFeedback>{errors.weight}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="pieces">Pieces</Label>
                            <Input
                                name="pieces"
                                value={productData.pieces}
                                onChange={handleChange}
                                invalid={!!errors.pieces}
                            />
                            {errors.pieces && <FormFeedback>{errors.pieces}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="quantityAvailable">Quantity Available</Label>
                            <Input
                                name="quantityAvailable"
                                value={productData.quantityAvailable}
                                onChange={handleChange}
                                invalid={!!errors.quantityAvailable}
                            />
                            {errors.quantityAvailable && <FormFeedback>{errors.quantityAvailable}</FormFeedback>}
                        </FormGroup>

 
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleUpdateProduct}>
                            Update Product
                        </Button>
                        <Button color="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

export default ProductList;
