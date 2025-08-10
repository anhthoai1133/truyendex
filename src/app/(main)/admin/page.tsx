"use client";

import { useAuth } from "@/hooks/useAuth";
import { Constants } from "@/constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSeriesManagement from "@/components/admin/series-management";
import { Button } from "@/components/nettrom/Button";
import Iconify from "@/components/iconify";

export default function AdminPage() {
  const { user } = useAuth({
    middleware: "auth",
    redirectIfNotAuthenticated: Constants.Routes.login,
  });
  const router = useRouter();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (user && !user.display_roles.includes(Constants.Roles.ADMIN)) {
      router.push(Constants.Routes.dashboard.index);
    }
  }, [user, router]);

  if (!user || !user.display_roles.includes(Constants.Roles.ADMIN)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Không có quyền truy cập</h1>
          <p className="text-gray-600">Bạn cần quyền admin để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Quản lý hệ thống TruyenDex</p>
        </div>
        <Button
          variant="outline"
          icon={<Iconify icon="mdi:home" />}
          onClick={() => router.push(Constants.Routes.nettrom.index)}
        >
          Về trang chủ
        </Button>
      </div>

      <AdminSeriesManagement />
    </div>
  );
}
