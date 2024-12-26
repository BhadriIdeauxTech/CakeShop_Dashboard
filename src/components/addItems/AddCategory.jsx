import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { post } from '../utils/api'; // Import reusable API logic
import showAlert from '../utils/alerts'; // Import the reusable toast utility
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import TableComponent from '../utils/TableComponent'; // Import the reusable TableComponent

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        categoryId: '',
        categoryName: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]); // State to hold list of categories

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'categoryId') {
            if (!value) {
                newErrors.categoryId = 'Category ID is required.';
            } else if (value.length < 3 || value.length > 10) {
                newErrors.categoryId = 'Category ID must be between 3 and 10 characters.';
            } else {
                delete newErrors.categoryId;
            }
        }

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

        if (!categoryData.categoryId) {
            newErrors.categoryId = 'Category ID is required.';
        } else if (categoryData.categoryId.length < 3 || categoryData.categoryId.length > 10) {
            newErrors.categoryId = 'Category ID must be between 3 and 10 characters.';
        }

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
            const response = await post('/add-category', categoryData);
            console.log('Category added successfully:', response.data);
            showAlert('success', 'Success', 'Category added successfully!');
            setCategories([...categories, categoryData]); // Add new category to the list
            setCategoryData({ categoryId: '', categoryName: '', description: '' });
        } catch (error) {
            showAlert('error', 'Error', 'Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        // Handle the edit logic
        console.log('Editing category:', category);
    };

    const handleDeleteCategory = (categoryId) => {
        // Handle the delete logic
        console.log('Deleting category with ID:', categoryId);
    };

    return (
        <div>
            <h5>Add Category</h5>
            <form onSubmit={handleAddCategory}>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="categoryId">Category ID</Label>
                            <Input
                                name="categoryId"
                                value={categoryData.categoryId}
                                onChange={handleChange}
                                invalid={!!errors.categoryId}
                            />
                            {errors.categoryId && <FormFeedback>{errors.categoryId}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
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
                    </Col>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                name="description"
                                value={categoryData.description}
                                onChange={handleChange}
                                invalid={!!errors.description}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Add Category'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <h5 className="mt-4">Category List</h5>
            <TableComponent
                headers={['Category Id', 'Category Name', 'Description']}
                data={categories}
                renderActions={(category) => (
                    <div>
                        <button onClick={() => handleEditCategory(category)}>Edit</button>
                        <button onClick={() => handleDeleteCategory(category.categoryId)}>Delete</button>
                    </div>
                )}
                itemsPerPage={10} // Optional: customize number of items per page
            />

            {/* Toast Container for notifications */}
            <ToastContainer />
        </div>
    );
};

export default AddCategory;
