import { formattedDate } from "@/helper/formatDate";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import { FaRegFlag } from "react-icons/fa6";

const CommentSection = ({ comments }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-10">
      <p className="text-4xl font-bold font-playfair underline decoration-yellow-400 decoration-3 underline-offset-8">
        Customer Reviews
      </p>
      {comments.map((c, index) => (
        <div
          key={index}
          className="flex flex-col justify-center border rounded-md py-5 px-10 w-[60%] gap-2"
        >
          <p className="text-xl font-medium">{c.username}</p>
          <p className="text-sm font-light">{formattedDate(c.createdAt)}</p>

          <p className="text-lg font-medium">
            {/* <span className="font-bold text-yellow-400">Title: </span> */}
            {c.title}
          </p>

          <p className="text-md font-light">
            {/* <span className="font-bold text-yellow-400">Content: </span> */}
            {c.content}
          </p>

          <div className="w-full h-0.5 bg-neutral-300 mx-auto"></div>

          <div className="flex items-center gap-5">
            <div className="flex items-center space-x-2">
              <AiOutlineLike className="text-xl hover:text-yellow-400 hover:scale-130 transition" />

              <p className="text-md">{c.numOfLike}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineComment className="text-xl mt-1  hover:text-yellow-400 hover:scale-130 transition" />

              <p className="text-md">{c.numOfLike}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaRegFlag className="text-lg  hover:text-yellow-400 hover:scale-130 transition" />

              <p className="text-md">Report</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
