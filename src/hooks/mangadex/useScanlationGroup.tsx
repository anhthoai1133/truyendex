import useSWR from "swr/immutable";
import { useEffect, useState } from "react";

import { ScanlationGroupResponse } from "@/types/mangadex";
import { axios } from "@/api/core/axios";

export default function useScanlationGroup(groupId: string | null) {
  // For now, return minimal group info since we don't have a dedicated endpoint
  return { 
    data: groupId ? { 
      id: groupId, 
      type: "scanlation_group" as const, 
      attributes: { 
        name: "Unknown Group",
        altNames: [],
        website: null,
        ircServer: null,
        ircChannel: null,
        discord: null,
        contactEmail: null,
        description: null,
        twitter: null,
        mangaUpdates: null,
        focusedLanguages: null,
        locked: false,
        official: false,
        inactive: false,
        publishDelay: "P0D",
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, 
      relationships: []
    } : null, 
    isLoading: false, 
    error: null 
  };
}
