import React from "react";

const DeleteWarning = ({ content, onCancel }) => {
  return (
    <div className="p-3 fixed inset-0 flex items-center justify-center bg-black/50 ">
      <div className="flex flex-col justify-center items-center gap-5 bg-gray-100 p-5 border rounded-lg">
        <span className="font-bold text-red-500 text-lg">{content}</span>
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={() => onCancel()}
            className="text-while font-bold bg-gray-300 hover:bg-gray-400 cursor-pointer px-3 py-1 border rounded-lg w-25"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWarning;
