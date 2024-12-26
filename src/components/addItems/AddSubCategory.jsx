import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { post } from '../utils/api'; // Import reusable API logic
import showAlert from '../utils/alerts'; // Import the reusable toast utility
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import TableComponent from '../utils/TableComponent'; // Import the reusable TableComponent

const AddSubCategory = () => {
    const [subcategoryData, setSubcategoryData] = useState({
        categoryId: '',  // Assuming categoryId refers to an existing category
        subcategoryName: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubcategories] = useState([]); // State to hold list of subcategories

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategoryData({ ...subcategoryData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        if (name === 'categoryId') {
            if (!value) {
                newErrors.categoryId = 'Category ID is required.';
            } else {
                delete newErrors.categoryId;
            }
        }

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

        if (!subcategoryData.categoryId) {
            newErrors.categoryId = 'Category ID is required.';
        }

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await post('/add-subcategory', subcategoryData);
            console.log('Subcategory added successfully:', response.data);
            showAlert('success', 'Success', 'Subcategory added successfully!');
            setSubcategories([...subcategories, subcategoryData]); // Add new subcategory to the list
            setSubcategoryData({ categoryId: '', subcategoryName: '', description: '' });
        } catch (error) {
            showAlert('error', 'Error', 'Failed to add subcategory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubCategory = (subcategory) => {
        // Handle the edit logic
        console.log('Editing subcategory:', subcategory);
    };

    const handleDeleteSubCategory = (subcategoryId) => {
        // Handle the delete logic
        console.log('Deleting subcategory with ID:', subcategoryId);
    };

    return (
        <div>
            <h5>Add Subcategory</h5>
            <form onSubmit={handleAddSubCategory}>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="categoryId">Category ID</Label>
                            <Input
                                name="categoryId"
                                value={subcategoryData.categoryId}
                                onChange={handleChange}
                                invalid={!!errors.categoryId}
                            />
                            {errors.categoryId && <FormFeedback>{errors.categoryId}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="subcategoryName">Subcategory Name</Label>
                            <Input
                                name="subcategoryName"
                                value={subcategoryData.subcategoryName}
                                onChange={handleChange}
                                invalid={!!errors.subcategoryName}
                            />
                            {errors.subcategoryName && <FormFeedback>{errors.subcategoryName}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                name="description"
                                value={subcategoryData.description}
                                onChange={handleChange}
                                invalid={!!errors.description}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Add Subcategory'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <h5 className="mt-4">Subcategory List</h5>
            <TableComponent
                headers={['Category Id', 'Sub Category Name', 'Description']}
                data={subcategories}
                renderActions={(subcategory) => (
                    <div>
                        <button onClick={() => handleEditSubCategory(subcategory)}>Edit</button>
                        <button onClick={() => handleDeleteSubCategory(subcategory.categoryId)}>Delete</button>
                    </div>
                )}
                itemsPerPage={10} // Optional: customize number of items per page
            />

            {/* Toast Container for notifications */}
            <ToastContainer />
        </div>
    );
};

export default AddSubCategory;
