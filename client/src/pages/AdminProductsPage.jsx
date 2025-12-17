import React, { useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
import AdminSearch from "@/components/AdminSearch";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { useState } from "react";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const productColumns = [
    { header: "Product Name", accessor: "productName" },
    { header: "Category", accessor: "category" },
    { header: "Starting Price", accessor: "startingPrice" },
    { header: "Current Price", accessor: "currentPrice" },
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

  useEffect(() => {
    const controller = new AbortController();

    const getProductsData = async () => {
      try {
        setIsLoading(true);

        const data = await http.get("/products", { signal: controller.signal });
        console.log(data.data);

        setProducts(data.data.data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getProductsData();
  }, []);

  const [query, setQuery] = useState("");
  const filteredProducts =
    products?.filter((p) =>
      p.productName.toLowerCase().includes(query.toLowerCase())
    ) || [];

  const handleDeleteProduct = async (id) => {
    const controller = new AbortController();

    console.log(id);

    try {
      setIsLoading(true);
      await http.delete(`/products/${id}`, { signal: controller.signal });

      const tempProducts = products.filter((p) => p.id !== id);

      console.log(tempProducts);

      setProducts(tempProducts);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6 p-6">
          <AdminHeader title="Products" description="Manage All Products" />
          <AdminSearch query={query} setQuery={setQuery} />
          <AdminBody
            columns={productColumns}
            data={filteredProducts}
            onDelete={handleDeleteProduct}
            showType="products"
          />
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
