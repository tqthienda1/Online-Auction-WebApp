import React, { useEffect } from "react";
import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/lib/utils";
import AdminPagination from "@/components/AdminPagination";
import DeleteWarning from "@/components/DeleteWarning";

const AdminCategoriesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const getCategoriesData = async () => {
      try {
        setIsLoading(true);

        const data = await http.get(
          `categories/categories?page=${page}&limit=${limit}`,
          {}
        );

        console.log(data.data.data.data);
        setCategories(data.data.data.data);
        setTotalPages(data.data.data.totalPages);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCategoriesData();

    return () => controller.abort();
  }, [page]);

  const categoryColumns = [
    { header: "Category Name", accessor: "name" },
    { header: "Quantity", accessor: "total" },
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
      setCategories(res.data.data);
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
      setCategories(res.data.data);
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
    try {
      setIsLoading(true);
      setDeleteError(null);

      await http.delete(`/categories/${id}`);

      setCategories((prev) =>
        prev
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            categoryChild: c.categoryChild?.filter((child) => child.id !== id),
          }))
      );

      setConfirm(null);
    } catch (error) {
      const code = error?.response?.data?.code;

      if (code === "CATEGORY_HAS_CHILDREN") {
        setDeleteError(
          "This category cannot be deleted because it has subcategories."
        );
      }

      if (code === "CATEGORY_HAS_PRODUCTS") {
        setDeleteError(
          "This category cannot be deleted because it has products."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDeleteError(null);
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
          <AdminPagination
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
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

          {deleteError && (
            <DeleteWarning content={deleteError} onCancel={handleCancel} />
          )}
        </div>
      )}
    </>
  );
};

export default AdminCategoriesPage;
