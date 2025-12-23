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
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [query, setQuery] = useState("");

  // Helper tính toán rating
  const calculateRating = (user) => {
    if (!user) return "-";
    const pos = user.ratingPos ?? 0;
    const neg = user.ratingNeg ?? 0;
    const total = pos + neg;
    if (total === 0) return "-";
    const score = Math.round((pos / total) * 5);
    return `${score}/5`;
  };

  // Fetch danh sách Upgrade Requests
  const fetchUpgradeRequests = async () => {
  try {
    const res = await http.get("/upgrade?status=PENDING");
    
    // Kiểm tra log này để xem cấu trúc API trả về chính xác là gì
    console.log("API Upgrade Response:", res.data);

    // Xử lý linh hoạt các trường hợp: res.data trực tiếp là array hoặc nằm trong res.data.data
    let rawData = [];
    if (Array.isArray(res.data)) {
      rawData = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      rawData = res.data.data;
    } else if (res.data?.requests) { // Tùy theo backend của bạn
      rawData = res.data.requests;
    }

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

  // Fetch dữ liệu Users và Requests khi đổi trang
  useEffect(() => {
  const controller = new AbortController();
  
  const getData = async () => {
    try {
      setIsLoading(true);
      
      // Chạy cả 2 request song song
      const [usersRes] = await Promise.all([
        http.get(`/user?page=${page}&limit=${limit}`, { signal: controller.signal }),
        fetchUpgradeRequests() // Hàm này tự setUpgradeRequests bên trong rồi
      ]);

      // Kiểm tra dữ liệu user
      if (usersRes.data?.data) {
        setUsers(usersRes.data.data.data || []);
        setTotalPages(usersRes.data.data.totalPages || 1);
      }
    } catch (error) {
      if (error.name !== "CanceledError") {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  getData();
  return () => controller.abort();
}, [page, limit]);

  // Logic xử lý Approve/Reject
  const onConfirmApprove = async (id) => {
    try {
      await http.post(`/upgrade/${id}/approve`);
      setDialog({ type: null, userId: null });
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== id));
      // Có thể fetch lại danh sách user nếu role thay đổi
    } catch (err) {
      console.error("Approve failed", err);
      alert("Failed to approve upgrade request");
    }
  };

  const onConfirmReject = async (id) => {
    try {
      await http.post(`/upgrade/${id}/reject`);
      setDialog({ type: null, userId: null });
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Reject failed", err);
      alert("Failed to reject upgrade request");
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

  const filteredUsers = users?.filter((u) =>
    u.username?.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading...</h3>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-6 p-6">
          <AdminHeader title="Users" description="Manage All Users" />
          
          <AdminRequests
            upgradeRequests={upgradeRequests}
            dialog={dialog}
            setDialog={setDialog}
            onConfirmApprove={onConfirmApprove}
            onConfirmReject={onConfirmReject}
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
      
      {error && <div className="p-6 text-red-500 text-center">Error loading data.</div>}
    </>
  );
};

export default AdminUsersPage;