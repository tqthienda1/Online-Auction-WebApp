import React from 'react'
import z from "zod"
import { useForm } from "react-hook-form"
import {useState, useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    PaymentInvoice: z.instanceof(FileList).refine(files => files.length > 0, "Payment Invoice is required"),
    ShippingAddress: z.string().nonempty("Shipping Address is required"),
})

function PaymentAndShippingInfo({onUploaded}) {
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
    })
    const [selected, setSelected] = useState([])

    const onFiles = (e) => {
        const files = Array.from(e.target.files || [])
        setSelected(files)
    }

    const onSubmit = (data) => {
        console.log("Payment and Shipping Data:", data);
        if(typeof onUploaded === 'function') onUploaded()
    }

    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-semibold mb-4">Provide Payment Invoice & Shipping Address</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="PaymentInvoice">Payment Invoice</label>

                    <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-[#FBBC04]" htmlFor="PaymentInvoice">
                        <div className="flex-1">
                            <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                            <div className="text-xs text-gray-400">Accepted: PDF, JPG, PNG</div>
                        </div>
                    </label>

                    <input id="PaymentInvoice" type="file" accept="application/pdf,image/*" className="hidden" {...register('PaymentInvoice', { onChange: onFiles })} />

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

                    {errors.PaymentInvoice && <p className="text-red-500 text-sm mt-2">{errors.PaymentInvoice.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ShippingAddress">Shipping Address</label>
                    <input
                        id="ShippingAddress"
                        type="text"
                        placeholder="Enter your shipping address"
                        {...register('ShippingAddress')}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent"
                    />
                    {errors.ShippingAddress && <p className="text-red-500 text-sm mt-2">{errors.ShippingAddress.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#FBBC04] hover:brightness-95 text-white px-4 py-2 rounded-md">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default PaymentAndShippingInfo