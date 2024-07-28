import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

const apiUrl = "http://localhost:8088";

// eslint-disable-next-line import/prefer-default-export
export const useMutateBoard = () => {
  const queryClient = useQueryClient();
  const createBoardMutation = useMutation(
    (board) => axios.post(`${apiUrl}/new_board`, board),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["board"] });
      },
    }
  );
  const editedBoardMutation = useMutation(
    (board) => axios.post(`${apiUrl}/edited_board_contents`, board),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["board"] });
      },
    }
  );
  const addBoardCommentMutation = useMutation(
    (board) => axios.post(`${apiUrl}/add_board_comment`, board),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["board"] });
      },
    }
  );
  const editedBoardCommentMutation = useMutation(
    (board) => axios.post(`${apiUrl}/edited_board_comment`, board),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["board"] });
      },
    }
  );
  const addBoardHashMutation = useMutation(
    (board) => axios.post(`${apiUrl}/add_board_hash`, board),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["hash"] });
      },
    }
  );
  return {
    createBoardMutation,
    editedBoardMutation,
    addBoardCommentMutation,
    editedBoardCommentMutation,
    addBoardHashMutation,
  };
};
