import React from 'react'
import {useState, useEffect} from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
function ShippingInvoice() {
    const schema = z.object({
        ShippingInvoice: z.instanceof(FileList).refine(files => files.length > 0, "Shipping Invoice is required"),
    })
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
    })
  return (
    <>
        <form>
            <label>
                <input
                    type="file"
                    name="ShippingInvoice"
                    id="ShippingInvoice"
                    {...register("ShippingInvoice")}
                />
                Shipping Invoice
            </label>
            <span>{errors.ShippingInvoice? errors.ShippingInvoice.message : ""}</span>
            <button type="submit">Submit Shipping Invoice</button>
        </form>
    </>
  )
}

export default ShippingInvoice