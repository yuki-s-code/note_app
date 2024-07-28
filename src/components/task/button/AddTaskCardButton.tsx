import { FC } from "react";

import { useAppSelector } from "@/libs/app/hooks";
import { selectNewTaskTitle } from "@/slices/taskSlice";
import { useMutateTask } from "@/libs/hooks/taskHook/useMutateTasks";

export const AddTaskCardButton = ({ taskCardsList, setTaskCardsList }: any) => {
  const selectNewTask: any = useAppSelector(selectNewTaskTitle);
  const { createTaskMutation } = useMutateTask();
  const addTaskCard = (e: any) => {
    e.preventDefault();
    createTaskMutation.mutate(selectNewTask);
  };
  return (
    <div className="ml-2 mt-4">
      <button
        className="text-white font-bold py-2 px-4 border-b-4 border-green-700 rounded-full text-3xl bg-green-200 shadow-lg cursor-pointer hover:shadow-none active:translate-y-2  active:[box-shadow:green]
        active:border-b-[0px] transition-all duration-150 [box-shadow:green] border-[1px]"
        onClick={addTaskCard}
      >
        +
      </button>
    </div>
  );
};
