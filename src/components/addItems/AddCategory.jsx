 
import React, { useState, useEffect } from 'react'; 
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { get, post, put } from '../utils/api';
import { deleteRequest } from '../utils/api';
import showAlert from '../utils/alerts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        categoryId: '',
        categoryName: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await get('http://192.168.29.120:8086/category/all');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showAlert('error', 'Error', 'Failed to fetch categories.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };
        if (name === 'categoryName') {
            if (!value) {
                newErrors.categoryName = 'Category Name is required.';
            } else if (value.length < 3 || value.length > 50) {
                newErrors.categoryName = 'Category Name must be between 3 and 50 characters.';
            } else {
                delete newErrors.categoryName;
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

        if (!categoryData.categoryName) {
            newErrors.categoryName = 'Category Name is required.';
        } else if (categoryData.categoryName.length < 3 || categoryData.categoryName.length > 50) {
            newErrors.categoryName = 'Category Name must be between 3 and 50 characters.';
        }

        if (!categoryData.description) {
            newErrors.description = 'Description is required.';
        } else if (categoryData.description.length < 10 || categoryData.description.length > 200) {
            newErrors.description = 'Description must be between 10 and 200 characters.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await post('http://192.168.29.120:8086/category/create', {
                categoryName: categoryData.categoryName,
                description: categoryData.description,
            });

            toast.success('Category added successfully!');
            fetchCategories();
            setCategoryData({ categoryId: '', categoryName: '', description: '' });
        } catch (error) {
            console.error('Add Category Error:', error);
            toast.error('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (confirmDelete) {
            try {
                await deleteRequest(`http://192.168.29.120:8086/category/${categoryId}`);
                toast.success('Category deleted successfully!');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category. Please try again.');
            }
        }
    };

    const handleEditCategory = (category) => {
        setCategoryData({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            description: category.description
        });
        setModalOpen(true);
    };

    const handleUpdateCategory = async () => {
        setLoading(true);
        try {
            await put(`http://192.168.29.120:8086/category/${categoryData.categoryId}`, categoryData);
            showAlert('success', 'Success', 'Category updated successfully!');
            fetchCategories();
            setModalOpen(false);
            setCategoryData({ categoryId: '', categoryName: '', description: '' });
        } catch (error) {
            showAlert('error', 'Error', 'Failed to update category.');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = categories.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div>
            <h5>Add Category</h5>
            <form onSubmit={handleAddCategory} className='mb-3'>
                <Row className="d-flex justify-content-center">
                    <Col md={5}>
                        <FormGroup>
                            <Label for="categoryName">Category Name</Label>
                            <Input
                                name="categoryName"
                                value={categoryData.categoryName || ''}
                                onChange={handleChange}
                                invalid={!!errors.categoryName}
                                disabled={categoryData.categoryId}
                            />
                            {errors.categoryName && <FormFeedback>{errors.categoryName}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={categoryData.description || ''}
                                onChange={handleChange}
                                invalid={!!errors.description}
                                disabled={categoryData.categoryId}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={2} className='d-flex justify-content-center align-items-center'>
                        <Button type="submit" color="primary" style={{ width: '80%' }} disabled={loading} className='mt-3'>
                            {loading ? 'Submitting...' : 'Add Category'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <div className="card">
                <div className="card-header  ">
                    <h5 className='text-center mb-0'>Category List</h5>

                </div>


                <div className="table-responsive  ">
                    <table className="table mb-0 ">
                        <thead>
                            <tr>
                                <th>Category Id</th>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((category, index) => (
                                <tr key={index}>
                                    <td>{category.categoryId}</td>
                                    <td>{category.categoryName}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <span onClick={() => handleEditCategory(category)} className="edit-button me-3"><MdEditSquare />  </span>
                                        <span onClick={() => handleDeleteCategory(category.categoryId)} className='delete-button'><MdDelete />  </span>
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
                        <ModalHeader toggle={() => setModalOpen(false)}>Edit Category</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="categoryName">Category Name</Label>
                                <Input
                                    name="categoryName"
                                    value={categoryData.categoryName}
                                    onChange={handleChange}
                                    invalid={!!errors.categoryName}
                                />
                                {errors.categoryName && <FormFeedback>{errors.categoryName}</FormFeedback>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={categoryData.description}
                                    onChange={handleChange}
                                    invalid={!!errors.description}
                                />
                                {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={handleUpdateCategory}>Update Category</Button>
                            <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
