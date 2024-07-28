import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

const apiUrl = "http://localhost:8088";

// 新しいAxiosインスタンスを作成
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:8088", // バックエンドのオリジンに合わせて設定
  },
});

// eslint-disable-next-line import/prefer-default-export
export const useMutateFolderBlocks = () => {
  const queryClient = useQueryClient();
  const addRootCreateFolder = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_root_create_folder`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );
  const addRootCreateNote = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_root_create_note`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );
  const addCreateFolder = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_create_folder`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );
  const addCreateNote = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_create_note`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const updateTreeNote = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_tree`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const updateTreeIcon = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_tree_icon`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const updateTreeImage = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_tree_image`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const updateTreeBookmarked = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_tree_bookmarks`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const updateTreeSort = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/update_tree_sort`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks", "tree"] });
      },
    }
  );

  const trashInsert = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/trash_insert`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({
          queryKey: ["folderBlocks", "tree"],
        });
      },
    }
  );

  const folderBlocksContentsMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/edited_folder_contents`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks"] });
      },
    }
  );

  const dataSheetMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/edited_data_sheet`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks"] });
      },
    }
  );

  const excalidrawMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/edited_excalidraw`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks"] });
      },
    }
  );

  const newBlockMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/new_blocks`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks"] });
      },
    }
  );

  const selectParentMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/select_parent`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folder"] });
      },
    }
  );
  const selectDeleteMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/select_delete`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folder"] });
      },
    }
  );
  const addJournalsDataMutation = useMutation(
    (folder) => axiosInstance.post(`${apiUrl}/add_journals`, folder),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["folderBlocks"] });
      },
    }
  );

  return {
    addRootCreateFolder,
    addRootCreateNote,
    addCreateFolder,
    addCreateNote,
    updateTreeNote,
    updateTreeIcon,
    updateTreeImage,
    updateTreeBookmarked,
    updateTreeSort,
    trashInsert,
    folderBlocksContentsMutation,
    dataSheetMutation,
    excalidrawMutation,
    newBlockMutation,
    selectParentMutation,
    selectDeleteMutation,
    addJournalsDataMutation,
  };
};
