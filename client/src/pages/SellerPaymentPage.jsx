import PaymentReceivedConfirm from '@/components/order/PaymentReceivedConfirm'
import ShippingInvoice from '@/components/order/ShippingInvoice';
import CancelOrder from '@/components/order/CancelOrder';
import Rating from '@/components/order/Rating';
import SellerProgress from '@/pages/SellerProgress';
import React from 'react'

function SellerPaymentPage() {
    const status = "ShippingInvoice";
    return (
        <>
            <h1>Manage yout sale</h1>
            <button type="button">Chat with buyer</button>
            <div>
                <img src={null} alt="product image" />
                <h1>Product title</h1>
                <p>$57000 USD</p>
                <p>Buyer</p>
                <p>Long Ngo</p>
                <p>Rating: 8/10</p>
            </div>
            <SellerProgress/>
            {status === "ConfirmPayment" && (
                <>
                <CancelOrder/>
                <PaymentReceivedConfirm/>
                </>
            )}
            {status === "ShippingInvoice" && (
                <>
                <CancelOrder/>
                <ShippingInvoice/>
                </>
            )}
            {status === "Rating"   && (
               <Rating type="buyer"/>
            )}

        </>
    )
  
}

export default SellerPaymentPage