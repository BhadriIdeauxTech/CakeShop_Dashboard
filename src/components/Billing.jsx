import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import '../../styles/addProduct.css';
import { post } from './utils/api'; // Import reusable API logic
import showAlert from './utils/alerts'; // Import the  reusable toast utility
 
const Billing = () => {
    const [billingData, setBillingData] = useState({
        customerName: '',
        productName: '',
        pricePerItem: '',
        quantity: '',
        weight: '',
        pieces: '',
        description: '',
        subtotal: 0,
        totalDiscount: '',
        totalTax: '',
        shippingCharges: '',
        grandTotal: 0,
        paymentMethod: '',
        dateOfPurchase: new Date().toLocaleDateString() // Automatic current date
    });

    const [productList, setProductList] = useState([
        { name: 'Chocolate Cake', price: 200, description: 'Delicious chocolate cake' },
        { name: 'Vanilla Cake', price: 180, description: 'Tasty vanilla cake' },
        { name: 'Strawberry Pastry', price: 150, description: 'Fresh strawberry pastry' },
        { name: 'Chocolate Pastry', price: 160, description: 'Yummy chocolate pastry' }
    ]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillingData({ ...billingData, [name]: value });
    };

    const handleSearch = () => {
        const searchQuery = billingData.productName.toLowerCase();
        const results = productList.filter((product) =>
            product.name.toLowerCase().includes(searchQuery)
        );
        setFilteredProducts(results);
    };

    const handleProductSelect = (product) => {
        setBillingData({
            ...billingData,
            productName: product.name,
            pricePerItem: product.price,
            description: product.description,
            weight: '', // Reset weight field
            pieces: '', // Reset pieces field
        });
        setFilteredProducts([]); // Hide the dropdown list after selection
        calculateSubtotal(product.price); // Calculate the subtotal automatically
    };

    const handleWeightOrPiecesChange = (e) => {
        const { name, value } = e.target;
        setBillingData({ ...billingData, [name]: value });
    };

    const calculateSubtotal = (price) => {
        const quantity = parseInt(billingData.quantity) || 0;
        const subtotal = price * quantity;
        setBillingData((prevData) => ({
            ...prevData,
            subtotal: subtotal,
            grandTotal: calculateGrandTotal(subtotal),
        }));
    };

    const calculateGrandTotal = (subtotal) => {
        const discount = parseFloat(billingData.totalDiscount) || 0;
        const tax = parseFloat(billingData.totalTax) || 0;
        const shipping = parseFloat(billingData.shippingCharges) || 0;
        return subtotal - discount + tax + shipping;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before validation
    
        let validationErrors = {};
    
        // Perform validation for each field
        if (!billingData.customerName) validationErrors.customerName = 'Customer name is required';
        if (!billingData.productName) validationErrors.productName = 'Product name is required';
        if (!billingData.quantity) validationErrors.quantity = 'Quantity is required';
        if (!billingData.weight && !billingData.pieces) validationErrors.weight = 'Either weight or pieces is required';
        if (!billingData.totalDiscount) validationErrors.totalDiscount = 'Discount is required';
        if (!billingData.totalTax) validationErrors.totalTax = 'Tax is required';
        if (!billingData.shippingCharges) validationErrors.shippingCharges = 'Shipping charges are required';
        if (!billingData.paymentMethod) validationErrors.paymentMethod = 'Payment method is required';
    
        // If validation errors exist, update the errors state and show an error message
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill in all fields!');
            return;
        }
    
        // If no validation errors, proceed with form submission
        console.log('Billing Details:', billingData);
    
        // Show success alert using the showAlert function
        showAlert('success', 'Success', 'Billing details submitted successfully!');
    
        // Reset form fields
        setBillingData({
            customerName: '',
            productName: '',
            pricePerItem: '',
            quantity: '',
            weight: '',
            pieces: '',
            description: '',
            subtotal: 0,
            totalDiscount: '',
            totalTax: '',
            shippingCharges: '',
            grandTotal: 0,
            paymentMethod: '',
            dateOfPurchase: new Date().toLocaleDateString()
        });

        setFilteredProducts([]);
    };

    return (
        <div>
            <h5>Billing Page</h5>
            <form onSubmit={handleSubmit}>
                <Row className="d-flex justify-content-center">
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="customerName">Customer Name</Label>
                            <Input
                                name="customerName"
                                value={billingData.customerName}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.customerName}
                            />
                            {errors.customerName && <FormFeedback>{errors.customerName}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <div className='productNameDropMain'>
                            <FormGroup>
                                <Label for="productName">Product Name</Label>
                                <div className="d-flex">
                                    <Input
                                        placeholder="Search for Product"
                                        aria-label="Search for Product"
                                        name="productName"
                                        value={billingData.productName}
                                        onChange={handleChange}
                                        invalid={!!errors.productName}
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
                                                {product.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.productName && <FormFeedback>{errors.productName}</FormFeedback>}
                            </FormGroup>
                        </div>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input
                                name="quantity"
                                value={billingData.quantity}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.quantity}
                            />
                            {errors.quantity && <FormFeedback>{errors.quantity}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="weight">Weight</Label>
                            <Input
                                type="select"
                                name="weight"
                                value={billingData.weight}
                                onChange={handleWeightOrPiecesChange}
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
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="pieces">Pieces</Label>
                            <Input
                                name="pieces"
                                value={billingData.pieces}
                                onChange={handleWeightOrPiecesChange}
                                type="text"
                                invalid={!!errors.pieces}
                            />
                            {errors.pieces && <FormFeedback>{errors.pieces}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="totalDiscount">Total Discount</Label>
                            <Input
                                name="totalDiscount"
                                value={billingData.totalDiscount}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.totalDiscount}
                            />
                            {errors.totalDiscount && <FormFeedback>{errors.totalDiscount}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="totalTax">Total Tax</Label>
                            <Input
                                name="totalTax"
                                value={billingData.totalTax}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.totalTax}
                            />
                            {errors.totalTax && <FormFeedback>{errors.totalTax}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="shippingCharges">Shipping Charges</Label>
                            <Input
                                name="shippingCharges"
                                value={billingData.shippingCharges}
                                onChange={handleChange}
                                type="text"
                                invalid={!!errors.shippingCharges}
                            />
                            {errors.shippingCharges && <FormFeedback>{errors.shippingCharges}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="paymentMethod">Payment Method</Label>
                            <Input
                                type="select"
                                name="paymentMethod"
                                value={billingData.paymentMethod}
                                onChange={handleChange}
                                invalid={!!errors.paymentMethod}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Cash">Cash</option>
                            </Input>
                            {errors.paymentMethod && <FormFeedback>{errors.paymentMethod}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={6} className="mb-3">
                        <FormGroup>
                            <Label for="grandTotal">Grand Total</Label>
                            <Input
                                name="grandTotal"
                                value={billingData.grandTotal}
                                type="text"
                                disabled
                            />
                        </FormGroup>
                    </Col>
                    <Col md={12} className="d-flex justify-content-center">
                        <Button type="submit" color="primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Col>
                </Row>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Billing;
