const InputPrice = ({ value, onChange }) => {
  const handleChange = (e) => {
    const raw = e.target.value;

    if (/^\d*$/.test(raw)) {
      onChange(raw);
    }
  };

  return (
    <div className="flex items-center rounded-xs border border-gray-300 bg-white pl-3">
      <div className="shrink-0 text-base text-brand font-bold select-none sm:text-sm">
        $
      </div>
      <input
        id="price"
        type="text"
        name="price"
        placeholder="0.0"
        value={value}
        onChange={handleChange}
        className="block min-w-0 grow bg-white py-1.5 px-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none  rounded-md sm:text-sm"
      />
      <p className="ml-2 shrink-0 rounded-md mr-2 text-brand font-medium sm:text-sm">
        USD
      </p>
    </div>
  );
};

export default InputPrice;
