import PaymentReceivedConfirm from '../components/order/PaymentReceivedConfirm'
import ShippingInvoice from '../components/order/ShippingInvoice';
import CancelOrder from '../components/order/CancelOrder';
import Rating from '../components/order/Rating';
import SellerProgress from '../components/order/SellerProgress';
import ChatModal from '../components/order/ChatModal';
import React, { useState, useEffect } from 'react'
import { http as axios } from '../lib/utils'
import {useParams} from 'react-router-dom'
function SellerPaymentPage() {
  const { productID } = useParams();
  const [order, setOrder] = useState(null);
   const [currentStep, setCurrentStep] = useState(1);
   const [isCancelled, setIsCancelled] = useState(false);
   const [chatOpen, setChatOpen] = useState(false);
  const mapStatusToStep = (status) => {
      switch (status) {
      case "CREATED":
        return 0; // seller waiting for buyer to provide info
      case "PROVIDEBUYERINFO":
        return 1; // seller confirms payment
      case "RECEIVEPAYMENT":
        return 2; // seller uploads shipping invoice
      case "UPDATESHIPPINGINVOICE":
        return 3; // seller waiting for buyer to confirm receipt
      case "RECEIVEPRODUCT":
        return 4; // seller rates buyer
      case "RATING":
        return 5; // order completed
      default:
        return 0;
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


   if (isCancelled) {
      return (
        <div className=" mx-auto px-4 sm:px-6">

           <div className="mt-6">
              <div className="mt-6 space-y-6">
                <div className="mx-auto bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
                        <h2 className="text-xl font-playfair font-semibold mb-2 text-yellow-900">Order Cancelled</h2>
                        <p className="text-sm text-yellow-700 mb-4">This order has been cancelled. Please leave a rating for the buyer below.</p>
                </div>
                <Rating type="buyer" />
              </div>
           </div>
        </div>
      )
   }

   return (
     <div className=" mx-auto px-4 sm:px-6">
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <div className="flex items-start justify-between gap-6">
               <div className="flex-1">
                   <h1 className="text-2xl font-playfair font-semibold mb-1">Manage Your Sale</h1>
                   <p className="text-sm text-gray-600 mb-4">Manage the payment and shipping steps for your sold item.</p>

                   <div className="flex items-center gap-4">
                       <img src={order?.product?.image || null} alt="product" className="w-24 h-24 object-cover rounded" />
                       <div>
                          <h2 className="font-medium">{order?.product?.name}</h2>
                          <p className="text-sm text-gray-500">${order?.product?.price}</p>
                          <p className="text-sm text-gray-500">Buyer: {order?.buyer?.name}</p>
                          <p className="text-sm text-gray-500">Rating: 8/10</p>
                       </div>
                   </div>
               </div>

               <div>
                       <button onClick={() => setChatOpen(true)} className="px-4 py-2 bg-[#FBBC04] text-white rounded">Chat with buyer</button>
               </div>
           </div>
         </div>

         <div className="mt-6">
           <SellerProgress currentStep={currentStep} />

           <div className="mt-6 space-y-6">
              {currentStep === 0 && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">Waiting for buyer to provide payment information...</p>
                </div>
              )}

              {currentStep === 1 && (
                <>
                <CancelOrder onCancelled={() => setIsCancelled(true)} />
                <PaymentReceivedConfirm 
                productID={productID}
                onConfirmed={fetchOrder} />
                </>
              )}

              {currentStep === 2 && (
              <>
                <CancelOrder onCancelled={() => setIsCancelled(true)} />
                <ShippingInvoice 
                productID={productID}
                onUploaded={fetchOrder} />
              </>
              )}

              {currentStep === 3 && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">Waiting for buyer to confirm product reception...</p>
                </div>
              )}

              {currentStep === 4 && (
                <Rating type="buyer"
                productID={productID}
                onRated={fetchOrder} />
              )}

              {currentStep === 5 && (
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <p className="text-sm text-green-800">Order completed! Thank you for selling.</p>
                </div>
              )}
           </div>
         </div>

      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} counterpartyName="Buyer" />
     </div>
   )
}

export default SellerPaymentPage