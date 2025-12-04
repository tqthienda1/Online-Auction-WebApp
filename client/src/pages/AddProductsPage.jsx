import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RichTextEditor from "../components/RichTextEditor";

const schema = z.object({
  productName: z.string().nonempty("Product name is required"),
  category: z.string().nonempty("Category is required"),
  subCategory: z.string().nonempty("Sub category is required"),
  startingPrice: z.coerce.number({ invalid_type_error: "Starting price must be a number" }).min(0, "Starting price must be at least 0"),
  bidStep: z.coerce.number({ invalid_type_error: "Bid step must be a number" }).min(0, "Bid step must be at least 0"),
  buyNowPrice: z.coerce.number().min(0, "Buy now price must be at least 0").optional(),
  productImages: z.array(z.instanceof(File)).min(3, "You must upload at least 3 images"),
  productDescription: z.string().nonempty("Product description is required"),
});

const AddProductsPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");

  const onFilesChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const allFiles = [...files, ...newFiles];
    setFiles(allFiles);
    setValue("productImages", allFiles);
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="px-10 py-12 bg-white">
      <h1 className="text-center text-4xl font-playfair font-bold mb-12">Add Products</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1">
          <h3 className="text-yellow-500 text-lg font-semibold mb-8">Product Information</h3>

          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-medium mb-2">Product Name:</label>
            <input
              type="text"
              placeholder="Enter product name..."
              {...register("productName")}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-medium mb-2">Category:</label>
            <select
              {...register("category")}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="">Add Category</option>
              <option value="furniture">Furniture</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-medium mb-2">Sub Category:</label>
            <select
              {...register("subCategory")}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
            >
              <option value="">Add Sub Category</option>
              <option value="laptop">Laptop</option>
            </select>
            {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>}
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-gray-800 text-sm font-medium mb-2">Starting Price:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">$</span>
                <input
                  type="number"
                  placeholder="10,000"
                  {...register("startingPrice", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
              {errors.startingPrice && <p className="text-red-500 text-sm mt-1">{errors.startingPrice.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-gray-800 text-sm font-medium mb-2">Bid Step:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">$</span>
                <input
                  type="number"
                  placeholder="1,000"
                  {...register("bidStep", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
              {errors.bidStep && <p className="text-red-500 text-sm mt-1">{errors.bidStep.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-gray-800 text-sm font-medium mb-2">Buy Now Price (optional):</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">$</span>
                <input
                  type="number"
                  {...register("buyNowPrice", { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-2xl px-10 py-3 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
              {errors.buyNowPrice && <p className="text-red-500 text-sm mt-1">{errors.buyNowPrice.message}</p>}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-1 bg-yellow-400 rounded"></div>

        {/* Right Column */}
        <div className="flex-1">
          <h3 className="text-gray-800 text-lg font-semibold mb-8">Product Images (minimum 3 images)</h3>

          <div className="flex gap-6 mb-8">
            {/* Upload Box */}
            <label htmlFor="productImages" className="w-40 h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div className="text-center">
                <div className="text-5xl text-yellow-400 mb-2">+</div>
                <div className="text-xs text-gray-400">Drag & drop or click to upload</div>
              </div>
              <input
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
              <div className="space-y-3">
                {files.length === 0 ? (
                  <p className="text-gray-400 text-sm">No images uploaded yet</p>
                ) : (
                  files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 bg-white">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Description Box */}
          <RichTextEditor 
            value={description} 
            onChange={(html) => {
              setDescription(html);
              setValue("productDescription", html);
            }}
          />
          {errors.productDescription && <p className="text-red-500 text-sm mt-2">{errors.productDescription.message}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Publish
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductsPage;
