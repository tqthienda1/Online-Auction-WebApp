const InputPrice = () => {
  return (
    <div>
      <div className="flex items-center rounded-xs border border-gray-300 bg-white pl-3">
        {/* Dấu $ */}
        <div className="shrink-0 text-base text-brand font-bold select-none sm:text-sm">
          $
        </div>
        {/* Input */}
        <input
          id="price"
          type="text"
          name="price"
          placeholder="0.0"
          className="block min-w-0 grow bg-white py-1.5 px-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none  rounded-md sm:text-sm"
        />
        <p className="ml-2 shrink-0 rounded-md mr-2 text-brand font-medium sm:text-sm">
          USD
        </p>
      </div>
    </div>
  );
};

export default InputPrice;
