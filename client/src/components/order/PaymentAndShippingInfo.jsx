import React from 'react'
import z from "zod"
import { useForm } from "react-hook-form"
import {useState, useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    PaymentInvoice: z.instanceof(FileList).refine(files => files.length > 0, "Payment Invoice is required"),
    ShippingAddress: z.string().nonempty("Shipping Address is required"),
})

function PaymentAndShippingInfo() {
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
    })
    const onSubmit = (data) => {
        console.log("Payment and Shipping Data:", data);
    }

  return (
    <>
    <div></div>
    <div>
        <h1>Provide Payment Invoice & Shipping Address</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="PaymentInvoice">Payment Invoice</label>
                <input 
                    type="file" 
                    id="PaymentInvoice" 
                    name="PaymentInvoice"
                    {...register("PaymentInvoice")} 
                />
            </div>
            <span>{errors.PaymentInvoice? errors.PaymentInvoice.message : ""}</span>
            <div>
                <label htmlFor="ShippingAddress">Shipping Address</label>
                <input 
                    type="text"
                    id="ShippingAddress"
                    name="ShippingAddress"
                    placeholder="Enter your shipping address"
                    {...register("ShippingAddress")}
                />
            </div>
            <span>{errors.ShippingAddress? errors.ShippingAddress.message : ""}</span>
            <button type="submit">Submit</button>
        </form>

    </div>
    </>
  )
}

export default PaymentAndShippingInfo