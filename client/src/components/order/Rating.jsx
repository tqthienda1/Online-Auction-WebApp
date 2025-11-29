import React, { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  descriptionRating: z.string().min(1, "Description is required"),
});

const Rating = ({ type }) => {
  const [score, setScore] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("rating data:", {
      score,
      ...data,
    });
  };

  return (
    <>
      <div className="text-xl font-semibold mb-3">
        {`Rate for your ${type}`}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {/* LIKE / DISLIKE */}
        <div className="flex items-center gap-6 my-3">
          <button
            type="button"
            onClick={() => setScore(+1)}
            className={`px-4 py-2 rounded-lg border transition ${
              score === 1 ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            👍 Like (+1)
          </button>

          <button
            type="button"
            onClick={() => setScore(-1)}
            className={`px-4 py-2 rounded-lg border transition ${
              score === -1 ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            👎 Dislike (-1)
          </button>
        </div>

        {/* TEXTAREA */}
        <div>
          <textarea
            {...register("descriptionRating")}
            placeholder={`Provide your experience with the ${type}...`}
            className="border rounded-lg p-2 w-full"
          ></textarea>
          {errors.descriptionRating && (
            <p className="text-red-500 text-sm">
              {errors.descriptionRating.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit Rating
        </button>
      </form>
    </>
  );
};

export default Rating;
