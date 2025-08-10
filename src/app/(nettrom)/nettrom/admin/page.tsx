"use client";

import { useAuth } from "@/hooks/useAuth";
import { Constants } from "@/constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSeriesManagement from "@/components/admin/series-management";
import { Button } from "@/components/nettrom/Button";
import Iconify from "@/components/iconify";

export default function NettromAdminPage() {
  const { user } = useAuth({
    middleware: "auth",
    redirectIfNotAuthenticated: Constants.Routes.login,
  });
  const router = useRouter();

  useEffect(() => {
    if (user && !user.display_roles.includes(Constants.Roles.ADMIN)) {
      router.push(Constants.Routes.dashboard.index);
    }
  }, [user, router]);

  if (!user || !user.display_roles.includes(Constants.Roles.ADMIN)) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          icon={<Iconify icon="mdi:home" />}
          onClick={() => router.push(Constants.Routes.nettrom.index)}
        >
          Về trang chủ
        </Button>
      </div>
      <AdminSeriesManagement />
    </section>
  );
}
