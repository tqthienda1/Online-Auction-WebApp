import React from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminBody from "@/components/AdminBody";
import AdminForm from "@/components/AdminForm";

import { useState } from "react";
import AdminSearch from "@/components/AdminSearch";
import AdminRequests from "@/components/AdminRequests";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@example.com",
      role: "seller",
      joinDate: "2024-12-15",
      rating: 4.8,
      status: "active",
      upgradeRequest: false,
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@example.com",
      role: "user",
      joinDate: "2025-01-10",
      rating: 4.5,
      status: "active",
      upgradeRequest: true,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      email: "vanc@example.com",
      role: "user",
      joinDate: "2025-01-15",
      rating: 3.2,
      status: "active",
      upgradeRequest: true,
    },
    {
      id: 4,
      name: "Lê Thị D",
      email: "thid@example.com",
      role: "seller",
      joinDate: "2024-11-20",
      rating: 4.9,
      status: "active",
      upgradeRequest: false,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "vane@example.com",
      role: "user",
      joinDate: "2025-01-05",
      rating: 2.1,
      status: "inactive",
      upgradeRequest: false,
    },
  ]);

  const usersColumns = [
    { header: "User", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Rating", accessor: "status" },
    { header: "Registered Date", accessor: "joinDate" },
    { header: "Action", accessor: "actions" },
  ];

  const [query, setQuery] = useState("");
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  const upgradeRequests = users.filter((u) => u.upgradeRequest);
  const [approveDialog, setApproveDialog] = useState(null);

  const handleApprove = (id) => {
    console.log("Approved:", id);
    setApproveDialog(null);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
  };
  return (
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
      <AdminBody columns={usersColumns} data={filteredUsers} />
    </div>
  );
};

export default AdminUsersPage;
