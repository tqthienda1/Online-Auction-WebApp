import React from 'react'
import { useState, useEffect } from 'react'
import { http as axios } from '../lib/utils'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PaymentAndShippingInfo from '../components/order/PaymentAndShippingInfo'
import DeliveryConfirmation from '../components/order/DeliveryComfirmation'
import Rating from '../components/order/Rating'
import BuyerProgress from '../components/order/BuyerProgress'
import ChatModal from '../components/order/ChatModal'


const BuyerPaymentPage = () => {
  const { productID } = useParams();
  const { user: authUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // 1. Thêm state loading
  const [loading, setLoading] = useState(true);

  const mapStatusToStep = (status) => {
    switch (status) {
      case "CREATED": return 1;
      case "PROVIDEBUYERINFO": return 2;
      case "RECEIVEPAYMENT": return 3;
      case "UPDATESHIPPINGINVOICE": return 4;
      case "RECEIVEPRODUCT": return 5;
      case "RATING": return 6;
      case "CANCELORDER": return 6;
      default: return 1;
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${productID}`);
      setOrder(res.data);
      setCurrentStep(mapStatusToStep(res.data.status));
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [productID]);

  // Redirect if the logged-in user is not the buyer for this order
  useEffect(() => {
    if (loading || authLoading || !order) return;

    if (!authUser) {
      navigate('/login', { replace: true });
      return;
    }

    const currentUserId = authUser.data?.id || authUser.id;
    if (currentUserId !== order?.buyer?.id) {
      navigate('/', { replace: true });
    }
  }, [loading, authLoading, order, authUser, navigate]);

  return (
    <div className="mx-auto px-4 sm:px-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-playfair font-semibold mb-1">Complete Your Purchase</h1>
            <p className="text-sm text-gray-600 mb-4">Review payment and delivery details below.</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                {order?.product?.productAvt ? (
                  <img src={order.product.productAvt} alt="product" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div>
                <h2 className="font-medium">{order?.product?.productName || "Loading..."}</h2>
                <p className="text-sm text-gray-500">${order?.product?.currentPrice}</p>
                <p className="text-sm text-gray-500">Seller: {order?.seller?.username}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => order && setChatOpen(true)}
            disabled={loading || !order}
            className={`px-4 py-2 rounded ${loading || !order ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#FBBC04] text-white'}`}>
            Chat with Seller
          </button>
        </div>
      </div>

      {/* PHẦN DƯỚI: Xử lý Loading để tránh nhảy Status */}
      <div className="mt-6">
        {loading ? (
          // Hiệu ứng Loading (Skeleton hoặc Spinner)
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBBC04]"></div>
            <p className="text-gray-500 animate-pulse">Updating order status...</p>
          </div>
        ) : (
          // 3. Chỉ hiện Progress và Nội dung khi đã load xong data
          <>
            <BuyerProgress currentStep={currentStep} />
            
            <div className="mt-6">
              {currentStep === 1 && (
                <PaymentAndShippingInfo productID={productID} onUpdated={fetchOrder} />
              )}

              {currentStep === 2 && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">Waiting for seller to confirm payment reception...</p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">Waiting for seller to upload shipping invoice...</p>
                </div>
              )}

              {currentStep === 4 && (
                <DeliveryConfirmation productID={productID} onConfirmed={fetchOrder} />
              )}

              {currentStep === 5 && (
                <Rating type="seller" productID={productID} onRated={fetchOrder} />
              )}

              {currentStep === 6 && (
              <div className="space-y-6">
                  {order?.status === "CANCELORDER" ? (
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-800 font-medium">
                            This order was cancelled by the seller. You can still rate the seller below.
                        </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                        <p className="text-sm text-green-800 font-medium">
                            Order completed! You can update your rating for the seller anytime.
                        </p>
                    </div>
                  )}
                  <Rating type="seller" productID={productID} onRated={fetchOrder} />
              </div>
              )}
            </div>
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} productID={productID} counterpartyName="Seller" meID={order?.buyer?.id} order={order}/>

          </>
        )}
      </div>

    </div>
  );
};

export default BuyerPaymentPage;
