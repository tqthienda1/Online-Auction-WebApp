import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const AddProductButton = () => {
  return (
    <Link
      to="/add-products"
      className=" flex gap-3 bg-yellow-400 text-white rounded-lg p-2 font-semibold shadow-xl/20 cursor-pointer hover:bg-yellow-500 pl-5 items-center"
    >
      <FaPlus className="text-2xl" />
      <button>Add Product</button>
    </Link>
  );
};

export default AddProductButton;
