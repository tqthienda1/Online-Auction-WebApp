import React from 'react'
import {useState, useEffect} from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

function DeliveryComfirmation() {
    const schema = z.object({
        itemReceived: z.boolean().refine(val => val === true, "You must confirm receipt of the item"),
    });
    const {register, handleSubmit, formState: {errors}} = useForm({
                resolver: zodResolver(schema),
        })
        const [itemReceived, setItemReceived] = useState(false);

        const onSubmit = (data) => {
                console.log('delivery confirmed', data)
        }

    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-playfair font-semibold mb-3">Confirm Receipt of Item</h2>
            <p className="text-sm text-gray-600 mb-4">Please confirm if you have received the product.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input id="itemReceived" type="checkbox" className="sr-only peer" {...register('itemReceived', { onChange: (e) => setItemReceived(e.target.checked) })} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#FBBC04] peer-checked:after:translate-x-5 after:content-[''] after:inline-block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-sm transition-all"></div>
                    </label>
                    <label htmlFor="itemReceived" className="text-sm text-gray-800">I have received the item</label>
                </div>

                {errors.itemReceived && <p className="text-red-500 text-sm">{errors.itemReceived.message}</p>}

                <div className="flex justify-end">
                    <button type="submit" className="bg-[#FBBC04] text-white px-4 py-2 rounded-md">Confirm Delivery</button>
                </div>
            </form>
        </div>
    )
}

export default DeliveryComfirmation