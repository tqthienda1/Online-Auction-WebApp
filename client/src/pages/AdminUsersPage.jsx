import React, { useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { useState } from "react";
import AdminSearch from "@/components/AdminSearch";
import AdminRequests from "@/components/AdminRequests";
import AdminPagination from "@/components/AdminPagination";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const getUsersData = async () => {
      try {
        setIsLoading(true);

        const [usersData, requestsData] = await Promise.all([
          http.get(`/users?page=${page}&limit=${limit}`, {
            signal: controller.signal,
          }),
          http.get("/upgrade", { signal: controller.signal }),
        ]);
        console.log(requestsData.data);
        setUsers(usersData.data.data.data);
        setTotalPages(usersData.data.data.totalPages);
        setRequests(requestsData);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsersData();
  }, [page]);

  const usersColumns = [
    { header: "User Name", accessor: "username" },
    { header: "Role", accessor: "role" },
    { header: "Positive Rating", accessor: "ratingPos" },
    { header: "Negative Rating", accessor: "ratingNeg" },
    { header: "DOB", accessor: "dob" },
    { header: "Address", accessor: "address" },
  ];

  const [query, setQuery] = useState("");
  const filteredUsers =
    users?.filter((u) =>
      u.username.toLowerCase().includes(query.toLowerCase())
    ) || [];

  const upgradeRequests = [];
  const [approveDialog, setApproveDialog] = useState(null);

  const handleApprove = (id) => {
    console.log("Approved:", id);
    setApproveDialog(null);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
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
          <AdminHeader title="Users" description="Manage All Users" />
          <AdminRequests
            upgradeRequests={upgradeRequests}
            approveDialog={approveDialog}
            setApproveDialog={setApproveDialog}
            onConfirmApprove={handleApprove}
            onReject={handleReject}
          />
          <AdminSearch query={query} setQuery={setQuery} />
          <AdminBody
            showType="users"
            columns={usersColumns}
            data={filteredUsers}
          />
          <AdminPagination
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;
