import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { get, post, put } from '../utils/api';
import { deleteRequest } from '../utils/api';
import showAlert from '../utils/alerts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
// import { toast } from 'react-toastify';
const AddSubCategory = () => {
    const [subcategoryData, setSubcategoryData] = useState({
        categoryId: '',
        subcategoryName: '',
        description: '',
    });

    const [categories, setCategories] = useState([]); // State for categories
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchSubcategories();
        fetchCategories(); // Fetch categories
    }, []);

    const fetchSubcategories = async () => {
        try {
            const response = await get('http://192.168.29.120:8086/subcategory/all');
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            showAlert('error', 'Error', 'Failed to fetch subcategories.');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await get('http://192.168.29.120:8086/category/all'); // API for categories
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showAlert('error', 'Error', 'Failed to fetch categories.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategoryData({ ...subcategoryData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };
        if (name === 'subcategoryName') {
            if (!value) {
                newErrors.subcategoryName = 'Subcategory Name is required.';
            } else if (value.length < 3 || value.length > 50) {
                newErrors.subcategoryName = 'Subcategory Name must be between 3 and 50 characters.';
            } else {
                delete newErrors.subcategoryName;
            }
        }

        if (name === 'description') {
            if (!value) {
                newErrors.description = 'Description is required.';
            } else if (value.length < 10 || value.length > 200) {
                newErrors.description = 'Description must be between 10 and 200 characters.';
            } else {
                delete newErrors.description;
            }
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!subcategoryData.subcategoryName) {
            newErrors.subcategoryName = 'Subcategory Name is required.';
        } else if (subcategoryData.subcategoryName.length < 3 || subcategoryData.subcategoryName.length > 50) {
            newErrors.subcategoryName = 'Subcategory Name must be between 3 and 50 characters.';
        }

        if (!subcategoryData.description) {
            newErrors.description = 'Description is required.';
        } else if (subcategoryData.description.length < 10 || subcategoryData.description.length > 200) {
            newErrors.description = 'Description must be between 10 and 200 characters.';
        }

        if (!subcategoryData.categoryId) {
            newErrors.categoryId = 'Category is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
    
        try {
            const response = await post('http://192.168.29.120:8086/subcategory/create', {
                subcategoryName: subcategoryData.subcategoryName,
                description: subcategoryData.description,
                categoryId: subcategoryData.categoryId,
            });
    
            showAlert('success', 'Success', 'Subcategory added successfully!');
            fetchSubcategories();
            setSubcategoryData({ categoryId: '', subcategoryName: '', description: '' });
        } catch (error) {
            console.error('Add Subcategory Error:', error);
            showAlert('error', 'Error', 'Failed to add subcategory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubcategory = async (subcategoryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this subcategory?");
        if (confirmDelete) {
            try {
                await deleteRequest(`http://192.168.29.120:8086/subcategory/${subcategoryId}`);
                toast.success('Subcategory deleted successfully!');
                fetchSubcategories();
            } catch (error) {
                toast.error('Failed to delete subcategory. Please try again.');
            }
        }
    };

    const handleEditSubcategory = (subcategory) => {
        setSubcategoryData({
            categoryId: subcategory.categoryId,
            subcategoryName: subcategory.subcategoryName,
            description: subcategory.description
        });
        setModalOpen(true);
    };

    const handleUpdateSubcategory = async () => {
        setLoading(true);
        try {
            await put(`http://192.168.29.120:8086/subcategory/${subcategoryData.categoryId}`, subcategoryData);
            showAlert('success', 'Success', 'Subcategory updated successfully!');
            fetchSubcategories();
            setModalOpen(false);
            setSubcategoryData({ categoryId: '', subcategoryName: '', description: '' });
        } catch (error) {
            showAlert('error', 'Error', 'Failed to update subcategory.');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(subcategories.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = subcategories.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <h5>Add Subcategory</h5>
            <form onSubmit={handleAddSubcategory} className='mb-3'>
                <Row className="d-flex justify-content-center">
                    <Col md={3}>
                        <FormGroup>
                            <Label for="categoryId">Category</Label>
                            <Input
                                type="select"
                                name="categoryId"
                                value={subcategoryData.categoryId || ''}
                                onChange={handleChange}
                                invalid={!!errors.categoryId}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </Input>
                            {errors.categoryId && <FormFeedback>{errors.categoryId}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="subcategoryName">Subcategory Name</Label>
                            <Input
                                name="subcategoryName"
                                value={subcategoryData.subcategoryName || ''}
                                onChange={handleChange}
                                invalid={!!errors.subcategoryName}
                            />
                            {errors.subcategoryName && <FormFeedback>{errors.subcategoryName}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={subcategoryData.description || ''}
                                onChange={handleChange}
                                invalid={!!errors.description}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={3} className='d-flex justify-content-center align-items-center'>
                        <Button type="submit" color="primary" style={{ width: '80%' }} disabled={loading} className='mt-3'>
                            {loading ? 'Submitting...' : 'Add Subcategory'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <div className="card">
                <div className="card-header">
                    <h5 className='text-center'>Subcategory List</h5>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Subcategory Id</th>
                                {/* <th>Category Name</th> */}
                                <th>Subcategory Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((subcategory, index) => (
                                <tr key={index}>
                                    <td>{subcategory.subcategoryId}</td>
                                    {/* <td>{subcategory.categoryName}</td> */}
                                    <td>{subcategory.subcategoryName}</td>
                                    <td>{subcategory.description}</td>
                                    <td>
                                        <span onClick={() => handleEditSubcategory(subcategory)} className="edit-button me-3"><MdEditSquare /></span>
                                        <span onClick={() => handleDeleteSubcategory(subcategory.subcategoryId)} className='delete-button'><MdDelete /></span>
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
                        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Update Subcategory</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="categoryId">Category</Label>
                                <Input
                                    type="select"
                                    name="categoryId"
                                    value={subcategoryData.categoryId || ''}
                                    onChange={handleChange}
                                    invalid={!!errors.categoryId}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </Input>
                                {errors.categoryId && <FormFeedback>{errors.categoryId}</FormFeedback>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="subcategoryName">Subcategory Name</Label>
                                <Input
                                    name="subcategoryName"
                                    value={subcategoryData.subcategoryName || ''}
                                    onChange={handleChange}
                                    invalid={!!errors.subcategoryName}
                                />
                                {errors.subcategoryName && <FormFeedback>{errors.subcategoryName}</FormFeedback>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={subcategoryData.description || ''}
                                    onChange={handleChange}
                                    invalid={!!errors.description}
                                />
                                {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleUpdateSubcategory}>Update</Button>
                            <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                      <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default AddSubCategory;
