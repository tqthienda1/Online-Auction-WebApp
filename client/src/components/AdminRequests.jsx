import React from "react";

const AdminRequests = ({
  upgradeRequests,
  approveDialog,
  setApproveDialog,
  onConfirmApprove,
  onReject,
}) => {
  return (
    <div className="border-l-4 border-l-amber-500 border bg-amber-50 p-5 rounded-lg">
      <h2 className="mb-4 font-semibold text-gray-900">
        Upgrade to Seller Requests ({upgradeRequests.length})
      </h2>

      <div className="space-y-3">
        {upgradeRequests.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border p-3 bg-white"
          >
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span>{user.email}</span>
                <span>•</span>
                <span>Rating: {user.rating}/5</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setApproveDialog(user.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center gap-2"
              >
                ✓ Aprrove
              </button>

              <button
                onClick={() => onReject(user.id)}
                className="border px-3 py-1 rounded hover:bg-gray-100 text-sm"
              >
                ✕ Reject
              </button>
            </div>

            {approveDialog === user.id && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Confirm Upgrade to Seller
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to upgrade <b>{user.name}</b> to
                    Seller? Seller rights will expire after 7 days.
                  </p>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setApproveDialog(null)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => onConfirmApprove(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm Approval
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRequests;
