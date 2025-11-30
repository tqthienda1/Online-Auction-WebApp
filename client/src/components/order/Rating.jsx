import React, { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const schema = z.object({
  descriptionRating: z.string().min(1, "Description is required"),
});

const Rating = ({ type = "item" }) => {
  const [score, setScore] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("rating submitted", { score, ...data });
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight">Rate this {type}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => setScore((s) => Math.max(0, s - 1))}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40"
              aria-label="decrease rating"
              disabled={score <= 0}
            >
              -
            </button>

            <div className="w-10 sm:w-12 text-center text-lg font-medium">{score}</div>

            <button
              type="button"
              onClick={() => setScore((s) => Math.min(5, s + 1))}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FBBC04] text-white hover:bg-[#e0a800] disabled:opacity-40"
              aria-label="increase rating"
              disabled={score >= 5}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <textarea
            {...register("descriptionRating")}
            placeholder={`Write your experience about the ${type}...`}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm h-28 resize-none focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent"
          />
          {errors.descriptionRating && (
            <p className="text-red-500 text-sm mt-1">{errors.descriptionRating.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#FBBC04] hover:bg-[#e0a800] text-white px-5 py-2 rounded-md shadow"
          >
            Submit Rating
          </button>
        </div>
      </form>
    </div>
  );
};

export default Rating;
