import React from 'react'
import { useState } from 'react'
import PaymentAndShippingInfo from '../components/order/PaymentAndShippingInfo'
import DeliveryComfirmation from '../components/order/DeliveryComfirmation'
import Rating from '../components/order/Rating'
import BuyerProgress from '../components/order/BuyerProgress'

//create status array: provide information, confirm delivery, rate
//let status = ["Provide Payment Information", "Confirm Delivery", "Rate Seller"]
//let status = "Provide Payment Information"; 
const BuyerPaymentPage = () => {
  const status = "Rate Seller";
  return (
    <>  
        <h1>Complete Your Purchase</h1>
        <button type="button">Chat with Seller</button>
        <div>
            <img src={null} alt="product image" />
            <h1>Product title</h1>
            <p>$57000 USD</p>
            <p>Seller</p>
            <p>Long Ngo</p>
            <p>Rating: 8/10</p>
        </div>
    <BuyerProgress/>
    {status === "Provide Payment Information" && (
        <PaymentAndShippingInfo/>
    )}

    {status == "Confirm Delivery" && (  
       <DeliveryComfirmation/>
      
    )}
    {status == "Rate Seller" && (
        <Rating type="seller"/>
    )}
    </>

  )
}

export default BuyerPaymentPage