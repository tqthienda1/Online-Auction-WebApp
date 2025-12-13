import React, { useEffect } from "react";
import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/lib/utils";

const AdminCategoriesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const getCategoriesData = async () => {
      try {
        setIsLoading(true);

        const data = await http.get("categories/tree", {
          signal: controller.signal,
        });

        setCategories(data.data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCategoriesData();
  }, []);

  const categoryColumns = [
    { header: "Category Name", accessor: "name" },
    { header: "Quantity", accessor: "productCount" },
    { header: "Action", accessor: "actions" },
  ];

  const forms = [
    {
      id: "Add Category",
      fields: ["Category"],
    },
    {
      id: "Edit Category",
      fields: ["Category"],
    },
    {
      id: "Add Sub Category",
      fields: ["Sub Category"],
    },
  ];

  const [openForm, setOpenForm] = useState(null);
  const handleAddCategory = async (data) => {
    const controller = new AbortController();

    try {
      setIsLoading(true);

      await http.post(
        "categories/",
        {
          name: data.Category,
          parentID: null,
        },
        { signal: controller.signal }
      );

      const res = await http.get("categories/tree", {
        signal: controller.signal,
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
      setOpenForm(null);
    }
  };

  const handleAddCategoryChild = async (data) => {
    const controller = new AbortController();

    try {
      setIsLoading(true);

      await http.post(
        "categories/",
        {
          name: data["Sub Category"],
          parentID: parent,
        },
        { signal: controller.signal }
      );

      const res = await http.get("categories/tree", {
        signal: controller.signal,
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
      setOpenForm(null);
      setParent(null);
    }
  };

  const handleEditCategory = async (data) => {
    const controller = new AbortController();
    try {
      setIsLoading(true);

      await http.put(
        `/categories/${editingCategory}`,
        {
          name: data.Category,
        },
        { signal: controller.signal }
      );

      const res = await http.get("categories/tree", {
        signal: controller.signal,
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
      setOpenForm(null);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    const controller = new AbortController();

    try {
      setIsLoading(true);

      await http.delete(`/categories/${id}`, {
        signal: controller.signal,
      });

      setCategories((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            categoryChild: c.categoryChild?.filter((child) => child.id !== id),
          }))
      );
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
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <div className="space-y-6 p-6">
          <AdminHeader
            title="Categories"
            description="Manage All Product Categories"
            onAdd={() => {
              setOpenForm("Add Category");
            }}
          />
          <AdminBody
            columns={categoryColumns}
            data={categories}
            onEdit={(category) => {
              setEditingCategory(category);
              setOpenForm("Edit Category");
            }}
            showType="categories"
            onAddChild={() => setOpenForm("Add Sub Category")}
            setParent={setParent}
            onDelete={handleDeleteCategory}
          />

          {openForm && (
            <AdminForm
              categories={categories}
              openForm={openForm}
              forms={forms}
              onClose={() => {
                setOpenForm(null);
                setEditingCategory(null);
              }}
              editingCategory={editingCategory}
              onSubmit={
                openForm === "Add Category"
                  ? handleAddCategory
                  : openForm === "Add Sub Category"
                  ? handleAddCategoryChild
                  : handleEditCategory
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default AdminCategoriesPage;
