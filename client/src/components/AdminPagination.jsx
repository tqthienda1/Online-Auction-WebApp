import React from "react";

const AdminPagination = ({ totalPages, page, onPageChange }) => {
  const getPagination = (current, total) => {
    const delta = 2;
    const range = [];
    const result = [];
    let last;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (last) {
        if (i - last === 2) {
          result.push(last + 1);
        } else if (i - last > 2) {
          result.push("...");
        }
      }
      result.push(i);
      last = i;
    }

    return result;
  };

  return (
    <div className="flex gap-2 mt-4 justify-center items-center">
      {getPagination(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={
              page === p
                ? "font-bold border rounded-lg bg-yellow-400 px-2"
                : "px-2 hover:bg-yellow-400 rounded-lg border"
            }
          >
            {p}
          </button>
        )
      )}
    </div>
  );
};

export default AdminPagination;
