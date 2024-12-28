import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/addProduct.css';
import showAlert from '../utils/alerts';
import ProductList from './ProductList';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        productName: '',
        category: '',
        subCategory: '',
        quantity: '',
        description: '',
        weight: '',
        pieces: '',
        availableQuantity: '',
        price: '', // Added price field
        totalPrice: '' // Added totalPrice field
    });
    const [categories, setCategories] = useState([]); // Will hold the fetched category data
    const [subCategories, setSubCategories] = useState({}); // Will map categoryId to subcategories
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch categories and subcategories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://192.168.29.120:8086/category/all');
                const data = await response.json();
                setCategories(data); // Set the categories based on the response
            } catch (error) {
                toast.error('Error fetching categories');
            }
        };

        const fetchSubCategories = async () => {
            try {
                const response = await fetch('http://192.168.29.120:8086/subcategory/all');
                const data = await response.json();
                const subCategoryMap = {};
                data.forEach(sub => {
                    if (!subCategoryMap[sub.categoryId]) {
                        subCategoryMap[sub.categoryId] = [];
                    }
                    subCategoryMap[sub.categoryId].push(sub);
                });
                setSubCategories(subCategoryMap); // Set the subcategories mapping by categoryId
            } catch (error) {
                toast.error('Error fetching subcategories');
            }
        };

        fetchCategories();
        fetchSubCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before validation
    
        let validationErrors = {};
        const trimmedQuantity = productData.quantity.trim();
        const trimmedAvailableQuantity = productData.availableQuantity.trim();
    
        // Validation checks
        if (!productData.productName) validationErrors.productName = 'Product name is required';
        if (!productData.category) validationErrors.category = 'Category is required';
        if (!productData.subCategory) validationErrors.subCategory = 'Subcategory is required';
        if (!trimmedQuantity) validationErrors.quantity = 'Quantity is required';
        if (!trimmedAvailableQuantity) validationErrors.availableQuantity = 'Available quantity is required';
        if (!productData.description) validationErrors.description = 'Description is required';
        if (!productData.weight) validationErrors.weight = 'Weight is required';
        if (!productData.pieces) validationErrors.pieces = 'Number of pieces is required';
        if (!productData.price) validationErrors.price = 'Price is required';
    
        // Calculate total price directly in handleSubmit to avoid issues with async state updates
        const totalPrice = parseFloat(productData.price) * parseInt(productData.quantity, 10);
        if (!totalPrice || isNaN(totalPrice)) validationErrors.totalPrice = 'Total price is required';
    
        // Show validation errors if any
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill in all fields!');
            return;
        }
    
        // Define weightMap
        const weightMap = {
            '500g': 500,
            '1kg': 1000,
            '2kg': 2000,
        };
    
        const productToAdd = {
            subcategoryId: productData.subCategory,
            categoryId: productData.category,
            productName: productData.productName,
            price: parseFloat(productData.price),
            totalPrice: totalPrice, // Ensure totalPrice is passed
            weight: weightMap[productData.weight] || 0,
            pieces: parseInt(productData.pieces, 10),
            description: productData.description,
            quantityAvailable: parseInt(productData.availableQuantity, 10),
        };
    
        try {
            const response = await fetch('http://192.168.29.120:8086/product/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd),
            });
    
            const textResponse = await response.text();
            try {
                const result = JSON.parse(textResponse);
                console.log('Backend Response:', result);
                if (response.ok) {
                    showAlert('success', 'Success', 'Product added successfully!');
                    setProductData({
                        productName: '',
                        category: '',
                        subCategory: '',
                        quantity: '',
                        description: '',
                        weight: '',
                        pieces: '',
                        availableQuantity: '',
                        price: '',
                        totalPrice: ''
                    });
                } else {
                    toast.error(result.message || 'Failed to add product');
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                console.error('Raw Response:', textResponse);
                toast.error('Server returned an invalid response');
            }
    
        } catch (error) {
            toast.error('Error submitting product');
            console.error('Error submitting product:', error);
        }
    };
    


    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setProductData(prevState => {
            const updatedData = {
                ...prevState,
                [name]: value.trim()
            };
    
            // Recalculate totalPrice if price or quantity changes
            if (name === 'price' || name === 'quantity') {
                const price = parseFloat(updatedData.price);
                const quantity = parseInt(updatedData.quantity, 10);
                if (!isNaN(price) && !isNaN(quantity)) {
                    updatedData.totalPrice = price * quantity;
                } else {
                    updatedData.totalPrice = '';
                }
            }
    
            return updatedData;
        });
    };
    
    

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setProductData({ ...productData, category: selectedCategory, subCategory: '' });
    };

    const handleSubCategoryChange = (e) => {
        setProductData({ ...productData, subCategory: e.target.value });
    };

    return (
        <div>
            <h5>Add Product</h5>
            <form onSubmit={handleSubmit} className='mb-3'>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <FormGroup>
                            <Label for="productName">Product Name</Label>
                            <Input
                                name="productName"
                                value={productData.productName}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.productName}
                            />
                            {errors.productName && <FormFeedback>{errors.productName}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="category">Category</Label>
                            <Input
                                type="select"
                                name="category"
                                value={productData.category}
                                onChange={handleCategoryChange}
                                invalid={!!errors.category}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </Input>
                            {errors.category && <FormFeedback>{errors.category}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subCategory">Sub Category</Label>
                            <Input
                                type="select"
                                name="subCategory"
                                value={productData.subCategory}
                                onChange={handleSubCategoryChange}
                                invalid={!!errors.subCategory}
                            >
                                <option value="">Select Sub Category</option>
                                {(subCategories[productData.category] || []).map((subCategory) => (
                                    <option key={subCategory.subcategoryId} value={subCategory.subcategoryId}>
                                        {subCategory.subcategoryName}
                                    </option>
                                ))}
                            </Input>
                            {errors.subCategory && <FormFeedback>{errors.subCategory}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="weight">Weight</Label>
                            <Input
                                type="select"
                                name="weight"
                                value={productData.weight}
                                onChange={handleChange}
                                invalid={!!errors.weight}
                            >
                                <option value="">Select Weight</option>
                                <option value="500g">500g</option>
                                <option value="1kg">1kg</option>
                                <option value="2kg">2kg</option>
                            </Input>
                            {errors.weight && <FormFeedback>{errors.weight}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="pieces">Pieces</Label>
                            <Input
                                name="pieces"
                                value={productData.pieces}
                                onChange={handleChange}
                                type="number"
                                invalid={!!errors.pieces}
                            />
                            {errors.pieces && <FormFeedback>{errors.pieces}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input
                                name="quantity"
                                value={productData.quantity}
                                onChange={handleChange}
                                type="number"
                                invalid={!!errors.quantity}
                            />
                            {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    {/* <Col md={6}>
                        <FormGroup>
                            <Label for="availableQuantity">Available Quantity</Label>
                            <Input
                                name="availableQuantity"
                                value={productData.availableQuantity}
                                onChange={handleChange}
                                type="number"
                                invalid={!!errors.availableQuantity}
                            />
                            {errors.availableQuantity && <FormFeedback>{errors.availableQuantity}</FormFeedback>}
                        </FormGroup>
                    </Col> */}

                    <Col md={6}>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                type="number"
                                invalid={!!errors.price}
                            />
                            {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    {/* <Col md={6}>
                        <FormGroup>
                            <Label for="totalPrice">Total Price</Label>
                            <Input
                                name="totalPrice"
                                value={productData.totalPrice}
                                onChange={handleChange}
                                type="text"
                                readOnly
                            />
                        </FormGroup>
                    </Col> */}
                    <Col md={6}>   
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.description}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <Button type="submit" color="primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <ToastContainer />
            <ProductList />
        </div>
    );
};

export default AddProduct;
