import { AppApi } from "@/api";
import useSWR from "swr";

export const useTopSeries = (
  type: 'follows' | 'rating' | 'new' = 'follows',
  limit: number = 7,
  range?: 'day' | 'week' | 'month',
) => {
  return useSWR(["top-series", type, limit, range], () =>
    AppApi.Series.getTopSeries(type, limit, range),
  );
};
