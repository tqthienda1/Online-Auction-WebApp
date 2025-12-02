import React, { useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    shippingInvoice: z.instanceof(FileList).refine(files => files.length > 0, 'Shipping invoice is required'),
})

function ShippingInvoice({ onUploaded }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    const [selected, setSelected] = useState([])

    const onFiles = (e) => {
        const files = Array.from(e.target.files || [])
        setSelected(files)
    }

    const onSubmit = (data) => {
        console.log('shipping submitted', data)
        // submit logic here
        if (typeof onUploaded === 'function') onUploaded()
    }

    return (
        <div className=" mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-playfair font-semibold mb-4">Upload Shipping Invoice</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Shipping Invoice</label>

                    <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-accent" htmlFor="shippingInvoice">
                        <div className="flex-1">
                            <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                            <div className="text-xs text-gray-400">Accepted: PDF, JPG, PNG</div>
                        </div>
                    </label>

                    <input id="shippingInvoice" type="file" accept="application/pdf,image/*" className="hidden" {...register('shippingInvoice', { onChange: onFiles })} />

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

                    {errors.shippingInvoice && <p className="text-red-500 text-sm mt-2">{errors.shippingInvoice.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#FBBC04] hover:brightness-95 text-white px-4 py-2 rounded-md">Submit Shipping Invoice</button>
                </div>
            </form>
        </div>
    )
}

export default ShippingInvoice