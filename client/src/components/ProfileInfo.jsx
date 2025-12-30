import React from "react";
import { LuUser } from "react-icons/lu";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useAuth } from "@/context/AuthContext";

const ProfileInfo = ({ info, setInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const { user } = useAuth();


  const handleClick = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex text-brand m-5 w-3/4 rounded-2xl bg-gray-100 p-10 border border-gray-200 shadow-md justify-between items-center">
      <div className="flex items-center justify-center gap-5">
        <LuUser className="bg-brand text-white rounded-full text-7xl p-3" />
        <div>
          <h1 className="font-bold text-2xl font-playfair">{info.username}</h1>
          <h3 className="text-gray-400 text-md">
            {info.address || "Address is empty"}
          </h3>
        </div>
      </div>
      <div className="flex gap-5">
        <button
          onClick={() => handleClick("changeInfo")}
          className="font-semibold cursor-pointer border border-gray-200 py-2 px-5 rounded-lg items-center bg-white hover:bg-gray-100"
        >
          Change information
        </button>
        <button
          onClick={() => handleClick("changePass")}
          className="font-semibold cursor-pointer border border-gray-200 py-2 px-5 rounded-lg items-center bg-white hover:bg-gray-100"
        >
          Change password
        </button>
        {user?.roleUser === "BIDDER" && (
          <button
            onClick={() => handleClick("upgrade")}
            className="font-semibold cursor-pointer text-white border border-gray-200 py-2 px-5 rounded-lg items-center bg-yellow-400 hover:bg-yellow-500"
          >
            Upgrade to seller
          </button>
        )}
        {(user?.roleUser === "BIDDER" ||
          (info.upgrade && info.upgrade.status === "PENDING")) && (
          <button className="font-semibold text-white border border-gray-200 py-2 px-5 rounded-lg items-center bg-yellow-400 opacity-50 cursor-not-allowed">
            Your request is pending
          </button>
        )}
        {user?.roleUser === "SELLER" && (
          <button className="font-semibold text-white border border-gray-200 py-2 px-5 rounded-lg items-center bg-yellow-400 ">
            You are seller
          </button>
        )}
      </div>

      {showModal && (
        <Modal
          info={info}
          setInfo={setInfo}
          type={modalType}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
