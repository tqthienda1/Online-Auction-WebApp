import React, { useState } from "react";
import { MdComment } from "react-icons/md";
import { Spinner } from "./ui/spinner";

const QuestionBox = ({ onSubmit, question, setQuestion, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-10">
      <form
        className={`border-2 shadow-sm rounded-lg border-yellow-400 px-15 py-4 w-[60%] ${
          isLoading ? "bg-gray-100 pointer-events-none" : ""
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-center items-center ">
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
              name="question"
              placeholder="Tell us more about your question..."
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
            ></textarea>
            <div className="w-full flex items-center justify-end">
              <button
                type="submit"
                className="w-1/5 flex justify-center items-center mt-3 rounded-lg px-5 py-2 bg-yellow-400 text-white font-semibold text-lg hover:bg-yellow-500 cursor-pointer"
              >
                {isLoading ? (
                  <Spinner className="size-8 w-full text-white" />
                ) : (
                  <div className="flex">
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
