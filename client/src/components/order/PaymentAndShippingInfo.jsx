import React from 'react'
import z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import {useState, useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    paymentInvoice: z.instanceof(FileList).refine(files => files.length > 0, "Payment Invoice is required"),
    shippingAddress: z.string().nonempty("Shipping Address is required"),
})

function PaymentAndShippingInfo({onUpdated, productID}) {
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
    })
    const [selected, setSelected] = useState([])

    const onFiles = (e) => {
        const files = Array.from(e.target.files || [])
        setSelected(files)
    }

    const onSubmit = (data) => {
  const form = new FormData();
  form.append("paymentInvoice", data.paymentInvoice[0]);
  form.append("shippingAddress", data.shippingAddress);

  console.log("Submitting to backend:", `/order/${productID}/buyerInfo`);

  axios.put(`http://localhost:3000/orders/${productID}/buyerInfo`, form, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
  .then(() => {
    if (typeof onUpdated === 'function') onUpdated();
  })
  .catch(console.error);
}


    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-semibold mb-4">Provide Payment Invoice & Shipping Address</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="paymentInvoice">Payment Invoice</label>

                    <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-[#FBBC04]" htmlFor="paymentInvoice">
                        <div className="flex-1">
                            <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                            <div className="text-xs text-gray-400">Accepted: JPG, PNG</div>
                        </div>
                    </label>

                    <input id="paymentInvoice" type="file" accept="application/pdf,image/*" className="hidden" {...register('paymentInvoice', { onChange: onFiles })} />

                    {selected.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {selected.map((f, i) => (
                                <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white border rounded flex items-center justify-center text-xs">F</div>
                                        <div className="text-sm truncate max-w-xs">{f.name}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{Math.round(f.size/1024)} KB</div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {errors.paymentInvoice && <p className="text-red-500 text-sm mt-2">{errors.paymentInvoice.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="shippingAddress">Shipping Address</label>
                    <input
                        id="shippingAddress"
                        type="text"
                        placeholder="Enter your shipping address"
                        {...register('shippingAddress')}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent"
                    />
                    {errors.shippingAddress && <p className="text-red-500 text-sm mt-2">{errors.shippingAddress.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#FBBC04] hover:brightness-95 text-white px-4 py-2 rounded-md">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default PaymentAndShippingInfo