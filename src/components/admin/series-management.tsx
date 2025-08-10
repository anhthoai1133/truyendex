"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  createSeries,
  getSeriesList,
  getSeries,
  updateSeries,
  deleteSeries,
  type CreateSeriesData,
  type SeriesData,
} from "@/api/core/admin";
import { Utils } from "@/utils";
import Iconify from "@/components/iconify";
// Nettrom UI
import { Button } from "@/components/nettrom/Button";
import Input from "@/components/nettrom/input";
import Pagination from "@/components/nettrom/Pagination";

function toTagsArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return arr.length ? arr : undefined;
  }
  return undefined;
}

export default function AdminSeriesManagement() {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SeriesData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSeriesData>();

  const loadSeries = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await getSeriesList({ page, limit: 10, search });
      setSeries(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách truyện");
      Utils.Error.handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload: CreateSeriesData = {
        title: data.title,
        description: data.description || undefined,
        author: data.author || undefined,
        artist: data.artist || undefined,
        status: data.status || "ongoing",
        year: typeof data.year === "number" ? data.year : undefined,
        contentRating: data.contentRating || "safe",
        tags: toTagsArray(data.tags),
        coverImage: data.coverImage || undefined,
        externalId: data.externalId || undefined,
      };

      if (editingSeries) {
        await updateSeries(editingSeries.uuid, payload);
        toast.success("Cập nhật truyện thành công!");
      } else {
        await createSeries(payload);
        toast.success("Tạo truyện thành công!");
      }
      reset();
      setEditingSeries(null);
      setShowForm(false);
      loadSeries(currentPage, searchTerm);
    } catch (error) {
      toast.error(editingSeries ? "Lỗi khi cập nhật truyện" : "Lỗi khi tạo truyện");
      Utils.Error.handleError(error);
    }
  };

  const handleEdit = async (seriesUuid: string) => {
    try {
      const seriesData = await getSeries(seriesUuid);
      setEditingSeries(seriesData);
      reset(seriesData as any);
      setShowForm(true);
    } catch (error) {
      toast.error("Lỗi khi tải thông tin truyện");
      Utils.Error.handleError(error);
    }
  };

  const handleDelete = async (seriesUuid: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa truyện "${title}"?`)) return;

    try {
      await deleteSeries(seriesUuid);
      toast.success("Xóa truyện thành công!");
      loadSeries(currentPage, searchTerm);
    } catch (error) {
      toast.error("Lỗi khi xóa truyện");
      Utils.Error.handleError(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-web-title">Quản lý Truyện</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Quản trị hệ thống TruyenDex
          </p>
        </div>
        <Button
          icon={<Iconify icon="mdi:plus" />}
          onClick={() => {
            setEditingSeries(null);
            reset({} as any);
            setShowForm(true);
          }}
        >
          Thêm Truyện
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            icon={<Iconify icon="mdi:magnify" />}
            placeholder="Tìm kiếm truyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          />
        </div>
        <Button variant="outline" onClick={() => loadSeries(1, searchTerm)}>
          Tìm kiếm
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingSeries ? "Cập nhật Truyện" : "Thêm Truyện Mới"}
            </h3>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              <Iconify icon="mdi:close" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Tên truyện *</label>
                <Input {...register("title", { required: "Tên truyện là bắt buộc" })} />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Tác giả</label>
                <Input {...register("author")} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Họa sĩ</label>
                <Input {...register("artist")} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Năm</label>
                <Input type="number" {...register("year", { valueAsNumber: true })} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Trạng thái</label>
                <select
                  {...register("status")}
                  className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 p-3 leading-[21px] focus:border-purple-500 focus:ring-purple-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                >
                  <option value="ongoing">Đang tiến hành</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="hiatus">Tạm ngưng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Độ tuổi</label>
                <select
                  {...register("contentRating")}
                  className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 p-3 leading-[21px] focus:border-purple-500 focus:ring-purple-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                >
                  <option value="safe">An toàn</option>
                  <option value="suggestive">Gợi cảm</option>
                  <option value="erotica">Người lớn</option>
                  <option value="pornographic">Khiêu dâm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Mô tả</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 p-3 leading-[21px] focus:border-purple-500 focus:ring-purple-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Tags (phân cách bằng dấu phẩy)</label>
              <Input {...register("tags" as any)} placeholder="action, adventure, comedy" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Ảnh bìa URL</label>
                <Input type="url" {...register("coverImage")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">MangaDex ID</label>
                <Input {...register("externalId")} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : editingSeries ? "Cập nhật" : "Tạo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingSeries(null);
                  reset();
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Series List */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow dark:border-neutral-700 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-neutral-100 text-left text-xs uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-3">Truyện</th>
                <th className="px-6 py-3">Tác giả</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Thống kê</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-neutral-500">
                    Đang tải...
                  </td>
                </tr>
              ) : series.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-neutral-500">
                    Không có truyện nào
                  </td>
                </tr>
              ) : (
                series.map((item) => (
                  <tr key={item.uuid} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.coverImage && (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {item.title}
                          </div>
                          {item.year && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">Năm {item.year}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                      {item.author || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " +
                          (item.status === "ongoing"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : item.status === "completed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : item.status === "hiatus"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300")
                        }
                      >
                        {item.status === "ongoing"
                          ? "Đang tiến hành"
                          : item.status === "completed"
                          ? "Hoàn thành"
                          : item.status === "hiatus"
                          ? "Tạm ngưng"
                          : "Đã hủy"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                      <div className="flex flex-col gap-1">
                        <div>👁️ {item.viewCount}</div>
                        <div>❤️ {item.followCount}</div>
                        <div>💬 {item.commentCount}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleEdit(item.uuid)}>
                          <Iconify icon="mdi:pencil" />
                        </Button>
                        <Button variant="outline" onClick={() => handleDelete(item.uuid, item.title)}>
                          <Iconify icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          pageCount={totalPages}
          forcePage={currentPage - 1}
          onPageChange={(p) => loadSeries(p.selected + 1, searchTerm)}
        />
      </div>
    </div>
  );
}
