import { formattedDate } from "@/helper/formatDate";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import { FaRegFlag } from "react-icons/fa6";
import { HiArrowTurnDownRight } from "react-icons/hi2";

const CommentSection = ({ comments }) => {
  const mainComments = comments.filter((c) => !c.parentID);
  const replies = comments.filter((c) => c.parentID);

  const getReplyFor = (id) => replies.find((r) => r.parentID === id);

  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-10">
      <p className="text-4xl font-bold font-playfair underline decoration-yellow-400 decoration-3 underline-offset-8">
        Customer Reviews
      </p>

      <div className="w-full flex justify-center">
        <div className="w-[60%] max-h-[500px] overflow-y-auto pr-4 space-y-10">
          {mainComments.map((c) => {
            const reply = getReplyFor(c.id);

            return (
              <div key={c.id} className="flex flex-col gap-4">
                <div className="border rounded-md py-5 px-10">
                  <p className="text-xl font-medium text-brand">{c.username}</p>
                  <p className="text-sm font-light">
                    {formattedDate(c.createdAt)}
                  </p>
                  <p className="text-md text-brand">{c.content}</p>
                </div>

                {reply && (
                  <div className="flex items-center">
                    <HiArrowTurnDownRight className="mb-15 ml-7 text-3xl text-brand" />
                    <div className="border rounded-md py-4 px-8 ml-10 bg-gray-50 shadow-sm">
                      <p className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                        {reply.username}
                      </p>
                      <p className="text-sm font-light">
                        {formattedDate(reply.createdAt)}
                      </p>
                      <p className="text-md">{reply.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
