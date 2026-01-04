import React, { useState } from 'react'
import { http } from '@/lib/utils'

function CancelOrder({ productID, onCancelled }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCancel = async () => {
    try {
      setLoading(true)
      setError(null)
      // call server to cancel order; server will auto-submit -1 rating for buyer
      await http.delete(`/orders/${productID}`)
      if (typeof onCancelled === 'function') onCancelled()
    } catch (err) {
      console.error('Cancel order failed', err)
      setError(err?.response?.data?.message || 'Cancel failed')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-playfair font-semibold mb-2">Cancel Order</h2>
      <p className="text-sm text-gray-600 mb-4">You can cancel this order if the buyer did not pay on schedule. Cancelling will automatically submit a -1 rating for the buyer.</p>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {!confirming ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Cancel Order
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CancelOrder