import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Modal = ({ username, type, onClose }) => {
  const schema = z
    .object({
      username: z.string().nonempty("Please fill the username"),
      curPass: z.string().nonempty("Please fill the current password"),
      newPass: z.string().nonempty("Please fill the new password"),
      confirmPass: z.string().nonempty("Please confirm the new password"),
    })
    .refine((data) => data.confirmPass === data.newPass, {
      message: "Password do not match",
      path: ["confirmPass"],
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username,
    },
  });
  const [showPass, setShowPass] = useState(false);

  const handleShowPass = () => {
    setShowPass((prev) => !prev);
  };

  const onSubmit = () => {};

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="flex bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative rounded-xl bg-white border border-default rounded-base shadow-sm p-4 md:p-6">
          {/* Modal header */}
          <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
            <h3 className="text-lg font-semibold text-heading font-playfair">
              {type === "changeInfo" && "Change information"}
              {type === "changePass" && "Change password"}
              {type === "upgrade" && "Upgrade to seller"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-body cursor-pointer bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
              data-modal-hide="crud-modal"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            {type === "changeInfo" && (
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2.5 text-sm font-semibold text-heading"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type name"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            {type === "changePass" && (
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="currentPassword"
                    className="block mb-2.5 text-sm font-semibold text-heading"
                  >
                    Current password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type current password"
                    {...register("curPass")}
                  />
                  {errors.curPass && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.curPass.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="newPassword"
                    className="block mb-2.5 text-sm font-semibold text-heading"
                  >
                    New password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type new password"
                    {...register("newPass")}
                  />
                  {errors.newPass && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPass.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="confirmNewPassword"
                    className="block mb-2.5 text-sm font-semibold text-heading"
                  >
                    Confirm new password
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    className="rounded-xl bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:outline-none block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Confirm new password"
                    {...register("confirmPass")}
                  />
                  {errors.confirmPass && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPass.message}
                    </p>
                  )}
                </div>
                <div
                  onClick={handleShowPass}
                  className="col-span-2 mb-2.5 text-sm gap-1 justify-center items-center text-heading flex font-semibold cursor-pointer select-none"
                >
                  {showPass ? (
                    <FaRegEye className="text-2xl" />
                  ) : (
                    <FaRegEyeSlash className="text-2xl" />
                  )}
                  Show password
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
              <button
                type="submit"
                className="rounded-xl cursor-pointer hover:brightness-95 inline-flex items-center  text-white bg-yellow-400 font-semibold hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                {(type === "changeInfo" || type === "changePass") && "Change"}
                {type === "upgrade" && "Send request"}
              </button>
              <button
                data-modal-hide="crud-modal"
                onClick={onClose}
                type="button"
                className="cursor-pointer rounded-xl text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading f shadow-xs font-semibold hover:brightness-90 leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
