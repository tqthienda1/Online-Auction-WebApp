import React from "react";
import { useForm } from "react-hook-form";

const AdminForm = ({
  openForm = null,
  forms,
  onClose,
  onSubmit,
  categories,
}) => {
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
          <div className="bg-white py-4 px-8 rounded-lg w-[30%] shadow-sm">
            <h2 className="text-2xl font-bold mb-2 flex justify-center items-center text-brand">
              {openForm} Category
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2 p-3"
            >
              {forms
                .find((f) => f.id === openForm)
                .fields.map((field) => (
                  <div key={field}>
                    <h2 className="p-1 font-semibold">{field}</h2>
                    {field.toLowerCase() === "category" ? (
                      <select
                        {...register(field, {
                          required: `${field} must be required`,
                        })}
                        className="px-3 py-1 border rounded-lg w-full shadow-sm"
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((c) => (
                          <option value={c.name}>{c.name}</option>
                        ))}
                        {forms
                          .find((f) => f.id === openForm)
                          .categories?.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={`Enter ${field} ...`}
                        {...register(field, {
                          required: `${field} must be required`,
                        })}
                        className="px-3 py-1 border rounded-lg w-full shadow-sm"
                      />
                    )}
                    {errors[field] && (
                      <span className="text-red-500">
                        {errors[field].message}
                      </span>
                    )}
                  </div>
                ))}

              <div className="flex gap-2 mt-5 justify-center items-center font-semibold">
                <button
                  type="submit"
                  className="border py-1 px-3 rounded-lg bg-brand text-yellow-400 hover:bg-yellow-400 hover:text-brand"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => (onClose(), reset())}
                  className="border py-1 px-3 rounded-lg bg-gray-100 hover:bg-gray-200"
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
