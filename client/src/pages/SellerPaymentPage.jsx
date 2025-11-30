import PaymentReceivedConfirm from '../components/order/PaymentReceivedConfirm'
import ShippingInvoice from '../components/order/ShippingInvoice';
import CancelOrder from '../components/order/CancelOrder';
import Rating from '../components/order/Rating';
import SellerProgress from '../components/order/SellerProgress';
import React, { useState } from 'react'

function SellerPaymentPage() {
        // use state so we can change the current step at runtime
        const [currentStep, setCurrentStep] = useState(1);
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
                                                <button className="px-4 py-2 bg-[#FBBC04] text-white rounded">Chat with buyer</button>
                                        </div>
                                </div>
                        </div>

                        <div className="mt-6">
                                <SellerProgress currentStep={currentStep} />

                                <div className="mt-6 space-y-6">
                                        {currentStep === 1 && (
                                                <>
                                                <CancelOrder />
                                                <PaymentReceivedConfirm onConfirmed={() => setCurrentStep(2)} />
                                                </>
                                        )}

                                        {currentStep === 2 && (
                                        <>
                                                <CancelOrder />
                                                <ShippingInvoice onUploaded={() => setCurrentStep(3)} />
                                        </>
                                        )}

                                        {currentStep === 3 && (
                                                <Rating type="buyer" />
                                        )}
                                </div>
                        </div>
                </div>
        )
}

export default SellerPaymentPage