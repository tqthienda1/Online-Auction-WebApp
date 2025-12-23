import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "../components/RichTextEditor";
import { IoMdClose, IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsQuestionCircle } from "react-icons/bs";
import { http } from "../lib/utils.js";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    productName: z.string().nonempty("Product name is required"),
    category: z.string().nonempty("Category is required"),
    subCategory: z.string().nonempty("Sub category is required"),
    startingPrice: z
      .number("Starting price must be a number")
      .min(1, "Starting price must be at least 0"),
    bidStep: z
      .number("Bid step must be a number")
      .min(1, "Bid step must be at least 0"),
    buyNowPrice: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) {
        return undefined;
      }

      const num = Number(val);

      if (isNaN(num)) {
        return val;
      }

      return num;
    }, z.number().min(0).optional()),
    productImages: z
      .array(z.instanceof(File), "You must upload at least 3 images")
      .min(3, "You must upload at least 3 images"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    ratingRequired: z.boolean().default(false),
    autoExtend: z.boolean().default(false),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be greater than Start date",
    path: ["endDate"],
  });

const AddProductsPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [descEmpty, setDescEmpty] = useState(false);
  const [disableSubcate, setDisableSubcate] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      if (loadingPage) {
        return;
      }
      setLoadingPage(true);
      try {
        const res = await http.get("categories/tree");

        setCategories(res.data);

        console.log(res.data);
      } catch (error) {
        console.error("Loading categories failed: ", error.message);
      } finally {
        setLoadingPage(false);
      }
    };

    loadCategories();
  }, []);

  const onFilesChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const allFiles = [...files, ...newFiles];
    setFiles(allFiles);
    setValue("productImages", allFiles);
  };

  const handleDescriptionChange = (newContent) => {
    setDescription(newContent);
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((item, index) => index !== idx));
  };

  const handleSelectCategory = async (parentName) => {
    const category = categories.find((item) => item.name === parentName);
    const newSubCategories = category.categoryChild;

    setSubCategories(newSubCategories);

    if (newSubCategories) {
      setDisableSubcate(false);
    } else {
      setDisableSubcate(true);
    }
  };

  const handleClickPublish = () => {
    if (description === "") {
      setDescEmpty(true);
      return;
    }
    setDescEmpty(false);
  };

  const handleClose = () => {
    setShowConfirm(false);
    setLoading(false);
    setError(false);
    setSuccess(false);
    if (success) {
      navigate("/");
    }
  };

  const confirmSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const rawData = { ...data, description };
    const dataForm = new FormData();

    for (const file of rawData.productImages) {
      dataForm.append("productImages", file);
    }

    dataForm.append("productName", rawData.productName);
    dataForm.append("description", rawData.description);
    dataForm.append("autoExtend", rawData.autoExtend);
    dataForm.append("ratingRequired", rawData.ratingRequired);
    dataForm.append("bidStep", rawData.bidStep);
    dataForm.append("startingPrice", rawData.startingPrice);
    dataForm.append("buyNowPrice", rawData.buyNowPrice);
    dataForm.append("category", rawData.category);
    dataForm.append("subCategory", rawData.subCategory);
    dataForm.append("startDate", rawData.startDate);
    dataForm.append("endDate", rawData.endDate);

    try {
      const res = await http.post("/products", dataForm);

      if (res.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      setError(true);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setShowConfirm(true);
    setData(data);
    console.log(data);
  };

  return (
    <>
      {!loadingPage && (
        <div className="px-10 py-12 bg-white w-full h-full">
          <h1 className="text-center text-4xl font-playfair font-bold mb-12">
            Add Products
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex gap-8"
            noValidate
          >
            {/* Left Column */}
            <div className="flex-1">
              <h3 className="text-yellow-500 text-lg font-semibold mb-8">
                Product Information
              </h3>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Product Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter product name..."
                  {...register("productName")}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Category:
                </label>
                <select
                  {...register("category")}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  onChange={(e) => handleSelectCategory(e.target.value)}
                >
                  <option value="" hidden>
                    Add Category
                  </option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-medium mb-2">
                  Sub Category:
                </label>
                <select
                  disabled={disableSubcate}
                  {...register("subCategory")}
                  className={`w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 ${
                    disableSubcate && "opacity-30 cursor-not-allowed"
                  }`}
                >
                  <option value="" hidden>
                    Add Sub Category
                  </option>
                  {subCategories.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subCategory.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex-1">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Starting Price:
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                      $
                    </span>
                    <input
                      type="text"
                      // value=""
                      {...register("startingPrice", { valueAsNumber: true })}
                      className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  {errors.startingPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startingPrice.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Bid Step:
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                      $
                    </span>
                    <input
                      type="text"
                      // value=""
                      {...register("bidStep", { valueAsNumber: true })}
                      className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  {errors.bidStep && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bidStep.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Buy Now Price (optional):
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                      $
                    </span>
                    <input
                      type="text"
                      {...register("buyNowPrice")}
                      className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  {errors.buyNowPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.buyNowPrice.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="flex-1">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Start date:
                  </label>
                  <input
                    {...register("startDate")}
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    End date:
                  </label>
                  <input
                    {...register("endDate")}
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex-1">
                  <label
                    htmlFor="ratingRequired"
                    className=" text-gray-800 text-sm font-medium mb-2 cursor-pointer"
                  >
                    Bidder must have been rated before:
                  </label>
                  <input
                    {...register("ratingRequired")}
                    id="ratingRequired"
                    type="checkbox"
                    className="border ml-1 accent-yellow-400 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 cursor-pointer"
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="autoExtend"
                    className=" text-gray-800 text-sm font-medium mb-2 cursor-pointer"
                  >
                    Auto extend:
                  </label>
                  <input
                    {...register("autoExtend")}
                    id="autoExtend"
                    type="checkbox"
                    className="border ml-1 accent-yellow-400 border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-1 bg-yellow-400 rounded"></div>

            {/* Right Column */}
            <div className="flex-1">
              <h3 className="text-gray-800 text-lg font-semibold mb-8">
                Product Images (minimum 3 images)
              </h3>
              <div className="flex gap-6 mb-8">
                {/* Upload Box */}
                <label
                  htmlFor="productImages"
                  className="w-40 h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 shrink-0"
                >
                  <div className="text-center">
                    <div className="text-5xl text-yellow-400 mb-2">+</div>
                    <div className="text-xs text-gray-400">Click to upload</div>
                  </div>
                  <input
                    {...register("productImages")}
                    id="productImages"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFilesChange}
                  />
                </label>
                {/* File List */}
                <div className="flex-1">
                  <div className="space-y-3 overflow-y-auto max-h-80 pr-5">
                    {files.length === 0 ? (
                      <p className="text-gray-400 text-sm">
                        No images uploaded yet
                      </p>
                    ) : (
                      files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 bg-white"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.round(file.size / 1024)} KB
                            </div>
                          </div>

                          <IoMdClose
                            onClick={() => handleRemoveFile(idx)}
                            className="text-xl cursor-pointer"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {errors.productImages && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.productImages.message}
                  </p>
                )}
              </div>
              {/* Description Box */}
              <RichTextEditor
                {...register("productDescription")}
                onChange={handleDescriptionChange}
              />
              {descEmpty && (
                <p className="text-red-500 text-sm mt-2">
                  Description cannot be empty
                </p>
              )}
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleClickPublish}
                  className="bg-yellow-500 text-white px-8 py-3 mt-3 rounded-lg font-semibold hover:bg-yellow-600 transition cursor-pointer"
                >
                  Publish
                </button>
              </div>
            </div>
            {showConfirm && (
              <div
                id="popup-modal"
                tabIndex={-1}
                className="flex h-screen bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full"
              >
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white border border-default rounded-base shadow-sm p-4 md:p-6 rounded-lg">
                    {!loading && (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="cursor-pointer absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                        data-modal-hide="popup-modal"
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
                    )}
                    {!loading && !success && !error && (
                      <div className="p-4 md:p-5 text-center h-60">
                        <BsQuestionCircle className="w-full text-7xl text-yellow-500" />
                        <h3 className="my-6 text-body font-semibold">
                          Are you sure you want to sell this product?
                        </h3>
                        <div className="flex items-center space-x-4 justify-center">
                          <button
                            onClick={confirmSubmit}
                            data-modal-hide="popup-modal"
                            type="button"
                            className="rounded-lg text-white font-semibold bg-yellow-500 box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer hover:bg-yellow-400"
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            data-modal-hide="popup-modal"
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            className="focus:outline-none text-body font-semibold bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs leading-5 rounded-base text-sm px-4 py-2.5 rounded-lg cursor-pointer hover:bg-red-400 hover:text-white"
                          >
                            No, cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {loading && !success && !error && (
                      <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60 overflow-hidden">
                        <Spinner className="size-8 w-full text-yellow-500" />
                        <h3 className="font-semibold my-6 text-body">
                          Loading
                        </h3>
                      </div>
                    )}

                    {!loading && !success && error && (
                      <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
                        <IoIosCloseCircleOutline className="w-full text-7xl text-yellow-500" />
                        <h3 className="my-6 text-body font-semibold">
                          Add the product is failed
                        </h3>
                      </div>
                    )}

                    {!loading && success && !error && (
                      <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
                        <IoCheckmarkCircleOutline className="w-full text-7xl text-yellow-500" />
                        <h3 className="my-6 text-body font-semibold">
                          Add the product successfully
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
      {loadingPage && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
    </>
  );
};

export default AddProductsPage;
