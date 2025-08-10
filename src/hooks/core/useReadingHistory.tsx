import { AppApi } from "@/api";
import useSWR from "swr";

export const useReadingHistory = () => {
  return useSWR("reading-history", () =>
    AppApi.User.getReadingHistory(),
  );
};
