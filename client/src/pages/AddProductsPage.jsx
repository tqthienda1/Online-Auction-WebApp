import React from "react";
import{useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"


const schema = z.object({
  productName: z.string().nonempty("Product name is required"),
  category: z.string().nonempty("Category is required"),
  subCategory: z.string().nonempty("Sub category is required"),
  startingPrice: z
  .number({invalid_type_error: "Stating point must be a number"})
  .min(0, "Starting price must at least 0"),
  bidStep: z
  .number({invalid_type_error: "Bid step must be a number"})
  .min(0, "Bid step must at least 0"),
  buyNowPrice: z
  .number()
  .min(0, "Bid step must at least 0"),
  productImages: z
  .array(z.instanceof(File))
  .min(3, "You must upload at least 3 images")
  .refine(
    files => files.every(file => file.type.startsWith("image/")),
    "Files must be images"
  ),
  productDescription: z.string().nonempty("Product description is required"),
})
const AddProductsPage = () => {
  const {register, watch, handleSubmit, getValues, setValue, formState: {errors}} = useForm({
    resolver: zodResolver(schema)
  })
  return (
    <div>
      <form>
      <div className="productInformation">
          <label htmlFor="productInformation">Product Name: </label>
          <input
            type="text"
            id="productInformation"
            placeholder="Enter product name..."
            {...register('productInformation')}
          />
          <span>{errors.productInformation ? errros.productInformation.message:""}
          </span>
      </div>

      <div className="category">
        <label htmlFor="category"> Category:</label>
        <select id="category" {...register('category')}>
            <option value="electric">Electric</option>
            <option value="furniture">Furniture</option>
        </select>
        <span>
          {errors.category? errors.category.message:""}
        </span>
      </div>
      
      <div className="subCategory">
        <label htmlFor="subCategory">Sub Category:</label>
        <select id="category" {...register('category')}>
            <option value="electric">Electric</option>
            <option value="furniture">Furniture</option>
        </select>
        <span>
          {errors.category? errors.category.message:""}
        </span>
      </div>

      <div>
        <label htmlFor="startingPrice">Starting Price</label>
        <input 
          type="number"
          id="startingPrice"
          {...register("startingPrice")}
        />
        <span>
          {errors.startingPrice? errors.startingPrice.message:""}
        </span>
      </div>

      <div>
        <label htmlFor="bidStep">Bid Step</label>
        <input 
          type="number"
          id="bidStep"
          {...register("bidStep")}
        />
        <span>
          {errors.bidStep? errors.bidStep.message:""}
        </span>
      </div>

      <div>
        <label htmlFor="buyNowPrice">Buy Now Price</label>
        <input 
          type="number"
          id="buyNowPrice"
          {...register("buyNowPrice")}
        />
        <span>
          {errors.buyNowPrice? errors.buyNowPrice.message:""}
        </span>
      </div>


      <div>
        <label htmlFor="productImages">Product Images:</label>
      
        <input 
          type="file"
          accept="image/*"
          multiple
          id="productImages"
          {...register("productImages")}
          onChange={(e) => {
            //vi file ko luu duoi dang mang giong string hay number nen phai copy noi chuoi va chuyen thanh mang
            const newFiles = Array.from(e.target.files);
            const oldFiles = getValues("productImages") || [];
            setValue("productImages", [...oldFiles, ...newFiles]);
          }}
        />

        <div>
          {/* mang o tren la file, phai chuyen sang jsx de dung map */}
          {watch("productImage")?.map((file, idx) => (
            <img key={idx} src={URL.createObjectURL(file)}/>
          ))}
        </div>
        <span>
          {errors.productImages? errors.productImages.message:""}
        </span>
      </div>

      <div>
        <label htmlFor="productDescription">Product Description</label>
        <input
          id="productDescription"
          type="text"
          {...register("productDescription")}
        />
        <span>
          {errors.productDescription? errors.productDescription.message:""}
        </span>
      </div>
      </form>
    </div>
  )
};

export default AddProductsPage;
