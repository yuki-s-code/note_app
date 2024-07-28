import { useMutateTask } from "@/libs/hooks/taskHook/useMutateTasks";
import { FC } from "react";
import { TiDelete } from "react-icons/ti";

export const TaskCardDeleteButton = ({ id }: any) => {
  const { deleteTaskMutation }: any = useMutateTask();
  const taskCardDeleteButton = () => {
    console.log("jdjdjdjd");
    deleteTaskMutation.mutate({ id: id });
  };
  return (
    <div className=" text-2xl">
      <button
        className=" border-none text-red-500"
        onClick={() => taskCardDeleteButton()}
      >
        <TiDelete />
      </button>
    </div>
  );
};
