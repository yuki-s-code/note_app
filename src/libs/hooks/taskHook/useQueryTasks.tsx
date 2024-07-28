import { useQuery } from "react-query";
import axios from "axios";
import { TASK } from "../../types/task";

const apiUrl = "http://localhost:8088";

// eslint-disable-next-line import/prefer-default-export
export const useQueryTasks = () => {
  const getTasks = async () => {
    const { data } = await axios.get<TASK>(`${apiUrl}/get_all_task`);
    return data;
  };
  return useQuery<TASK, Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
