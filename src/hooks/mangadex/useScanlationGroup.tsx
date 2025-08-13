import useSWR from "swr/immutable";
import { useEffect, useState } from "react";

import { ScanlationGroupResponse } from "@/types/mangadex";
import { axios } from "@/api/core/axios";

export default function useScanlationGroup(groupId: string | null) {
  const [group, setGroup] = useState<ScanlationGroupResponse["data"] | null>(
    null,
  );
  const { data, isLoading, error } = useSWR(
    groupId ? ["scanlation_group", groupId] : null,
    async () => {
      // We don't have a dedicated group endpoint; minimal info comes from chapter detail
      const res = await axios({ method: "GET", url: `/api/groups/${groupId}` });
      return res.data as ScanlationGroupResponse;
    },
  );

  useEffect(() => {
    if (!data?.data) return;
    setGroup(data.data.data);
  }, [data]);
  return { data: group, isLoading, error };
}
