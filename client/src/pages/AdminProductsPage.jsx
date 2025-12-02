import React from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
import AdminSearch from "@/components/AdminSearch";

import { useState } from "react";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Laptop Dell XPS 15",
      category: "Điện Tử",
      startingPrice: 35000000,
      status: "active",
      createdAt: "2025-01-20",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      category: "Điện Tử",
      startingPrice: 28000000,
      status: "active",
      createdAt: "2025-01-19",
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      category: "Điện Tử",
      startingPrice: 10000000,
      status: "ended",
      createdAt: "2025-01-18",
    },
  ]);

  const productColumns = [
    { header: "Product Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Starting Price", accessor: "startingPrice" },
    { header: "Date Created", accessor: "createdAt" },
    { header: "Action", accessor: "actions" },
  ];

  const forms = [
    {
      id: "Add",
      fields: ["Product Name", "Category", "Starting Price"],
    },
    {
      id: "Edit",
      fields: ["Product Name", "Category", "Starting Price"],
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

  const [query, setQuery] = useState("");
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <AdminHeader
        title="Products"
        description="Manage All Products"
        onAdd={() => setOpenForm("Add")}
      />
      <AdminSearch query={query} setQuery={setQuery} />
      <AdminBody
        columns={productColumns}
        data={filteredProducts}
        onEdit={() => setOpenForm("Edit")}
        showAction="1"
      />

      {openForm && (
        <AdminForm
          openForm={openForm}
          forms={forms}
          onClose={() => setOpenForm(null)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
