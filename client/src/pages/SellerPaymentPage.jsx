import PaymentReceivedConfirm from '../components/order/PaymentReceivedConfirm'
import ShippingInvoice from '../components/order/ShippingInvoice';
import CancelOrder from '../components/order/CancelOrder';
import Rating from '../components/order/Rating';
import SellerProgress from '../components/order/SellerProgress';
import ChatModal from '../components/order/ChatModal';
import React, { useState, useEffect } from 'react'
import { http as axios } from '../lib/utils'
import { useParams } from 'react-router-dom'

function SellerPaymentPage() {
    const { productID } = useParams();
    const [order, setOrder] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    // 1. Thêm trạng thái loading
    const [loading, setLoading] = useState(true);

    const mapStatusToStep = (status) => {
        switch (status) {
            case "CREATED": return 0;
            case "PROVIDEBUYERINFO": return 1;
            case "RECEIVEPAYMENT": return 2;
            case "UPDATESHIPPINGINVOICE": return 3;
            case "RECEIVEPRODUCT": return 4;
            case "RATING": return 5;
            default: return 0;
        }
    };

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`/orders/${productID}`);
            setOrder(res.data);
            // Cập nhật step ngay lập tức khi nhận data
            setCurrentStep(mapStatusToStep(res.data.status));
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            // 2. Tắt loading sau khi đã có dữ liệu chính xác
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [productID]);

    if (isCancelled) {
        return (
            <div className="mx-auto px-4 sm:px-6">
                <div className="mt-6">
                    <div className="mt-6 space-y-6">
                        <div className="mx-auto bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
                            <h2 className="text-xl font-playfair font-semibold mb-2 text-yellow-900">Order Cancelled</h2>
                            <p className="text-sm text-yellow-700 mb-4">This order has been cancelled. Please leave a rating for the buyer below.</p>
                        </div>
                        <Rating type="buyer" productID={productID} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto px-4 sm:px-6">
            {/* Header: Luôn hiển thị thông tin sản phẩm */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-2xl font-playfair font-semibold mb-1">Manage Your Sale</h1>
                        <p className="text-sm text-gray-600 mb-4">Manage the payment and shipping steps for your sold item.</p>

                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                                {order?.product?.image && (
                                    <img src={order.product.image} alt="product" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div>
                                <h2 className="font-medium">{order?.product?.name || "Loading..."}</h2>
                                <p className="text-sm text-gray-500">${order?.product?.price}</p>
                                <p className="text-sm text-gray-500">Buyer: {order?.buyer?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={() => setChatOpen(true)} className="px-4 py-2 bg-[#FBBC04] text-white rounded">
                            Chat with buyer
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {/* 3. Chỉ render Progress và Content khi đã fetch xong */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FBBC04] mb-4"></div>
                        <p className="text-gray-500 italic">Updating status...</p>
                    </div>
                ) : (
                    <>
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
                                    <PaymentReceivedConfirm productID={productID} onConfirmed={fetchOrder} />
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <CancelOrder onCancelled={() => setIsCancelled(true)} />
                                    <ShippingInvoice productID={productID} onUploaded={fetchOrder} />
                                </>
                            )}

                            {currentStep === 3 && (
                                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                    <p className="text-sm text-blue-800">Waiting for buyer to confirm product reception...</p>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <Rating type="buyer" productID={productID} onRated={fetchOrder} />
                            )}

                            {currentStep === 5 && (
                                <div className="bg-green-50 p-4 rounded border border-green-200">
                                    <p className="text-sm text-green-800">Order completed! Thank you for selling.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} counterpartyName="Buyer" />
        </div>
    )
}

export default SellerPaymentPage;