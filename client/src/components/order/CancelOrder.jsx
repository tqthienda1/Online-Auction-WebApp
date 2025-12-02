import React from 'react'
import { useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  cancelReason: z.string().min(10, 'Reason must be at least 10 characters'),
})

function CancelOrder({ onCancelled }) {
  const [showReason, setShowReason] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log('order cancelled with reason:', data)
    if (typeof onCancelled === 'function') onCancelled()
  }

  if (showReason) {
    return (
      <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-playfair font-semibold mb-3">Cancel Order Reason</h2>
        <p className="text-sm text-gray-600 mb-4">Please explain why you are cancelling this order.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cancelReason">
              Reason for Cancellation
            </label>
            <textarea
              id="cancelReason"
              placeholder="Enter the reason for cancelling..."
              {...register('cancelReason')}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm h-24 resize-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
            {errors.cancelReason && <p className="text-red-500 text-sm mt-1">{errors.cancelReason.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReason(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-playfair font-semibold mb-2">Cancel Order</h2>
      <p className="text-sm text-gray-600 mb-4">You can cancel this order anytime if the buyer did not pay on schedule.</p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowReason(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Cancel Order
        </button>
      </div>
    </div>
  )
}

export default CancelOrder