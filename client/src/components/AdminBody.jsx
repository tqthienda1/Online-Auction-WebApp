import React from "react";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";

const AdminBody = ({ columns, data, onEdit, onDelete, showAction }) => {
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

        <tbody className="text-center">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 border-b">
              {columns.map((col) => (
                <td key={col.accessor} className="p-3">
                  {col.accessor === "actions" ? (
                    showAction === "1" ? (
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    )
                  ) : (
                    row[col.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBody;
