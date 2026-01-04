import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";
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
  const [openForm, setOpenForm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingData, setEditingData] = useState({});

  // isLoading khởi tạo là true để chặn render nội dung khi F5
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
        // expose raw counts for UI
        ratingPos: r.user?.ratingPos ?? 0,
        ratingNeg: r.user?.ratingNeg ?? 0,
        // keep aggregated value for backward compatibility
        rating: calculateRating(r.user),
        status: r.status,
      }));
      setUpgradeRequests(transformedRequests);
    } catch (err) {
      console.error("Failed to fetch upgrade requests", err);
    }
  };

  const forms = [
    { id: "Edit User", fields: ["Username", "Role", "DOB", "Address"] },
  ];

  // Add user removed: admin can only update or delete users here.

  const handleEditUser = async (data) => {
    try {
      setIsProcessing(true);
      const payload = {
        username: data.Username,
        role: data.Role,
        dob: data.DOB,
        address: data.Address,
      };

      await http.put(`/user/${editingUser}`, payload);
      const res = await http.get(`/user?page=${page}&limit=${limit}`);
      if (res.data?.data) {
        setUsers(res.data.data.data || []);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Edit user failed", err);
    } finally {
      setIsProcessing(false);
      setOpenForm(null);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setIsProcessing(true);
      await http.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      // Ép trạng thái loading về true ngay khi hàm chạy (dành cho chuyển page)
      setIsLoading(true);
      setError(null);

      try {
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
        // Chỉ tắt loading khi dữ liệu đã thực sự được set vào state
        setIsLoading(false);
      }
    };

    getData();
    return () => controller.abort();
  }, [page, limit]);

  // Logic filter giữ nguyên
  const filteredUsers = users?.filter((u) => u.username?.toLowerCase().includes(query.toLowerCase())) || [];

  const handleConfirmApprove = async (requestId) => {
    try {
      setIsProcessing(true);
      console.log("Approving request ID:", requestId);
      const res = await http.post(`/upgrade/${requestId}/approve`);
      console.log("Approve response:", res);
      
      // Cập nhật danh sách upgrade requests
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== requestId));
      setDialog({ type: null, userId: null });
    } catch (err) {
      console.error("Approve upgrade request failed", err);
      alert("Failed to approve upgrade request: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async (requestId) => {
    try {
      setIsProcessing(true);
      await http.post(`/upgrade/${requestId}/reject`);
      
      // Cập nhật danh sách upgrade requests
      setUpgradeRequests((prev) => prev.filter((r) => r.id !== requestId));
      setDialog({ type: null, userId: null });
    } catch (err) {
      console.error("Reject upgrade request failed", err);
      alert("Failed to reject upgrade request");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
          <AdminHeader title="Users" description="Manage All Users" />

      <AdminRequests
        upgradeRequests={upgradeRequests}
        dialog={dialog}
        setDialog={setDialog}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
        isProcessing={isProcessing}
      />

      <AdminSearch query={query} setQuery={setQuery} />

      <div className="relative border rounded-xl overflow-hidden bg-white shadow-sm min-h-[400px]">
        {/* LỚP PHỦ LOADING: Hiện khi isLoading = true */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-30 transition-all">
            <Spinner className="size-10 text-yellow-500" />
            <p className="mt-4 font-bold text-gray-500 animate-pulse">Loading users...</p>
          </div>
        )}

        {/* NỘI DUNG CHÍNH */}
        {error ? (
          <div className="flex flex-col items-center justify-center h-80 text-red-500">
            <p className="font-semibold">Error loading users.</p>
            <button onClick={() => window.location.reload()} className="underline mt-2">Retry</button>
          </div>
        ) : (
          <div className={`${isLoading ? "invisible" : "visible"} transition-all`}>
            <AdminBody
              showType="users"
              columns={[
                { header: "User Name", accessor: "username" },
                { header: "Role", accessor: "role" },
                { header: "Positive Rating", accessor: "ratingPos" },
                { header: "Negative Rating", accessor: "ratingNeg" },
                { header: "DOB", accessor: "dob" },
                { header: "Address", accessor: "address" },
                { header: "Action", accessor: "actions" },
              ]}
              data={filteredUsers}
              onEdit={(id) => {
                const user = users.find((u) => u.id === id) || {};
                setEditingUser(id);
                setEditingData({
                  Username: user.username || "",
                  Role: user.role || "",
                  DOB: user.dob || "",
                  Address: user.address || "",
                });
                setOpenForm("Edit User");
              }}
              onDelete={handleDeleteUser}
            />
            <div className="p-4 border-t">
              <AdminPagination
                totalPages={totalPages}
                page={page}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>

      {openForm === "Edit User" && (
        <AdminForm
          forms={forms}
          openForm={openForm}
          onClose={() => {
            setOpenForm(null);
            setEditingUser(null);
            setEditingData({});
          }}
          editingCategory={editingUser}
          initialValues={editingData}
          onSubmit={handleEditUser}
        />
      )}

      {isProcessing && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50">
          <Spinner className="size-4" /> Processing...
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;