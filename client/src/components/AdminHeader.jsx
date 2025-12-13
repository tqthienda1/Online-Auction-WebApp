import React from "react";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";
const AdminHeader = ({ title, description, onAdd }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400 ">
          {title} Management
        </h1>
        <p className="text-muted-brand">{description}</p>
      </div>
      {onAdd && (
        <Button
          onClick={() => onAdd()}
          className="gap-2 cursor-pointer bg-yellow-400 text-white hover:bg-yellow-500"
        >
          <Plus className="h-4 w-4 " />
          Add {title}
        </Button>
      )}
    </div>
  );
};

export default AdminHeader;
