import React from "react";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebookSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="flex w-full justify-around p-10 bg-gray-100 border-brand">
      <h1 className="flex-1 text-center font-playfair text-5xl italic text-brand">
        Follow us
      </h1>
      <div className="flex justify-center flex-1 gap-10">
        <div>
          <RiInstagramFill className="text-5xl text-brand" />
        </div>
        <div>
          <FaFacebookSquare className="text-5xl text-brand" />
        </div>
        <div>
          <FaYoutube className="text-5xl text-brand" />
        </div>
        <div>
          <AiFillTikTok className="text-5xl text-brand" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
