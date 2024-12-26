

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Container, Row, Col, FormGroup, Label, Input, Button, InputGroup, InputGroupText } from 'reactstrap';
import { IoSearch } from 'react-icons/io5';


const textileProducts = [
    {
        name: 'T-Shirt',
        subCategories: [
            { type: 'Color', options: ['Red', 'Blue', 'Green'] },
            { type: 'Material', options: ['Cotton', 'Polyester', 'Blended'] },
            { type: 'Brand', options: ['Brand A', 'Brand B', 'Brand C'] }
        ]
    },
    {
        name: 'Saree',
        subCategories: [
            { type: 'Color', options: ['Yellow', 'Pink', 'Blue'] },
            { type: 'Material', options: ['Silk', 'Cotton', 'Georgette'] },
            { type: 'Brand', options: ['Brand D', 'Brand E', 'Brand F'] }
        ]
    },
    {
        name: 'Jeans',
        subCategories: [
            { type: 'Color', options: ['Dark Blue', 'Light Blue', 'Black'] },
            { type: 'Material', options: ['Denim', 'Stretch', 'Cotton'] },
            { type: 'Brand', options: ['Brand G', 'Brand H', 'Brand I'] }
        ]
    },
    {
        name: 'Jeans',
        subCategories: [
            { type: 'Color', options: ['Dark Blue', 'Light Blue', 'Black'] },
            { type: 'Material', options: ['Denim', 'Stretch', 'Cotton'] },
            { type: 'Brand', options: ['Brand G', 'Brand H', 'Brand I'] }
        ]
    },
    {
        name: 'Jeans',
        subCategories: [
            { type: 'Color', options: ['Dark Blue', 'Light Blue', 'Black'] },
            { type: 'Material', options: ['Denim', 'Stretch', 'Cotton'] },
            { type: 'Brand', options: ['Brand G', 'Brand H', 'Brand I'] }
        ]
    },
    {
        name: 'Jeans',
        subCategories: [
            { type: 'Color', options: ['Dark Blue', 'Light Blue', 'Black'] },
            { type: 'Material', options: ['Denim', 'Stretch', 'Cotton'] },
            { type: 'Brand', options: ['Brand G', 'Brand H', 'Brand I'] }
        ]
    },
    {
        name: 'Kurta',
        subCategories: [
            { type: 'Color', options: ['White', 'Black', 'Grey'] },
            { type: 'Material', options: ['Cotton', 'Linen', 'Silk'] },
            { type: 'Brand', options: ['Brand J', 'Brand K', 'Brand L'] }
        ]
    },
    {
        name: 'Dress',
        subCategories: [
            { type: 'Color', options: ['Red', 'Black', 'Blue'] },
            { type: 'Material', options: ['Silk', 'Cotton', 'Chiffon'] },
            { type: 'Brand', options: ['Brand M', 'Brand N', 'Brand O'] }
        ]
    },
    {
        name: 'Shirt',
        subCategories: [
            { type: 'Color', options: ['White', 'Blue', 'Grey'] },
            { type: 'Material', options: ['Cotton', 'Linen', 'Polyester'] },
            { type: 'Brand', options: ['Brand P', 'Brand Q', 'Brand R'] }
        ]
    },
    {
        name: 'Skirt',
        subCategories: [
            { type: 'Color', options: ['Pink', 'Black', 'White'] },
            { type: 'Material', options: ['Cotton', 'Denim', 'Silk'] },
            { type: 'Brand', options: ['Brand S', 'Brand T', 'Brand U'] }
        ]
    },
    {
        name: 'Blouse',
        subCategories: [
            { type: 'Color', options: ['Green', 'Blue', 'Red'] },
            { type: 'Material', options: ['Silk', 'Cotton', 'Satin'] },
            { type: 'Brand', options: ['Brand V', 'Brand W', 'Brand X'] }
        ]
    },
    {
        name: 'Shorts',
        subCategories: [
            { type: 'Color', options: ['Navy', 'Black', 'Beige'] },
            { type: 'Material', options: ['Denim', 'Cotton', 'Linen'] },
            { type: 'Brand', options: ['Brand Y', 'Brand Z', 'Brand AA'] }
        ]
    },
    {
        name: 'Coat',
        subCategories: [
            { type: 'Color', options: ['Brown', 'Black', 'Navy'] },
            { type: 'Material', options: ['Wool', 'Cotton', 'Polyester'] },
            { type: 'Brand', options: ['Brand AB', 'Brand AC', 'Brand AD'] }
        ]
    },
];
const AddProduct = () => {
    const [productData, setProductData] = useState({
      name: '',
      category: '',
      subCategory1: '',
      subCategory2: '',
      subCategory3: '',
      price: '',
      quantity: ''
    });
    const [productList, setProductList] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [availableSubcategories, setAvailableSubcategories] = useState({ color: [], material: [], brand: [] });
    const [errors, setErrors] = useState({});
    const [searchTriggered, setSearchTriggered] = useState(false); // Track if search was triggered
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProductData({ ...productData, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });  // Clear error on change
      }
    };
  
    const handleSearch = () => {
      const filtered = textileProducts.filter(product =>
        product.name.toLowerCase().includes(productData.name.toLowerCase())
      );
      setFilteredProducts(filtered);
      setSearchTriggered(true); // Mark that search was triggered
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };
  
    const handleSelectProduct = (productName) => {
      const selectedProduct = textileProducts.find(product => product.name === productName);
      if (selectedProduct) {
        setProductData({
          ...productData,
          name: selectedProduct.name,
          category: selectedProduct.name,
          subCategory1: '',
          subCategory2: '',
          subCategory3: ''
        });
        setAvailableSubcategories({
          color: selectedProduct.subCategories[0].options,
          material: selectedProduct.subCategories[1].options,
          brand: selectedProduct.subCategories[2].options
        });
        setFilteredProducts([]);
        setSearchTriggered(false); // Reset search trigger after selection
      }
    };
  
    const validateForm = () => {
      const newErrors = {};
      if (!productData.name) newErrors.name = 'Product name is required';
      if (!productData.category) newErrors.category = 'Category is required';
      if (!productData.subCategory1) newErrors.subCategory1 = 'Color is required';
      if (!productData.subCategory2) newErrors.subCategory2 = 'Material is required';
      if (!productData.subCategory3) newErrors.subCategory3 = 'Brand is required';
      if (!productData.price) newErrors.price = 'Price is required';
      else if (isNaN(productData.price) || productData.price <= 0) newErrors.price = 'Enter a valid price';
      if (!productData.quantity) newErrors.quantity = 'Quantity is required';
      else if (isNaN(productData.quantity) || productData.quantity <= 0) newErrors.quantity = 'Enter a valid quantity';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleAddProduct = (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      const qrData = `Product: ${productData.name}, Category: ${productData.category}, Color: ${productData.subCategory1}, Material: ${productData.subCategory2}, Brand: ${productData.subCategory3}, Price: ${productData.price}, Quantity: ${productData.quantity}`;
      const newProduct = { ...productData, id: Date.now(), qrData };
  
      setProductList([...productList, newProduct]);
      setProductData({ name: '', category: '', subCategory1: '', subCategory2: '', subCategory3: '', price: '', quantity: '' });
      setAvailableSubcategories({ color: [], material: [], brand: [] });
    };
    return (
        <div >
            <h5>Add Product</h5>
            <form onSubmit={handleAddProduct} className='addProductForm'>
                <Row className='d-flex justify-content-center'>
                <Col md={6}>
            <FormGroup>
              <Label for="name">Product Name</Label>
              <InputGroup>
                <Input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter product name"
                  invalid={!!errors.name}
                  autoComplete='off' className='productIp'
                />
                <InputGroupText onClick={handleSearch} style={{ cursor: 'pointer' }}>
                  <IoSearch />
                </InputGroupText>
              </InputGroup>
              {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              {searchTriggered && (
                <ul
                  style={{
                    listStyleType: 'none',
                    padding: '5px 10px',
                    position: 'relative',
                    backgroundColor: '#fff',
                 
                    border: '1px solid #ccc',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    width: '400px',
                  }} 
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <li
                        key={product.name}
                        onClick={() => handleSelectProduct(product.name)}
                        style={{ cursor: 'pointer', padding: '5px' }}
                      >
                        {product.name}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '5px' }}>No data found</li>
                  )}
                </ul>
              )}
            </FormGroup>
          </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subCategory1">Color</Label>
                            <Input
                                type="select"
                                name="subCategory1"
                                value={productData.subCategory1}
                                onChange={handleChange}
                                invalid={!!errors.subCategory1}
                                autoComplete='off'
                            >
                                <option value="">Select Color</option>
                                {availableSubcategories.color.map((color, index) => (
                                    <option key={index} value={color}>{color}</option>
                                ))}
                            </Input>
                            {errors.subCategory1 && <div className="invalid-feedback d-block">{errors.subCategory1}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subCategory2">Material</Label>
                            <Input
                                type="select"
                                name="subCategory2"
                                value={productData.subCategory2}
                                onChange={handleChange}
                                invalid={!!errors.subCategory2}
                            >
                                <option value="">Select Material</option>
                                {availableSubcategories.material.map((material, index) => (
                                    <option key={index} value={material}>{material}</option>
                                ))}
                            </Input>
                            {errors.subCategory2 && <div className="invalid-feedback d-block">{errors.subCategory2}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="subCategory3">Brand</Label>
                            <Input
                                type="select"
                                name="subCategory3"
                                value={productData.subCategory3}
                                onChange={handleChange}
                                invalid={!!errors.subCategory3}
                            >
                                <option value="">Select Brand</option>
                                {availableSubcategories.brand.map((brand, index) => (
                                    <option key={index} value={brand}>{brand}</option>
                                ))}
                            </Input>
                            {errors.subCategory3 && <div className="invalid-feedback d-block">{errors.subCategory3}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                type="text"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                placeholder="Enter product price"
                                invalid={!!errors.price}
                                autoComplete='off'
                            />
                            {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                        </FormGroup>
                    </Col>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input
                                type="text"
                                name="quantity"
                                value={productData.quantity}
                                onChange={handleChange}
                                placeholder="Enter product quantity"
                                invalid={!!errors.quantity}
                                autoComplete='off'
                            />
                            {errors.quantity && <div className="invalid-feedback d-block">{errors.quantity}</div>}
                        </FormGroup>
                    </Col>




                    <Col md={6} className='text-center'>
                        <Button type="submit" color="primary" style={{ width: '80%' }}>Add Product</Button>
                    </Col>
                </Row>
            </form>

            <div className='mt-4'>
                <h5>Product List</h5>
                {productList.length === 0 ? (
                    <p>No products added.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Color</th>
                                <th>Material</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.subCategory1}</td>
                                    <td>{product.subCategory2}</td>
                                    <td>{product.subCategory3}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <QRCodeCanvas value={product.qrData} size={50} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AddProduct;
