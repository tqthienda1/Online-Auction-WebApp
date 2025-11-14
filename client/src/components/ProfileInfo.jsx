import React from "react";
import { LuUser } from "react-icons/lu";

const ProfileInfo = () => {
  return (
    <div className="flex text-brand font-playfair m-5 w-3/4 rounded-2xl bg-gray-100 p-10 border border-gray-200 shadow-md justify-between items-center">
      <div className="flex items-center justify-center gap-5">
        <LuUser className="bg-brand text-white rounded-full text-7xl p-3" />
        <div>
          <h1 className="font-bold text-2xl">User Name</h1>
          <h3 className="text-gray-400 text-md">email@gmail.com</h3>
        </div>
      </div>
      <div className="flex gap-5">
        <button className="font-semibold border border-gray-200 py-2 px-5 rounded-lg items-center bg-white hover:bg-gray-100">
          Change information
        </button>
        <button className="font-semibold border border-gray-200 py-2 px-5 rounded-lg items-center bg-white hover:bg-gray-100">
          Change password
        </button>
        <button className="font-semibold border border-gray-200 py-2 px-5 rounded-lg items-center bg-yellow-400 hover:bg-yellow-500">
          Upgrade to seller
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
