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
    <div className=" mx-auto px-4 sm:px-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-playfair font-semibold mb-1">Complete Your Purchase</h1>
            <p className="text-sm text-gray-600 mb-4">Review payment and delivery details below.</p>

            <div className="flex items-center gap-4 mb-4">
              <img src={null} alt="product image" className="w-24 h-24 object-cover rounded" />
              <div>
                <h2 className="font-medium">Product title</h2>
                <p className="text-sm text-gray-500">$57000 USD</p>
                <p className="text-sm text-gray-500">Seller: Long Ngo</p>
                <p className="text-sm text-gray-500">Rating: 8/10</p>
              </div>
            </div>
          </div>

          <div>
            <button className="px-4 py-2 bg-[#FBBC04] text-white rounded">Chat with Seller</button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <BuyerProgress />

        <div className="mt-6">
          {status === "Provide Payment Information" && (
            <PaymentAndShippingInfo />
          )}

          {status === "Confirm Delivery" && (
            <DeliveryComfirmation />
          )}

          {status === "Rate Seller" && (
            <Rating type="seller" />
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerPaymentPage