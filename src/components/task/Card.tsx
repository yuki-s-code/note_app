import { FC, useState } from "react";
import { useMutateTask } from "../../libs/hooks/taskHook/useMutateTasks";
import { BsTrash } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { useAppDispatch } from "../../libs/app/hooks";
import {
  setEditedTaskContents,
  setEditedTaskContentsNumber,
  setEditedTaskTitle,
  setModalOpen,
} from "../../slices/taskSlice";

export const Card = ({ id, task, section, numId }: any) => {
  const dispatch = useAppDispatch();
  const { editedTaskMutation }: any = useMutateTask();
  const handleDelete = () => {
    const filterTask = section.tasks.filter((t: any) => task.id !== t.id);
    editedTaskMutation.mutate({ id: id, task: filterTask });
  };
  const handleTaskOpen = () => {
    dispatch(
      setEditedTaskContents({
        id: task.id,
        contents: task.contents,
        taskContents: task.taskContents,
        startDate: task.startDate,
        user: task.user,
      })
    );
    dispatch(
      setEditedTaskContentsNumber({
        numId,
      })
    );
    dispatch(
      setEditedTaskTitle({
        _id: section._id,
        title: section.title,
        tasks: section.tasks,
      })
    );
    dispatch(
      setModalOpen({
        open: true,
      })
    );
    console.log(id, task, section);
  };

  return (
    <div className="p-2 shadow-xl bg-white rounded-md overflow-auto max-h-24">
      {/* <div onClick={() => handleOpen(task)}>+</div> */}
      <div className="flex justify-between">
        <div className=" text-xs">{task.contents}</div>
        <div className="flex">
          <button
            className="pl-4 mr-2 cursor-pointer"
            onClick={() => handleTaskOpen()}
          >
            <BiEdit />
          </button>
          <button
            className="mr-2 cursor-pointer"
            onClick={() => handleDelete()}
          >
            <BsTrash />
          </button>
        </div>
      </div>
    </div>
  );
};
