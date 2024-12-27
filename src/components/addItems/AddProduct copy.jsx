import React, { useState } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/addProduct.css';
import { post } from '../utils/api'; // Import reusable API logic
import showAlert from '../utils/alerts'; // Import the reusable toast utility
 
const AddProduct = () => {
    const [productData, setProductData] = useState({
        productName: '',
        category: '',
        subCategory: '',
        quantity: '',
        description: '',
        weight: '',
        pieces: '',
        availableQuantity: ''
    });
    const [productList, setProductList] = useState([
        'Chocolate Cake',
        'Vanilla Cake',
        'Strawberry Pastry',
        'Chocolate Pastry'
    ]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([
        { id: 'cake', name: 'Cake' },
        { id: 'pastry', name: 'Pastry' }
    ]);
    const [subCategories, setSubCategories] = useState({
        cake: ['Chocolate Cake', 'Vanilla Cake'],
        pastry: ['Strawberry Pastry', 'Chocolate Pastry']
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setProductData({ ...productData, category: selectedCategory, subCategory: '' });
    };

    const handleSubCategoryChange = (e) => {
        setProductData({ ...productData, subCategory: e.target.value });
    };

    const handleSearch = () => {
        const searchQuery = productData.productName.toLowerCase();
        const results = productList.filter((product) =>
            product.toLowerCase().includes(searchQuery)
        );
        setFilteredProducts(results);
    };

    const handleProductSelect = (product) => {
        setProductData({ ...productData, productName: product });
        setFilteredProducts([]); // Hide the dropdown list after selection
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before validation
    
        let validationErrors = {};
    
        // Perform validation for each field
        if (!productData.productName) validationErrors.productName = 'Product name is required';
        if (!productData.category) validationErrors.category = 'Category is required';
        if (!productData.subCategory) validationErrors.subCategory = 'Subcategory is required';
        if (!productData.quantity) validationErrors.quantity = 'Quantity is required';
        if (!productData.description) validationErrors.description = 'Description is required';
        if (!productData.weight) validationErrors.weight = 'Weight is required';
        if (!productData.pieces) validationErrors.pieces = 'Number of pieces is required';
        if (!productData.availableQuantity) validationErrors.availableQuantity = 'Available quantity is required';
    
        // If validation errors exist, update the errors state and show an error message
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill in all fields!');
            return;
        }
    
        // If no validation errors, proceed with form submission
        console.log('Product Added:', productData);
    
        // Show success alert using the showAlert function
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
            availableQuantity: ''
        });
    
        // Clear the filtered product list
        setFilteredProducts([]);
    };
    

    return (
        <div>
            <h5>Add Product</h5>
            <form onSubmit={handleSubmit}>
                <Row className="d-flex justify-content-center">
                    <Col md={6} className="mb-3">
                        <div className='productNameDropMain'>
                            <FormGroup>
                                <Label for="productName">Product Name</Label>
                                <div className="d-flex">
                                    <Input
                                        placeholder="Search for Product"
                                        aria-label="Search for Product"
                                        name="productName"
                                        value={productData.productName}
                                        onChange={handleChange}
                                        invalid={!!errors.productName}  // Trigger invalid feedback if there is an error
                                    />
                                    <button className='btn-primary' onClick={handleSearch}>Search</button>
                                </div>

                                {/* Render filtered product list as dropdown */}
                                {filteredProducts.length > 0 && (
                                    <ul className="product-dropdown-menu show p-0 m-0" style={{ width: '100%' }}>
                                        {filteredProducts.map((product, index) => (
                                            <li
                                                key={index}
                                                className="dropdown-item"
                                                onClick={() => handleProductSelect(product)}
                                            >
                                                {product}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Display the error message if there's an error */}
                                {errors.productName && (
                                    <FormFeedback className="d-block">
                                        {errors.productName}
                                    </FormFeedback>
                                )}
                            </FormGroup>
                        </div>
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
                                    <option key={category.id} value={category.id}>
                                        {category.name}
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
                                    <option key={subCategory} value={subCategory}>
                                        {subCategory}
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
            <ToastContainer />
        </div>
    );
};

export default AddProduct;
