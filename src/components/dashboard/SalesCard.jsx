import React, { useState, useEffect } from 'react';
import { BsFileBarGraphFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import '../../styles/saleCard.css';
import { RiProductHuntLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BiSolidCartAlt } from "react-icons/bi";
import { MdCurrencyRupee } from "react-icons/md";

const SalesCard = () => {
    // State to store the incremented numbers
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [productSold, setProductSold] = useState(0);
    const [newCustomers, setNewCustomers] = useState(0);

    // Effect for auto-incrementing the numbers
    useEffect(() => {
        // Function to increment numbers
        const incrementNumber = (target, setter) => {
            let current = 0;
            const interval = setInterval(() => {
                current += Math.floor(target / 100);  // Increment by a fraction of the target value
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                setter(current);
            }, 10); // Adjust the speed by changing the interval time (ms)
        };

        incrementNumber(500000, setTotalSales);
        incrementNumber(5112, setTotalOrders);
        incrementNumber(1000, setProductSold);
        incrementNumber(103, setNewCustomers);
    }, []);

    return (
        <div className="salesCardMain row g-3">    

            <h5 className='mb-1'>Today Sales </h5>
            <p className='my-0'>Sales Summary </p>

            <div className="col-lg-3">
                <div className="saleCard">
                    <div className="salesIcon">        
                        <MdCurrencyRupee />
                    </div>
                    <div className="totalAmount py-1">
                        {totalSales.toLocaleString()}  {/* Display with commas */}
                    </div>
                    <p className='totolSaleText mb-0'>Total Sales</p>
                    <p className="percentageSale"> +10% from Yesterday</p>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="saleCard orange">
                    <div className="salesIcon">            
                        <BiSolidCartAlt />
                    </div>
                    <div className="totalAmount py-1">
                        {totalOrders}
                    </div>
                    <p className='totolSaleText mb-0'>Total Orders</p>
                    <p className="percentageSale"> +12% from Yesterday</p>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="saleCard green">
                    <div className="salesIcon">            
                        <RiProductHuntLine /> 
                    </div>
                    <div className="totalAmount py-1">
                        {productSold}
                    </div>
                    <p className='totolSaleText mb-0'>Product Sold</p>
                    <p className="percentageSale"> +15% from Yesterday</p>
                </div>
            </div>

            <div className="col-lg-3">
                <div className="saleCard purple">
                    <div className="salesIcon">           
                        <FaUser />
                    </div>
                    <div className="totalAmount py-1">
                        {newCustomers}
                    </div>
                    <p className='totolSaleText mb-0'> New Customers</p>
                    <p className="percentageSale"> +7% from Yesterday</p>
                </div>
            </div>

        </div>
    );
}

export default SalesCard;
