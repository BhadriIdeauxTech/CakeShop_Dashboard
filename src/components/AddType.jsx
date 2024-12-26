import React, { useState } from 'react';
import {
    Container, CardBody, Card, Row, Col, FormGroup, Label, Input, Button, InputGroup, InputGroupText
} from 'reactstrap';
import { IoSearch } from 'react-icons/io5';

const AddType = () => {
    const [typeData, setTypeData] = useState({
        category: '',
        typeName: '',
        typeCode: '',
        categoryName: '',
        categoryCode: ''
    });

    const [typeList, setTypeList] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [showCategoryList, setShowCategoryList] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTypeData({ ...typeData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleCategorySearch = () => {
        const { category } = typeData;

        if (category) {
            const categories = ['T-Shirt', 'Saree', 'Jeans', 'Kurta', 'Dress'];
            const filtered = categories.filter(cat =>
                cat.toLowerCase().includes(category.toLowerCase())
            );
            setFilteredCategories(filtered);
            setShowCategoryList(true);
        } else {
            setFilteredCategories([]);
            setShowCategoryList(false);
        }
    };

    const handleSelectCategory = (category) => {
        setTypeData({
            ...typeData,
            category,
            categoryName: category,
            categoryCode: category.toUpperCase().slice(0, 3)
        });
        setFilteredCategories([]);
        setShowCategoryList(false);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!typeData.category) newErrors.category = 'Category is required.';
        if (!typeData.typeName) newErrors.typeName = 'Type Name is required.';
        if (!typeData.typeCode) newErrors.typeCode = 'Type Code is required.';
        if (!typeData.categoryName) newErrors.categoryName = 'Category Name is required.';
        if (!typeData.categoryCode) newErrors.categoryCode = 'Category Code is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddType = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newType = {
            ...typeData,
            id: Date.now(),
        };

        setTypeList([...typeList, newType]);
        setTypeData({
            category: '',
            typeName: '',
            typeCode: '',
            categoryName: '',
            categoryCode: ''
        });
        setErrors({});
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCategorySearch();
        }
    };

    return (
        <div>
            <h5>Add Type</h5>
            <form onSubmit={handleAddType} className='addTypeForm'>
                <Row className="d-flex justify-content-center">
                <Col md={4}>
                        <FormGroup>
                            <Label for="category">Category</Label>
                            <InputGroup>
                                <Input
                                    className='categorySearch'
                                    type="text"
                                    name="category"
                                    value={typeData.category}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    invalid={!!errors.category}
                                    autoComplete="off"
                                />
                                <InputGroupText onClick={handleCategorySearch} style={{ cursor: 'pointer' }}>
                                    <IoSearch />
                                </InputGroupText>
                            </InputGroup>
                            {showCategoryList && (
                                <ul
                                    style={{
                                        listStyleType: 'none',
                                        padding: '5px 10px',
                                        position: 'absolute',
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        width: '400px'
                                    }}
                                >
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSelectCategory(category)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {category}
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ padding: '8px', color: '#888' }}>
                                            No data found
                                        </li>
                                    )}
                                </ul>
                            )}
                            {errors.category && (
                                <div className="invalid-feedback d-block" style={{ color: 'red', marginTop: '5px' }}>
                                    {errors.category}
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="categoryName">Category Name</Label>
                            <Input
                                type="text"
                                placeholder='Select Category'
                                name="categoryName"
                                value={typeData.categoryName}
                                onChange={handleChange}
                                invalid={!!errors.categoryName}
                                readOnly
                            />
                            {errors.categoryName && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.categoryName}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="categoryCode">Category Code</Label>
                            <Input
                                type="text"
                                name="categoryCode"
                                value={typeData.categoryCode}
                                onChange={handleChange}
                                invalid={!!errors.categoryCode}
                                readOnly
                            />
                            {errors.categoryCode && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.categoryCode}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="typeName">Type Name</Label>
                            <Input
                                type="text"
                                name="typeName"
                                value={typeData.typeName}
                                onChange={handleChange}
                                invalid={!!errors.typeName}
                            />
                            {errors.typeName && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.typeName}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="typeCode">Type Code</Label>
                            <Input
                                type="text"
                                name="typeCode"
                                value={typeData.typeCode}
                                onChange={handleChange}
                                invalid={!!errors.typeCode}
                            />
                            {errors.typeCode && <div className="invalid-feedback" style={{ color: 'red' }}>{errors.typeCode}</div>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }}>
                            Add Type
                        </Button>
                    </Col>
                </Row>
            </form>

            <div className="mt-4">
                <h5>Added Types</h5>
                {typeList.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type Code</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeList.map((type) => (
                                <tr key={type.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{type.category}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{type.typeName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{type.typeCode}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{type.categoryName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{type.categoryCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddType;
