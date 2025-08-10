"use client";

import { useState } from "react";
import { useTopSeries } from "@/hooks/core/useTopSeries";
import Iconify from "@/components/iconify";
import { Button } from "@/components/nettrom/Button";
import MangaTile from "@/components/nettrom/manga-tile";

export default function TopTitles({ groupId }: { groupId?: string }) {
  const [activeTab, setActiveTab] = useState<'top' | 'favorite' | 'new'>('top');
  const [range, setRange] = useState<'day' | 'week' | 'month'>('month');
  
  const {
    data: topData,
    isLoading: topLoading,
    error: topError,
  } = useTopSeries('follows', 7, range);

  const {
    data: favoriteData,
    isLoading: favoriteLoading,
    error: favoriteError,
  } = useTopSeries('rating', 7, range);

  const {
    data: newData,
    isLoading: newLoading,
    error: newError,
  } = useTopSeries('new', 7, range);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'top':
        return { data: topData, isLoading: topLoading, error: topError };
      case 'favorite':
        return { data: favoriteData, isLoading: favoriteLoading, error: favoriteError };
      case 'new':
        return { data: newData, isLoading: newLoading, error: newError };
      default:
        return { data: topData, isLoading: topLoading, error: topError };
    }
  };

  const { data, isLoading, error } = getCurrentData();
  const topMangaList = data?.data || [];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Bảng xếp hạng</h3>
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'top' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('top')}
          >
            Top
          </Button>
          <Button
            variant={activeTab === 'favorite' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('favorite')}
          >
            Yêu thích
          </Button>
          <Button
            variant={activeTab === 'new' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('new')}
          >
            Mới
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant={range === 'day' ? 'default' : 'secondary'} size="sm" onClick={() => setRange('day')}>Ngày</Button>
          <Button variant={range === 'week' ? 'default' : 'secondary'} size="sm" onClick={() => setRange('week')}>Tuần</Button>
          <Button variant={range === 'month' ? 'default' : 'secondary'} size="sm" onClick={() => setRange('month')}>Tháng</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          Không thể tải dữ liệu
        </div>
      ) : (
        <div className="space-y-3">
          {topMangaList.map((manga: any, index: number) => (
            <div key={manga.id} className="flex items-center gap-3">
              <div className="w-12 h-16 relative">
                <img
                  src={manga.coverImage}
                  alt={manga.title}
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {manga.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {activeTab === 'top' && (
                    <span className="flex items-center gap-1">
                      <Iconify icon="mdi:heart" />
                      {manga.followCount}
                    </span>
                  )}
                  {activeTab === 'favorite' && (
                    <span className="flex items-center gap-1">
                      <Iconify icon="mdi:star" />
                      {manga.rating}
                    </span>
                  )}
                  {activeTab === 'new' && (
                    <span className="flex items-center gap-1">
                      <Iconify icon="mdi:clock" />
                      {new Date(manga.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
