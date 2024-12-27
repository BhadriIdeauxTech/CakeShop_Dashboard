import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/addProduct.css';
import { post } from '../utils/api'; // Import reusable API logic
import showAlert from '../utils/alerts'; // Import the reusable toast utility

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value.trim() // Trim the value before setting it in the state
        });

        // Calculate totalPrice whenever price or quantity changes
        if (name === 'price' || name === 'quantity') {
            const totalPrice = productData.price * productData.quantity;
            setProductData(prevState => ({
                ...prevState,
                totalPrice
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setProductData({ ...productData, category: selectedCategory, subCategory: '' });
    };

    const handleSubCategoryChange = (e) => {
        setProductData({ ...productData, subCategory: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before validation
    
        let validationErrors = {};
    
        // Trim the quantity before validating
        const trimmedQuantity = productData.quantity.trim();
        const trimmedAvailableQuantity = productData.availableQuantity.trim(); // Ensure availableQuantity is trimmed
    
        // Perform validation for each field
        if (!productData.productName) validationErrors.productName = 'Product name is required';
        if (!productData.category) validationErrors.category = 'Category is required';
        if (!productData.subCategory) validationErrors.subCategory = 'Subcategory is required';
        if (!trimmedQuantity) validationErrors.quantity = 'Quantity is required';  // Trimmed check
        if (!trimmedAvailableQuantity) validationErrors.availableQuantity = 'Available quantity is required'; // Validation check for availableQuantity
        if (!productData.description) validationErrors.description = 'Description is required';
        if (!productData.weight) validationErrors.weight = 'Weight is required';
        if (!productData.pieces) validationErrors.pieces = 'Number of pieces is required';
        if (!productData.price) validationErrors.price = 'Price is required'; // Validation for price
        if (!productData.totalPrice) validationErrors.totalPrice = 'Total price is required'; // Validation for totalPrice
    
        // If validation errors exist, update the errors state and show an error message
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill in all fields!');
            return;
        }
    
        // Prepare the product data to be sent
        const productToAdd = {
            subcategoryId: productData.subCategory, // Subcategory selected
            categoryId: productData.category, // Category selected
            productName: productData.productName,
            price: productData.price, // Convert price to number
            totalPrice:productData.totalPrice, // Convert totalPrice to number
            weight: productData.weight, // Convert weight to number
            pieces:productData.pieces, // Convert pieces to number
            description: productData.description,
            quantityAvailable: productData.availableQuantity, // Convert availableQuantity to number
        };
    
        try {
            // Send the data to the backend
            const response = await fetch('http://192.168.29.120:8086/product/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd), // Convert the product data to JSON
            });
    
            const result = await response.json();
    
            if (response.ok) {
                // Show success alert
                showAlert('success', 'Success', 'Product added successfully!');
    
                // Reset form fields
                setProductData({
                    productName: '',
                    category: '',
                    subCategory: '',
                    quantity: '',
                    description: '',
                    weight: '',
                    pieces: '',
                    availableQuantity: '',
                    price: '', // Reset price
                    totalPrice: '' // Reset totalPrice
                });
            } else {
                // Handle backend error
                toast.error(result.message || 'Failed to add product');
            }
        } catch (error) {
            // Handle network or other errors
            toast.error('Error submitting product');
        }
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
                                type="text"
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
                                type="text"
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
                                type="text"
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

                    <Col md={6}>
                        <FormGroup>
                            <Label for="totalPrice">Total Price</Label>
                            <Input
                                name="totalPrice"
                                value={productData.totalPrice}
                                disabled
                                type="number"
                            />
                        </FormGroup>
                    </Col>

                    <Col md={12}>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="textarea"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                invalid={!!errors.description}
                            />
                            {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
                        </FormGroup>
                    </Col>

                    <Col md={6} className="text-center">
                        <Button type="submit" color="primary" style={{ width: '80%' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Add Product'}
                        </Button>
                    </Col>
                </Row>
            </form>
            <ProductList />
            <ToastContainer />
        </div>
    );
};

export default AddProduct;
