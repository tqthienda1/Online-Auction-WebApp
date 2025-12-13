import React from 'react'
import { useState, useEffect } from 'react'
import { http as axios } from '../lib/utils'
import { useParams } from 'react-router-dom'
import PaymentAndShippingInfo from '../components/order/PaymentAndShippingInfo'
import DeliveryConfirmation from '../components/order/DeliveryComfirmation'
import Rating from '../components/order/Rating'
import BuyerProgress from '../components/order/BuyerProgress'
import ChatModal from '../components/order/ChatModal'

const BuyerPaymentPage = () => {
  const { productID } = useParams();
  const [order, setOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // mapping status → step
  const mapStatusToStep = (status) => {
    switch (status) {
      case "CREATED":
        return 1;
      case "PROVIDEBUYERINFO":
        return 2;
      case "RECEIVEPRODUCT":
        return 3;
      case "RATING":
        return 4;
      default:
        return 1;
    }
  };

  // function refetch order
  const fetchOrder = async () => {
    const res = await axios.get(`/orders/${productID}`);
    setOrder(res.data);
  };

  // fetch order chạy 1 lần khi load trang
  useEffect(() => {
    fetchOrder();
  }, [productID]);

  // update currentStep khi order thay đổi
  useEffect(() => {
    if (order) {
      setCurrentStep(mapStatusToStep(order.status));
    }
  }, [order]);

  return (
    <div className="mx-auto px-4 sm:px-6">

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-playfair font-semibold mb-1">Complete Your Purchase</h1>
            <p className="text-sm text-gray-600 mb-4">Review payment and delivery details below.</p>

            <div className="flex items-center gap-4 mb-4">
              <img src={order?.product?.image || null} alt="product" className="w-24 h-24 object-cover rounded" />
              <div>
                <h2 className="font-medium">{order?.product?.name}</h2>
                <p className="text-sm text-gray-500">${order?.product?.price}</p>
                <p className="text-sm text-gray-500">Seller: {order?.seller?.name}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setChatOpen(true)}
            className="px-4 py-2 bg-[#FBBC04] text-white rounded"
          >
            Chat with Seller
          </button>
        </div>
      </div>

      <div className="mt-6">
        <BuyerProgress currentStep={currentStep} />

        <div className="mt-6">

          {currentStep === 1 && (
            <PaymentAndShippingInfo
              productID={productID}
              onUpdated={fetchOrder}    // CHỈ refetch, không setStep
            />
          )}

          {currentStep === 2 && (
            <DeliveryConfirmation
              productID={productID}
              onConfirmed={fetchOrder}  
            />
          )}

          {currentStep === 3 && (
            <Rating
              type="seller"
              productID={productID}
              onRated={fetchOrder}      
            />
          )}

        </div>
      </div>

      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} counterpartyName="Seller" />
    </div>
  );
};

export default BuyerPaymentPage;
