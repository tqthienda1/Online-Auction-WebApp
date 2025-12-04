import PaymentReceivedConfirm from '../components/order/PaymentReceivedConfirm'
import ShippingInvoice from '../components/order/ShippingInvoice';
import CancelOrder from '../components/order/CancelOrder';
import Rating from '../components/order/Rating';
import SellerProgress from '../components/order/SellerProgress';
import ChatModal from '../components/order/ChatModal';
import React, { useState } from 'react'

function SellerPaymentPage() {
   const [currentStep, setCurrentStep] = useState(1);
   const [isCancelled, setIsCancelled] = useState(false);
   const [chatOpen, setChatOpen] = useState(false);

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
                       <img src={null} alt="product image" className="w-24 h-24 object-cover rounded" />
                       <div>
                          <h2 className="font-medium">Product title</h2>
                          <p className="text-sm text-gray-500">$57000 USD</p>
                          <p className="text-sm text-gray-500">Buyer: Long Ngo</p>
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
              {currentStep === 1 && (
                <>
                <CancelOrder onCancelled={() => setIsCancelled(true)} />
                <PaymentReceivedConfirm onConfirmed={() => setCurrentStep(2)} />
                </>
              )}

              {currentStep === 2 && (
              <>
                <CancelOrder onCancelled={() => setIsCancelled(true)} />
                <ShippingInvoice onUploaded={() => setCurrentStep(3)} />
              </>
              )}

              {currentStep === 3 && (
                <Rating type="buyer" />
              )}
           </div>
         </div>

      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} counterpartyName="Buyer" />
     </div>
   )
}

export default SellerPaymentPage