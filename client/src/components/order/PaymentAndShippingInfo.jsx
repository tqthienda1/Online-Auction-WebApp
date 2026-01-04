import React, { useState, useEffect } from 'react'
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext"
import { http } from "@/lib/utils"

const schema = z.object({
    paymentInvoice: z.instanceof(FileList).refine(files => files.length > 0, "Payment Invoice is required"),
    shippingAddress: z.string().nonempty("Shipping Address is required"),
})

function PaymentAndShippingInfo({onUpdated, productID}) {
    const { user } = useAuth();
    const { register, handleSubmit, formState: {errors}, setValue } = useForm({
        resolver: zodResolver(schema),
    })
    const [selected, setSelected] = useState([])
    const [loadingAddress, setLoadingAddress] = useState(false)

    // Prefill shipping address: prefer AuthContext `user.data.address`, fallback to API
    useEffect(() => {
        if (!user?.data?.id) return;

        // If AuthContext already contains DB user data with address, use it immediately
        if (user.data?.address) {
            setValue("shippingAddress", user.data.address);
            return;
        }

        const fetchUserAddress = async () => {
            try {
                setLoadingAddress(true);
                const res = await http.get("/users/me");
                const addr = res?.data?.address || res?.data?.shippingAddress;
                if (addr) setValue("shippingAddress", addr);
            } catch (error) {
                console.error("Failed to fetch user address:", error);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchUserAddress();
    }, [user?.data?.id, user?.data?.address, setValue]);

    const onFiles = (e) => {
        const files = Array.from(e.target.files || [])
        setSelected(files)
    }

    const onSubmit = (data) => {
  const form = new FormData();
  form.append("paymentInvoice", data.paymentInvoice[0]);
  form.append("shippingAddress", data.shippingAddress);

    http.put(`/orders/${productID}/buyerInfo`, form, {
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
                        disabled={loadingAddress}
                        {...register('shippingAddress')}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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