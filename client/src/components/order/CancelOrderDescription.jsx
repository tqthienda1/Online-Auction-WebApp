import React from 'react'
import z from zodResolver
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({
    CancelOrderDescription: z.string().nonempty("Description is required"),
})
function CancelOrderDescription() {
  return (
    <>
        <form>
            <label></label>
        </form>
    </>
  )
}

export default CancelOrderDescription