import React from "react";
import { MdComment } from "react-icons/md";
import { Spinner } from "../ui/spinner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const questionSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(10, "Question must be at least 10 characters"),
});

const QuestionBox = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(questionSchema),
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.question);
    reset();
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-10">
      <form
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`border-2 shadow-sm rounded-lg border-yellow-400 px-15 py-4 w-[60%] ${
          isLoading ? "bg-gray-100 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Ask a Question
          </h2>
          <p className="text-muted-foreground mb-3">
            Have a question about our product? We'd love to hear from you!
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Your Question
            </label>

            <textarea
              id="question"
              placeholder="Tell us more about your question..."
              rows={4}
              {...register("question")}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
            />

            {errors.question && (
              <p className="text-red-500 text-sm mt-1">
                {errors.question.message}
              </p>
            )}

            <div className="w-full flex items-center justify-end">
              <button
                type="submit"
                className="w-1/5 flex justify-center items-center mt-3 rounded-lg px-5 py-2 bg-yellow-400 text-white font-semibold text-lg hover:bg-yellow-500"
              >
                {isLoading ? (
                  <Spinner className="size-8 w-full text-white" />
                ) : (
                  <div className="flex items-center">
                    <MdComment className="text-2xl mr-2" />
                    Submit
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionBox;
