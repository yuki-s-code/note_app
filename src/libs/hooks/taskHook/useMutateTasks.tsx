import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

const apiUrl = "http://localhost:8088";

// eslint-disable-next-line import/prefer-default-export
export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const createTaskMutation = useMutation(
    (task) => axios.post(`${apiUrl}/create_task`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const addTaskMutation = useMutation(
    (task) => axios.post(`${apiUrl}/add_task`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const editedTaskTitleMutation = useMutation(
    (task) => axios.post(`${apiUrl}/edited_task_title`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const editedTaskMutation = useMutation(
    (task) => axios.post(`${apiUrl}/edited_task`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const replaceTaskMutation = useMutation(
    (task) => axios.post(`${apiUrl}/replace_task`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const deleteTaskMutation = useMutation(
    (task) => axios.post(`${apiUrl}/task_delete`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  const editedTaskContentsMutation = useMutation(
    (task) => axios.post(`${apiUrl}/edited_task_contents`, task),
    {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );
  return {
    createTaskMutation,
    addTaskMutation,
    editedTaskTitleMutation,
    editedTaskMutation,
    replaceTaskMutation,
    deleteTaskMutation,
    editedTaskContentsMutation,
  };
};
