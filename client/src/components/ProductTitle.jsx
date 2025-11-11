import { useState } from "react";

const ProductTitle = ({ nameMain, nameSub, isActive }) => {
  if (isActive)
    return (
      <div className="flex flex-col justify-center items-center w-screen">
        <h1 className="font-playfair text-center text-4xl text-brand mt-2 font-medium">
          {nameMain}
        </h1>
        <h2 className="font-playfair text-center mt-2 text-3xl text-yellow-500 font-medium">
          {nameSub}
        </h2>
        {isActive && (
          <div className="flex bg-brand w-28 h-10 justify-center items-center mt-5 rounded-xs font-medium text-xl text-yellow-500">
            Active
          </div>
        )}
      </div>
    );
};

export default ProductTitle;
