import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import AdminSearch from "@/components/AdminSearch";
import AdminRequests from "@/components/AdminRequests";
import AdminPagination from "@/components/AdminPagination";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [dialog, setDialog] = useState({ type: null, userId: null });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");

  const calculateRating = (user) => {
    if (!user) return "-";
    const pos = user.ratingPos ?? 0;
    const neg = user.ratingNeg ?? 0;
    const total = pos + neg;
    if (total === 0) return "-";
    const score = Math.round((pos / total) * 5);
    return `${score}/5`;
  };

  const fetchUpgradeRequests = async () => {
    try {
      const res = await http.get("/upgrade?status=PENDING");
      let rawData = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.requests || []);
      
      const transformedRequests = rawData.map((r) => ({
        id: r.id || r._id,
        userId: r.userID || r.user?._id,
        name: r.user?.username || r.user?.name || "Unknown",
        rating: calculateRating(r.user),
        status: r.status,
      }));
      setUpgradeRequests(transformedRequests);
    } catch (err) {
      console.error("Failed to fetch upgrade requests", err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        setIsLoading(true);
        const [usersRes] = await Promise.all([
          http.get(`/user?page=${page}&limit=${limit}`, { signal: controller.signal }),
          fetchUpgradeRequests(),
        ]);

        if (usersRes.data?.data) {
          setUsers(usersRes.data.data.data || []);
          setTotalPages(usersRes.data.data.totalPages || 1);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getData();
    return () => controller.abort();
  }, [page, limit]);

  const onConfirmApprove = async (id) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await http.post(`/upgrade/${id}/approve`);
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== id));
      setDialog({ type: null, userId: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setIsProcessing(false);
    }
  };

  const onConfirmReject = async (id) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await http.post(`/upgrade/${id}/reject`);
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== id));
      setDialog({ type: null, userId: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

  const usersColumns = [
    { header: "User Name", accessor: "username" },
    { header: "Role", accessor: "role" },
    { header: "Positive Rating", accessor: "ratingPos" },
    { header: "Negative Rating", accessor: "ratingNeg" },
    { header: "DOB", accessor: "dob" },
    { header: "Address", accessor: "address" },
  ];

  const filteredUsers = users?.filter((u) => u.username?.toLowerCase().includes(query.toLowerCase())) || [];

  return (
    <div className="space-y-6 p-6">
      {/* 1. Header luôn hiển thị */}
      <AdminHeader title="Users" description="Manage All Users" />

      {/* 2. Upgrade Requests luôn hiển thị (có danh sách hoặc thông báo trống) */}
      <AdminRequests
        upgradeRequests={upgradeRequests}
        dialog={dialog}
        setDialog={setDialog}
        onConfirmApprove={onConfirmApprove}
        onConfirmReject={onConfirmReject}
        isProcessing={isProcessing}
      />

      {/* 3. Khu vực tìm kiếm */}
      <AdminSearch query={query} setQuery={setQuery} />

      {/* 4. Khu vực Bảng dữ liệu User (Nơi xử lý loading chuẩn) */}
      <div className="relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
            <Spinner className="size-8 text-yellow-500" />
            <p className="mt-4 font-medium text-gray-500">Updating User List...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-red-500">
            <p>Error loading users.</p>
            <button onClick={() => window.location.reload()} className="underline mt-2">Retry</button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* 5. Toast thông báo xử lý ngầm */}
      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
          <Spinner className="size-4" />
          Processing request...
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;