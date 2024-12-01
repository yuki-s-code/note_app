//useQueryFolderBlocks.tsx

import { useQuery } from "react-query";
import axios from "axios";
import { COMPLEXTREEFOLDER, NOTEBLOCKS } from "../../types/note";

const apiUrl = "http://localhost:8088/notes";

// eslint-disable-next-line import/prefer-default-export
export const useQueryTreeFolder = () => {
  const getTreeFolder = async () => {
    const { data } = await axios.get<COMPLEXTREEFOLDER>(
      `${apiUrl}/get_folder_tree`
    );
    return data;
  };
  return useQuery<COMPLEXTREEFOLDER, Error>({
    queryKey: ["folderBlocks", "tree"],
    queryFn: getTreeFolder,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
export const useQueryTreeFolderId = (index: any) => {
  const getTreeFolderId = async () => {
    const { data } = await axios.get<COMPLEXTREEFOLDER>(
      `${apiUrl}/get_folder_tree_id`,
      {
        params: {
          index,
        },
      }
    );
    return data;
  };
  return useQuery<COMPLEXTREEFOLDER, Error>({
    queryKey: ["folderBlocks", "tree"],
    queryFn: getTreeFolderId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryFolderBlocks = (id: string) => {
  const getFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryJournalBlocks = (id: string) => {
  const getJournalBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["journals"],
    queryFn: getJournalBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryMentionBlocks = (id: string) => {
  const getJournalBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(
      `${apiUrl}/get_folder_drawer`,
      {
        params: {
          id,
        },
      }
    );
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getJournalBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryDataSheet = (id: string) => {
  const getDataSheet = async () => {
    const { data } = await axios.get(`${apiUrl}/get_data_sheet`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getDataSheet,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryExcalidraw = (id: string) => {
  const getExcalidraw = async () => {
    const { data } = await axios.get(`${apiUrl}/get_excalidraw`, {
      params: {
        id,
      },
    });
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getExcalidraw,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllFolderBlocks = () => {
  const getAllFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_folder`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks"],
    queryFn: getAllFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllSortFolderBlocks = (page: number) => {
  const getAllSortFolderBlocks = async () => {
    try {
      const { data } = await axios.get<NOTEBLOCKS>(
        `${apiUrl}/get_all_sort_folder`,
        {
          params: {
            page,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error("データの取得に失敗しました");
    }
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks", page],
    keepPreviousData: true,
    queryFn: getAllSortFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQuerySearchList = () => {
  const getSearchList = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_folder`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folder"],
    queryFn: getSearchList,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryMentionList = () => {
  const getMentionList = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_mention`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["mentionList"],
    queryFn: getMentionList,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
export const useQueryTrashList = (page: any) => {
  const getAllTrash = async () => {
    const { data } = await axios.get(`${apiUrl}/get_all_trash`, {
      params: {
        page,
      },
    });
    return data;
  };
  return useQuery({
    queryKey: ["trash", "tree", "folderBlocks"],
    queryFn: getAllTrash,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useQueryAllSearchFolderBlocks = () => {
  const getAllSearchFolderBlocks = async () => {
    const { data } = await axios.get<NOTEBLOCKS>(`${apiUrl}/get_all_search`);
    return data;
  };
  return useQuery<NOTEBLOCKS, Error>({
    queryKey: ["folderBlocks", "search"],
    queryFn: getAllSearchFolderBlocks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
