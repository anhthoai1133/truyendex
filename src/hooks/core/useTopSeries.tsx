import useSWR from "swr";
import * as SeriesApi from "@/api/core/series";

export interface BackendSeries {
  uuid: string;
  title: Record<string, string>; // LocalizedString từ backend
  description?: Record<string, string>;
  coverImage?: string;
  status: string;
  contentRating: string;
  followCount: number;
  viewCount: number;
  commentCount: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopSeriesResponse {
  data: BackendSeries[];
  total: number;
}

export const useTopSeries = (
  type: 'follows' | 'rating' | 'new' = 'follows',
  limit: number = 7,
  range?: 'day' | 'week' | 'month'
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [`/api/series/top`, type, limit, range],
    async () => {
      return await SeriesApi.getTopSeries(type, limit, range);
    }
  );

  return {
    seriesList: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
};

// Helper functions để convert data format tương tự MangaDex
export const convertBackendSeriesToMangaFormat = (series: BackendSeries) => {
  return {
    id: series.uuid,
    type: 'manga',
    attributes: {
      title: series.title,
      description: series.description,
      status: series.status,
      contentRating: series.contentRating,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    },
    relationships: series.coverImage ? [{
      type: 'cover_art',
      attributes: {
        fileName: series.coverImage
      }
    }] : [],
    // Thêm thống kê
    statistics: {
      follows: series.followCount,
      rating: {
        bayesian: series.rating || 0
      }
    }
  };
};