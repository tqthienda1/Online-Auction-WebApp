import React from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const ProfileRating = () => {
  return (
    <div className="flex gap-10 items-center m-2">
      <div className="flex flex-col items-center gap-2">
        <p className="ms-2 text-3xl font-bold text-body">+724</p>
        <p className="ms-2 text-sm font-medium text-gray-400 text-body">
          1,745 global ratings
        </p>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="flex items-center mt-4">
          <AiOutlineLike className="mx-3 text-sm ml-0.5 text-green-500" />
          <a
            href="#"
            className="text-sm w-1/7 font-medium text-fg-brand hover:underline text-gray-400"
          >
            Up ratings
          </a>
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-green-500 rounded-lg"
              style={{ width: "70%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            70%
          </span>
        </div>
        <div className="flex items-center mt-4">
          <AiOutlineDislike className="text-sm mx-3 ml-0.5 text-red-500" />
          <a
            href="#"
            className="text-sm w-1/7 font-medium text-fg-brand hover:underline text-gray-400"
          >
            Down ratings
          </a>
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-red-500 rounded-lg"
              style={{ width: "17%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            17%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileRating;
