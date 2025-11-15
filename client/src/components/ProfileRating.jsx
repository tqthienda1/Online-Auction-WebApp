import React from "react";
import { FaStar } from "react-icons/fa";

const ProfileRating = () => {
  return (
    <div className="flex gap-10 items-center m-2">
      <div className="flex flex-col items-center mb-3 gap-2">
        <p className="ms-2 text-3xl font-bold text-body">4.95</p>
        <div className="flex items-center space-x-1">
          <svg
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
          <svg
            className="w-5 h-5 text-yellow-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
        </div>
        <p className="ms-2 text-sm font-medium text-gray-400 text-body">
          1,745 global ratings
        </p>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-fg-brand hover:underline text-gray-400"
          >
            5
          </a>
          <FaStar className="text-sm ml-0.5" />
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-yellow-400 rounded-lg"
              style={{ width: "70%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            70%
          </span>
        </div>
        <div className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-fg-brand hover:underline text-gray-400"
          >
            4
          </a>
          <FaStar className="text-sm ml-0.5" />
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-yellow-400 rounded-lg"
              style={{ width: "17%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            17%
          </span>
        </div>
        <div className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-fg-brand hover:underline text-gray-400"
          >
            3
          </a>
          <FaStar className="text-sm ml-0.5" />
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-yellow-400 rounded-lg"
              style={{ width: "8%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            8%
          </span>
        </div>
        <div className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-fg-brand hover:underline text-gray-400"
          >
            2
          </a>
          <FaStar className="text-sm ml-0.5" />
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-yellow-400 rounded-lg"
              style={{ width: "4%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            4%
          </span>
        </div>
        <div className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-medium text-fg-brand hover:underline text-gray-400"
          >
            1
          </a>
          <FaStar className="text-sm ml-0.5" />
          <div className="bg-gray-200 w-1/4 h-4 mx-4 bg-neutral-quaternary rounded-lg">
            <div
              className="h-4 bg-yellow-400 rounded-lg"
              style={{ width: "1%" }}
            ></div>
          </div>
          <span className="text-sm font-medium text-body text-gray-400">
            1%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileRating;
