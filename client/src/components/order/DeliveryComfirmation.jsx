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
  return (

    <>
    <div></div>
    <h1>Confirm Receipt of Item</h1>
    <form>
        <p>Please confirm if you have received the product</p>
        <label htmlFor="itemReceived">
            <input 
                type="checkbox"
                id="itemReceived"
                name="itemReceived"
                {...register("itemReceived")}
                onChange={(e) => setItemReceived(e.target.checked)}
            />
            I have received the item
        </label>
        <span>{errors.itemReceived? errors.itemReceived.message : ""}</span>
        <button type="submit">Confirm Delivery</button>
    </form>
    </>
  )
}

export default DeliveryComfirmation