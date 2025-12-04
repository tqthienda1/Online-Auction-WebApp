import React from "react";
import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Điện Tử",
      description: "Các sản phẩm điện tử",
      productCount: 245,
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      name: "Quần Áo",
      description: "Quần áo nam nữ",
      productCount: 189,
      createdAt: "2025-01-16",
    },
    {
      id: 3,
      name: "Sách",
      description: "Sách và tài liệu",
      productCount: 56,
      createdAt: "2025-01-18",
    },
  ]);

  const categoryColumns = [
    { header: "Category Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Quantity", accessor: "productCount" },
    { header: "Date Created", accessor: "createdAt" },
    { header: "Action", accessor: "actions" },
  ];

  const forms = [
    {
      id: "Add",
      fields: ["Category", "Category", "Description"],
    },
    {
      id: "Edit",
      fields: ["Category", "Category", "Description"],
    },
  ];

  const [openForm, setOpenForm] = useState(null);
  const onSubmit = async (data) => {
    try {
      console.log("Submit form:", openForm, data);

      setOpenForm(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <AdminHeader
        title="Categories"
        description="Manage All Product Categories"
        onAdd={() => setOpenForm("Add")}
      />
      <AdminBody
        columns={categoryColumns}
        data={categories}
        onEdit={() => setOpenForm("Edit")}
        showAction="1"
      />

      {openForm && (
        <AdminForm
          categories={categories}
          openForm={openForm}
          forms={forms}
          onClose={() => setOpenForm(null)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
