import { formattedDate } from "@/helper/formatDate";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import { FaRegFlag } from "react-icons/fa6";
import { HiArrowTurnDownRight } from "react-icons/hi2";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

const CommentSection = ({
  comments,
  setParent,
  onReply,
  user,
  replyText,
  setReplyText,
  isLoading,
  seller,
}) => {
  const mainComments = comments.filter((c) => !c.parentID);
  const replies = comments.filter((c) => c.parentID);
  const [showBox, setShowBox] = useState({ id: null, name: "" });

  const getReplyFor = (id) => replies.filter((r) => r.parentID === id);

  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-10">
      <p className="text-4xl font-bold font-playfair underline decoration-yellow-400 decoration-3 underline-offset-8">
        Customer Reviews
      </p>

      <div className="w-full flex justify-center">
        <div className="w-[60%] max-h-[500px] overflow-y-scroll pr-4 space-y-10 custom-scroll">
          {mainComments.map((c) => {
            const reply = getReplyFor(c.id);

            return (
              <div key={c.id} className="flex flex-col gap-4">
                <div className="border rounded-md py-5 px-10">
                  <p className="text-xl font-medium text-brand">
                    {c.user.username}
                  </p>
                  <p className="text-sm font-light">
                    {formattedDate(c.createdAt)}
                  </p>
                  <p className="text-md text-brand">{c.content}</p>
                  <div className="w-full flex justify-end items-center">
                    {seller === user.id && (
                      <button
                        className="rounded-lg bg-yellow-400 text-white px-3 py-1 font-semibold cursor-pointer"
                        onClick={() => {
                          setShowBox({ id: null, name: "" });
                          setShowBox({ id: c.id, name: c.user.username });
                          setParent(c.id);
                        }}
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>

                {showBox.id == c.id && (
                  <div
                    className={`border border-yellow-400 rounded-lg p-3 flex flex-col items-start w-full ${
                      isLoading ? "bg-gray-100 pointer-events-none" : ""
                    }`}
                  >
                    <div className="w-full">
                      <h2 className="text-lg font-semibold mb-2 flex justify-center items-center text-brand">
                        Replying to:
                        <span className="text-yellow-400 ml-2">
                          {showBox.name}
                        </span>
                      </h2>
                      <textarea
                        id="reply"
                        name="reply"
                        placeholder={`Reply to ${showBox.name}...`}
                        required
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                      ></textarea>
                      <div className="flex w-full justify-center gap-7 items-center mt-3">
                        {isLoading ? (
                          <Spinner className="size-8 w-full text-yellow-500" />
                        ) : (
                          <>
                            <button
                              className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded-lg font-semibold cursor-pointer"
                              onClick={() => setShowBox({ id: null, name: "" })}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 py-2 px-5 rounded-lg font-semibold cursor-pointer text-white"
                              onClick={() => onReply(showBox.id)}
                            >
                              Submit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {reply &&
                  reply.map((r) => (
                    <div key={r.id} className="flex items-center">
                      <HiArrowTurnDownRight className="mb-15 ml-7 text-3xl text-brand" />
                      <div className="border rounded-md py-4 px-8 ml-10 bg-gray-50 shadow-sm w-[90%]">
                        <p className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                          {r.user.username}
                        </p>
                        <p className="text-sm font-light">
                          {formattedDate(r.createdAt)}
                        </p>
                        <p className="text-md wrap-break-word">{r.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
