import React from 'react'

function CancelOrder() {
  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-playfair font-semibold mb-2">Cancel Order</h2>
      <p className="text-sm text-gray-600 mb-4">You can cancel this order anytime if the buyer did not pay on schedule.</p>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">Cancel Order</button>
      </div>
    </div>
  )
}

export default CancelOrder