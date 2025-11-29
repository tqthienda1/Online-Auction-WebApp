import React from 'react'
import {useState, useEffect} from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

function PaymentReceivedConfirm() {
    const schema = z.object({
            itemReceived: z.boolean().refine(val => val === true, "You must confirm receipt of the item"),
        });
    const {register, handleSubmit, formState: {errors}} = useForm({
            resolver: zodResolver(schema),
        })
    const [paymentReceived, setPaymentReceived] = useState(false);
  return (
    <>
    {/* Payment Invoice from buyer */}
    <div></div>

    
    <form>
        <p>Please confirm if you have received payment from bidder</p>
        <label htmlFor="paymentReceived">
        <input
            type="checkbox"
            id="paymentReceived"
            name="paymentReceived"
            {...register("paymentReceived")}
            onChange={(e) => setPaymentReceived(e.target.checked)}
        />
        </label>
        <span>{errors.paymentReceived? errors.paymentReceived.message: ""}</span>
        <button type="submit">Confirm Payment Received</button>
    </form>
    </>
  )
}

export default PaymentReceivedConfirm