import React, { useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    paymentReceived: z.boolean().refine(v => v === true, 'You must confirm receipt'),
})

function PaymentReceivedConfirm({ onConfirmed }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    const [checked, setChecked] = useState(false)

    const onSubmit = (data) => {
        console.log('payment confirmed', data)
        if (typeof onConfirmed === 'function') onConfirmed()
    }

    return (
        <div className=" mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-playfair font-semibold mb-4">Confirm Payment Received</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm text-gray-600">Please confirm that you have received the payment from the bidder.</p>

                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input id="paymentReceived" type="checkbox" className="sr-only peer" {...register('paymentReceived', { onChange: (e) => setChecked(e.target.checked) })} />
                        <div className={`w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#FBBC04] peer-checked:after:translate-x-5 after:content-[''] after:inline-block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-sm transition-all`}></div>
                    </label>
                    <label htmlFor="paymentReceived" className="text-sm text-gray-800">I have received the payment</label>
                </div>

                {errors.paymentReceived && <p className="text-red-500 text-sm">{errors.paymentReceived.message}</p>}

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#FBBC04] text-white px-5 py-2 rounded-md">Confirm</button>
                </div>
            </form>
        </div>
    )
}

export default PaymentReceivedConfirm