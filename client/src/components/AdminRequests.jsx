import React from "react";
import { Loader2 } from "lucide-react"; // Nếu không có lucide-react, bạn có thể thay bằng text "..."

const AdminRequests = ({
  upgradeRequests,
  dialog,
  setDialog,
  onConfirmApprove,
  onConfirmReject,
  isProcessing, // Nhận thêm prop xử lý loading
}) => {
  // Tìm thông tin user hiện tại đang được chọn trong dialog
  const currentUser = upgradeRequests.find((r) => r.id === dialog.userId);

  return (
    <div className="border-l-4 border-l-amber-500 border bg-amber-50 p-5 rounded-lg">
      <h2 className="mb-4 font-semibold text-gray-900">
        Upgrade to Seller Requests ({upgradeRequests.length})
      </h2>

      <div className="space-y-3">
        {upgradeRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending upgrade requests</p>
        ) : (
          upgradeRequests.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-3 bg-white"
            >
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>Rating: {user.ratingPos} positive · {user.ratingNeg} negative</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={isProcessing} // Chặn click khi đang xử lý
                  onClick={() => setDialog({ type: "approve", userId: user.id })}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  ✓ Approve
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => setDialog({ type: "reject", userId: user.id })}
                  className="border px-3 py-1 rounded hover:bg-gray-100 text-sm disabled:opacity-50"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approve Dialog */}
      {dialog.type === "approve" && currentUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Upgrade to Seller</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to upgrade <b>{currentUser.name}</b> to Seller? Seller rights will expire after 7 days.
            </p>

            <div className="flex gap-2 justify-end">
              <button
                disabled={isProcessing}
                onClick={() => setDialog({ type: null, userId: null })}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={isProcessing} // KHÓA NÚT CHÍNH
                onClick={() => onConfirmApprove(currentUser.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Approval"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {dialog.type === "reject" && currentUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Reject Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject the upgrade request for <b>{currentUser.name}</b>?
            </p>

            <div className="flex gap-2 justify-end">
              <button
                disabled={isProcessing}
                onClick={() => setDialog({ type: null, userId: null })}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={isProcessing} // KHÓA NÚT CHÍNH
                onClick={() => onConfirmReject(currentUser.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;