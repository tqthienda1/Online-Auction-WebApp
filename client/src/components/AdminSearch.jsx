import React from "react";
import { Search } from "lucide-react";

const AdminSearch = ({ setQuery, query }) => {
  return (
    <div className="flex items-center justify-start mb-6 mt-6 gap-2">
      <Search className="text-2xl" />
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-2 py-1 rounded-lg w-1/5"
      />
    </div>
  );
};

export default AdminSearch;
