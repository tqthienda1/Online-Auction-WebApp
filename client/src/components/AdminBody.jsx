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
                  className="hover:bg-gray-100 font-semibold border-b cursor-pointer"
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
                            onClick={() => {
                              onEdit(parent.id);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setParent(parent.id);
                              onDelete(parent.id);
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
                        className="bg-gray-50 hover:bg-gray-100 border-b"
                      >
                        {columns.map((col) => (
                          <td key={col.accessor} className="p-3">
                            {col.accessor === "name" ? (
                              <div className="pl-8 text-left">{child.name}</div>
                            ) : col.accessor === "totalProducts" ? (
                              child.totalProducts
                            ) : col.accessor === "actions" ? (
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setParent(parent.id);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => onDelete(child.id)}
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
                          className="flex items-center text-brand hover:text-yellow-400 cursor-pointer"
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
                      {/* {col.accessor === "name" ? (
                        <div className="flex items-center justify-center">
                          {product.productName}
                        </div>
                      ) : col.accessor === "category" ? (
                        product.categoryID
                      ) : */}
                      {col.accessor === "actions" ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              onDelete(product.id);
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
      </table>
    </div>
  );
};

export default AdminBody;
