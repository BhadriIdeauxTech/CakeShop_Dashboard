import React, { useState } from 'react';
import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        categoryName: '',
        categoryCode: ''
    });

    const [categoryList, setCategoryList] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!categoryData.categoryName) newErrors.categoryName = 'Category Name is required.';
        if (!categoryData.categoryCode) newErrors.categoryCode = 'Category Code is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newCategory = {
            ...categoryData,
            id: Date.now()
        };

        setCategoryList([...categoryList, newCategory]);
        setCategoryData({ categoryName: '', categoryCode: '' });
        setErrors({});
    };

    return (
        <div>
            <h5>Add Category</h5>
            <form onSubmit={handleAddCategory}>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="categoryName">Category Name</Label>
                            <Input
                                name="categoryName"
                                value={categoryData.categoryName}
                                onChange={handleChange}
                                invalid={!!errors.categoryName}
                            />
                            {errors.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="categoryCode">Category Code</Label>
                            <Input
                                name="categoryCode"
                                value={categoryData.categoryCode}
                                onChange={handleChange}
                                invalid={!!errors.categoryCode}
                            />
                            {errors.categoryCode && <div className="invalid-feedback">{errors.categoryCode}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }}>Add Category</Button>
                    </Col>
                </Row>
            </form>

            <div className="mt-4">
                <h5>Category List</h5>
                {categoryList.length === 0 ? (
                    <p>No categories available</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th >Category Name</th>
                                <th >Category Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryList.map(category => (
                                <tr key={category.id}>
                                    <td >{category.categoryName}</td>
                                    <td >{category.categoryCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddCategory;
