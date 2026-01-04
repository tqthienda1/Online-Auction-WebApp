import { createPortal } from "react-dom";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

const CONFIG = {
  bid: {
    title: "Confirm Your Bid",
    getAmount: (payload) => `${payload.value} USD`,
    warning:
      "This action cannot be undone. Once confirmed, your bid will immediately become active.",
    confirmText: "Confirm Bid",
  },

  "buy-now": {
    title: "Confirm Buy Now",
    getAmount: (payload) => `${payload.buyNowPrice} USD`,
    warning: "This will immediately end the auction and purchase the product.",
    confirmText: "Buy Now",
  },

  ban: {
    title: "Confirm Action",
    getAmount: () => null,
    warning: "This action cannot be undone.",
    confirmText: "Confirm",
  },
};

const ConfirmActionModal = ({
  type,
  status = "idle",
  payload,
  error,
  onConfirm,
  onCancel,
}) => {
  const config = CONFIG[type];

  const amountText = config.getAmount(payload);
  console.log(amountText);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const isLoading = status === "loading";
  const isSuccess = status === "success";

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
        onClick={!isLoading ? onCancel : undefined}
      />

      <div className="relative w-[420px] bg-neutral-50 rounded-md shadow-2xl border border-brand/20 animate-scaleIn">
        <div className="px-6 py-4 border-b border-brand/20 flex items-center gap-3">
          <FiAlertTriangle className="text-yellow-400 text-2xl" />
          <h2 className="text-xl font-bold text-brand uppercase">
            {config.title}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-neutral-600">
            Please confirm the following action:
          </p>

          {amountText && (
            <div className="flex justify-center">
              <span className="text-3xl font-extrabold text-yellow-400">
                {amountText}
              </span>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded">
            {config.warning}
          </div>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded text-center">
              Action completed successfully.
            </div>
          )}

          {status === "error" && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand/20 flex justify-between gap-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              w-full h-10
              border border-brand text-brand
              font-semibold uppercase
              hover:bg-brand hover:text-yellow-400
              transition
              disabled:opacity-50
            "
          >
            {isSuccess ? "Close" : "Cancel"}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading || isSuccess}
            className="
              w-full h-10
              bg-brand text-yellow-400
              font-bold uppercase
              hover:bg-yellow-400 hover:text-brand
              transition
              disabled:opacity-50
            "
          >
            {isLoading
              ? "Processing..."
              : isSuccess
              ? "Completed"
              : config.confirmText}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default ConfirmActionModal;
