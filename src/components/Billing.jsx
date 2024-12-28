import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { get, post } from './utils/api';
import showAlert from './utils/alerts';

const BillingPage = () => {
    const [billingData, setBillingData] = useState({
        customerName: '',
        totalDiscount: '',
        paymentMethod: '',
    });

    const [products, setProducts] = useState([]); // State for products
    const [paymentMethods] = useState(['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer']); // Payment methods
    const [rows, setRows] = useState([{
        productId: '',
        quantity: 0,
        weight: 0,
        price: 0
    }]); // State for multiple rows

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts(); // Fetch products
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await get('http://192.168.29.120:8086/product/all');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showAlert('error', 'Error', 'Failed to fetch products.');
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
        validateField(name, value, index);
    };

    const validateField = (name, value, index) => {
        const newErrors = { ...errors };
        if (name === 'quantity' || name === 'weight' || name === 'price') {
            if (value <= 0) {
                newErrors[`${name}${index}`] = `${name.charAt(0).toUpperCase() + name.slice(1)} must be greater than 0.`;
            } else {
                delete newErrors[`${name}${index}`];
            }
        }
        setErrors(newErrors);
    };

    const handleAddRow = () => {
        setRows([...rows, { productId: '', quantity: 0, weight: 0, price: 0 }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const validateForm = () => {
        const newErrors = {};
        rows.forEach((row, index) => {
            if (!row.productId) newErrors[`productId${index}`] = 'Product is required.';
            if (row.quantity <= 0) newErrors[`quantity${index}`] = 'Quantity must be greater than 0.';
            if (row.weight <= 0) newErrors[`weight${index}`] = 'Weight must be greater than 0.';
            if (row.price <= 0) newErrors[`price${index}`] = 'Price must be greater than 0.';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const response = await post('http://192.168.29.120:8086/billing/create', {
                customerName: billingData.customerName,
                totalDiscount: billingData.totalDiscount,
                paymentMethod: billingData.paymentMethod,
                products: rows
            });

            showAlert('success', 'Success', 'Billing record added successfully!');
            setBillingData({
                customerName: '',
                totalDiscount: '',
                paymentMethod: '',
            });
            setRows([{
                productId: '',
                quantity: 0,
                weight: 0,
                price: 0
            }]); // Reset rows after successful submit
        } catch (error) {
            console.error('Billing Error:', error);
            showAlert('error', 'Error', 'Failed to add billing record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h5>Add Billing</h5>
            <form onSubmit={handleSubmit} className="mb-3">
                <Row className="d-flex justify-content-center">
                    <Col md={12}>
                        <FormGroup>
                            <Label for="customerName">Customer Name</Label>
                            <Input
                                name="customerName"
                                value={billingData.customerName || ''}
                                onChange={(e) => setBillingData({ ...billingData, [e.target.name]: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <div className="row px-0 mx-0">
                        <div className="col-6"><h5>Add Product</h5></div>
                        <div className="col-6 text-end">
                            <Button color="success" onClick={handleAddRow}>Add Product  </Button>
                        </div>
                    </div>
                    {rows.map((row, index) => (
    <Row key={index} className="px-0 mx-0">
        <Col md={3}>
            <FormGroup>
                <Label for={`productId${index}`}>Product</Label>
                <Input
                    type="select"
                    name="productId"
                    value={row.productId || ''}
                    onChange={(e) => handleChange(e, index)}
                    invalid={!!errors[`productId${index}`]}
                >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                            {product.productName}
                        </option>
                    ))}
                </Input>
                {errors[`productId${index}`] && <FormFeedback>{errors[`productId${index}`]}</FormFeedback>}
            </FormGroup>
        </Col>
        <Col md={3}>
            <FormGroup>
                <Label for={`quantity${index}`}>Quantity</Label>
                <Input
                    type="number"
                    name="quantity"
                    value={row.quantity || ''}
                    onChange={(e) => handleChange(e, index)}
                    invalid={!!errors[`quantity${index}`]}
                />
                {errors[`quantity${index}`] && <FormFeedback>{errors[`quantity${index}`]}</FormFeedback>}
            </FormGroup>
        </Col>
        <Col md={3}>
            <FormGroup>
                <Label for={`weight${index}`}>Weight</Label>
                <Input
                    type="number"
                    name="weight"
                    value={row.weight || ''}
                    onChange={(e) => handleChange(e, index)}
                    invalid={!!errors[`weight${index}`]}
                />
                {errors[`weight${index}`] && <FormFeedback>{errors[`weight${index}`]}</FormFeedback>}
            </FormGroup>
        </Col>
        <Col md="auto">
            <FormGroup>
                <Label for={`price${index}`}>Price</Label>
                <Input
                    type="number"
                    name="price"
                    value={row.price || ''}
                    onChange={(e) => handleChange(e, index)}
                    invalid={!!errors[`price${index}`]}
                />
                {errors[`price${index}`] && <FormFeedback>{errors[`price${index}`]}</FormFeedback>}
            </FormGroup>
        </Col>
        <Col md="auto" className="d-flex justify-content-center align-items-center">
            {rows.length > 1 && (
                <Button color="danger" onClick={() => handleRemoveRow(index)}>-</Button>
            )}
        </Col>
    </Row>
))}


                    <Col md={12} className="d-flex justify-content-center">
                        <Button type="submit" color="primary" className="mt-3" disabled={loading}>
                            {loading ? 'Submitting...' : 'Add Billing'}
                        </Button>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default BillingPage;
