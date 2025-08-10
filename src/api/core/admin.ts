import { axios } from "./axios";

// Types
export interface CreateSeriesData {
  title: string;
  description?: string;
  author?: string;
  artist?: string;
  status?: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  year?: number;
  contentRating?: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
  tags?: string[];
  coverImage?: string;
  externalId?: string;
}

export interface UpdateSeriesData extends Partial<CreateSeriesData> {}

export interface SeriesData {
  id: number;
  uuid: string;
  title: string;
  description?: string;
  author?: string;
  artist?: string;
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  year?: number;
  contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
  tags: string[];
  coverImage?: string;
  externalId?: string;
  viewCount: number;
  followCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesListResponse {
  data: SeriesData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Functions
export const createSeries = async (data: CreateSeriesData) => {
  const response = await axios<SeriesData>({
    method: "POST",
    url: "/api/series",
    data,
  });
  return response.data;
};

export const getSeriesList = async (params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  const response = await axios<SeriesListResponse>({
    method: "GET",
    url: "/api/series",
    params,
  });
  return response.data;
};

export const getSeries = async (seriesUuid: string) => {
  const response = await axios<SeriesData>({
    method: "GET",
    url: `/api/series/${seriesUuid}`,
  });
  return response.data;
};

export const updateSeries = async (seriesUuid: string, data: UpdateSeriesData) => {
  const response = await axios<SeriesData>({
    method: "PUT",
    url: `/api/series/${seriesUuid}`,
    data,
  });
  return response.data;
};

export const deleteSeries = async (seriesUuid: string) => {
  const response = await axios<{ message: string }>({
    method: "DELETE",
    url: `/api/series/${seriesUuid}`,
  });
  return response.data;
};
