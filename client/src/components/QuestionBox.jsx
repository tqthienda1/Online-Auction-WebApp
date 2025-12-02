import React from "react";

const QuestionBox = (question, setQuestion) => {
  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-10 ">
      <form className="border-2 shadow-sm rounded-lg border-yellow-400 px-15 py-4 w-[60%]">
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
              // value={formData.question}
              // onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground resize-none"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionBox;
