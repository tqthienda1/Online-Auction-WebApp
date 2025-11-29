import React from "react";
import { useForm } from "react-hook-form";

const AdminForm = ({ openForm = null, forms, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  return (
    <>
      {openForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded w-96">
            <h2 className="text-lg font-bold mb-2">{openForm} Category</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              {forms
                .find((f) => f.id === openForm)
                .fields.map((field) => (
                  <div key={field}>
                    <input
                      type="text"
                      placeholder={field}
                      {...register(field, {
                        required: `${field} must be required`,
                      })}
                    />
                    {errors[field] && (
                      <span className="text-red-500">
                        {errors[field].message}
                      </span>
                    )}
                  </div>
                ))}

              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => (onClose(), reset())}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminForm;
