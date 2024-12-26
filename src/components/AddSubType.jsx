import React, { useState, useEffect } from 'react'; 
import { Container, CardBody, Card, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

const textileProducts = [
    {
        name: 'T-Shirt',
        category: 'Clothing',
        subCategories: [
            { type: 'Color', options: ['Red', 'Blue', 'Green'] },
            { type: 'Material', options: ['Cotton', 'Polyester', 'Blended'] },
            { type: 'Brand', options: ['Brand A', 'Brand B', 'Brand C'] }
        ]
    },
    {
        name: 'Saree',
        category: 'Clothing',
        subCategories: [
            { type: 'Color', options: ['Yellow', 'Pink', 'Blue'] },
            { type: 'Material', options: ['Silk', 'Cotton', 'Georgette'] },
            { type: 'Brand', options: ['Brand D', 'Brand E', 'Brand F'] }
        ]
    },
    {
        name: 'Jeans',
        category: 'Clothing',
        subCategories: [
            { type: 'Color', options: ['Black', 'Blue', 'Grey'] },
            { type: 'Material', options: ['Denim', 'Corduroy', 'Stretch'] },
            { type: 'Brand', options: ['Brand X', 'Brand Y', 'Brand Z'] }
        ]
    },
    {
        name: 'Cap',
        category: 'Accessories',
        subCategories: [
            { type: 'Color', options: ['Black', 'White', 'Red'] },
            { type: 'Material', options: ['Cotton', 'Leather', 'Wool'] },
            { type: 'Brand', options: ['Brand G', 'Brand H', 'Brand I'] }
        ]
    },
    {
        name: 'Watch',
        category: 'Accessories',
        subCategories: [
            { type: 'Color', options: ['Silver', 'Gold', 'Black'] },
            { type: 'Material', options: ['Stainless Steel', 'Leather', 'Plastic'] },
            { type: 'Brand', options: ['Brand J', 'Brand K', 'Brand L'] }
        ]
    }
];

const AddSubType = () => {
    const [productData, setProductData] = useState({
        category: '',
        type: '',
        subTypeName: '',
    });

    const [productList, setProductList] = useState([]);
    const [errors, setErrors] = useState({});
    const [availableTypes, setAvailableTypes] = useState([]);

    useEffect(() => {
        if (productData.category) {
            const filteredProducts = textileProducts.filter(product => product.category === productData.category);
            const productTypes = filteredProducts.map(product => product.name);
            setAvailableTypes(productTypes);
            setProductData(prevData => ({
                ...prevData,
                type: ''
            }));
        } else {
            setAvailableTypes([]);
        }
    }, [productData.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!productData.category) newErrors.category = 'Category is required.';
        if (!productData.type) newErrors.type = 'Type is required.';
        if (!productData.subTypeName) newErrors.subTypeName = 'Sub Type Name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateSubTypeCode = () => {
        const code = `SUBTYPE${String(productList.length + 1).padStart(3, '0')}`;
        return code;
    };

    const handleAddSubType = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newSubType = {
            ...productData,
            subTypeCode: generateSubTypeCode(),
            id: Date.now(),
        };

        setProductList([...productList, newSubType]);
        setProductData({ category: '', type: '', subTypeName: '' });
        setErrors({});
    };

    return (
        <div c>
            <h5>Add Sub Type</h5>
            <form onSubmit={handleAddSubType}>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="category">Category</Label>


                            
                            <Input
                                type="select"
                                name="category"
                                value={productData.category}
                                onChange={handleChange}
                                invalid={!!errors.category} autoComplete="off" 
                            >
                                <option value="">Select Category</option>
                                {['Clothing', 'Accessories', 'Footwear'].map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Input>
                            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="type">Type</Label>
                            <Input
                                type="select"
                                name="type"
                                value={productData.type}
                                onChange={handleChange}
                                invalid={!!errors.type}
                                disabled={!productData.category}
                            >
                                <option value="">Select Type</option>
                                {availableTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Input>
                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subTypeName">Sub Type Name</Label>
                            <Input
                                type="text"
                                name="subTypeName"
                                value={productData.subTypeName}
                                onChange={handleChange}
                                invalid={!!errors.subTypeName}
                            />
                            {errors.subTypeName && <div className="invalid-feedback">{errors.subTypeName}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subTypeCode">Sub Type Code</Label>
                            <Input
                                type="text"
                                name="subTypeCode"
                                value={generateSubTypeCode()}
                                readOnly
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }}>Add Sub Type</Button>
                    </Col>
                </Row>
            </form>

            <div className="mt-4">
                <h5>Sub Type List</h5>
                {productList.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sub Type Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sub Type Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map((subType) => (
                                <tr key={subType.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{subType.category}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{subType.type}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{subType.subTypeName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{subType.subTypeCode}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddSubType;
