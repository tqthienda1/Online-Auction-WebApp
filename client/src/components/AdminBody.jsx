import React from "react";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
import { TiPlus } from "react-icons/ti";

const AdminBody = ({
  columns,
  data,
  onEdit,
  onDelete,
  showType,
  onAddChild,
  setParent,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const countTotal = (parent = []) =>
    parent.reduce((sum, item) => sum + (item.total ?? 0), 0);

  const [confirm, setConfirm] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="text-center">
          <tr className="hover:bg-gray-50 border-b">
            {columns.map((col) => (
              <th key={col.accessor} className="px-3 py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {showType == "categories" && (
          <tbody className="text-center">
            {data.map((parent) => (
              <React.Fragment key={parent.id}>
                <tr
                  className="hover:bg-gray-100 font-semibold border-b cursor-pointer relative"
                  onClick={() => toggleRow(parent.id)}
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className="p-3">
                      {col.accessor === "name" ? (
                        showType == "categories" ? (
                          <div className="flex items-center relative">
                            <span className="absolute">
                              {expandedRows[parent.id] ? (
                                <GoTriangleDown className="text-lg" />
                              ) : (
                                <GoTriangleRight className="text-lg" />
                              )}
                            </span>
                            <div className="flex items-center justify-center w-full">
                              {parent.name}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            {parent.name}
                          </div>
                        )
                      ) : col.accessor === "totalProducts" ? (
                        parent.totalProducts
                      ) : col.accessor === "actions" ? (
                        <div
                          className="flex gap-2 justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(parent.id);
                            }}
                            className="cursor-pointer hover:text-yellow-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setParent(parent.id);
                              setConfirm(parent.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        parent[col.accessor]
                      )}
                    </td>
                  ))}
                </tr>

                {expandedRows[parent.id] && (
                  <>
                    {parent.categoryChild?.map((child) => (
                      <tr
                        key={child.id}
                        className="bg-gray-50 hover:bg-gray-100 border-b w-full"
                      >
                        {columns.map((col) => (
                          <td key={col.accessor} className="p-3">
                            {col.accessor === "name" ? (
                              <div className="pl-8 text-left font-semibold">
                                {child.name}
                              </div>
                            ) : col.accessor === "totalProducts" ? (
                              child.totalProducts
                            ) : col.accessor === "actions" ? (
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    setParent(parent.id);
                                    onEdit(child.id);
                                  }}
                                  className="cursor-pointer hover:text-yellow-400"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive cursor-pointer"
                                  onClick={(e) => {
                                    setConfirm(child.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              child[col.accessor]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    <tr className="hover:bg-gray-50 bg-white">
                      <td
                        colSpan={columns.length}
                        className="p-3 pl-8 text-left"
                      >
                        <button
                          onClick={() => {
                            onAddChild();
                            setParent(parent.id);
                          }}
                          className="flex items-center text-brand hover:text-yellow-400 cursor-pointer font-thin"
                        >
                          <TiPlus className="mr-1 text-lg text-yellow-400" />
                          Add sub category
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        )}

        {showType == "products" && (
          <tbody className="text-center">
            {data.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-gray-100 font-semibold border-b cursor-pointer">
                  {columns.map((col) => (
                    <td key={col.accessor} className="p-3">
                      {col.accessor === "actions" ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setConfirm(product.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        product[col.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        )}

        {showType == "users" && (
          <tbody className="text-center">
            {data.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-100 font-semibold border-b cursor-pointer">
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className="p-3 max-w-[250px] wrap-break-word"
                    >
                      {col.accessor === "actions" ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEdit) onEdit(user.id);
                            }}
                            className="cursor-pointer hover:text-yellow-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDelete) onDelete(user.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        user[col.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        )}
      </table>
      {confirm && (
        <div className="p-3 fixed inset-0 flex items-center justify-center bg-black/50">
          <form className="bg-gray-100 p-5 border rounded-lg">
            <div className="flex flex-col justify-center items-center gap-5">
              <span className="font-bold text-lg">
                Are you sure you want to remove this?
              </span>
              <div className="flex gap-3 justify-between items-center">
                <button
                  onClick={() => onDelete(confirm)}
                  className="text-while font-bold bg-yellow-400 hover:bg-yellow-500 cursor-pointer px-3 py-1 border rounded-lg w-25"
                >
                  Remove
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  className="text-while font-bold bg-gray-300 hover:bg-gray-400 cursor-pointer px-3 py-1 border rounded-lg w-25"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminBody;
