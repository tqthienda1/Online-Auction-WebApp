import { createPortal } from "react-dom";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ConfirmBid = ({ bidValue, loading, error, onConfirm, onCancel }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-[420px] bg-neutral-50 rounded-md shadow-2xl border border-brand/20 animate-scaleIn">
        <div className="px-6 py-4 border-b border-brand/20 flex items-center gap-3">
          <FiAlertTriangle className="text-yellow-400 text-2xl" />
          <h2 className="text-xl font-bold text-brand uppercase">
            Confirm Your Bid
          </h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-neutral-600">
            You are about to place the following bid:
          </p>

          <div className="flex justify-center">
            <span className="text-3xl font-extrabold text-yellow-400">
              {bidValue} USD
            </span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded">
            This action cannot be undone. Once confirmed, your bid will
            immediately become active.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand/20 flex justify-between gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              w-full h-10
              border border-brand text-brand
              font-semibold uppercase
              hover:bg-brand hover:text-yellow-400
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              w-full h-10
              bg-brand text-yellow-400
              font-bold uppercase
              hover:bg-yellow-400 hover:text-brand
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Placing..." : "Confirm Bid"}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default ConfirmBid;
