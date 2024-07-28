import { useMutateTask } from "@/libs/hooks/taskHook/useMutateTasks";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import {
  selectEditedTaskContents,
  selectEditedTaskTitle,
  setEditedTaskContents,
  setEditedTaskContentsNumber,
  setModalOpen,
} from "../../slices/taskSlice";
import { FC } from "react";

export const Task: FC = () => {
  const dispatch = useAppDispatch();
  const taskList: any = useAppSelector(selectEditedTaskContents);
  const taskData: any = useAppSelector(selectEditedTaskTitle);

  const { editedTaskContentsMutation }: any = useMutateTask();
  const modalClose = () => {
    dispatch(
      setModalOpen({
        open: false,
      })
    );
    dispatch(
      setEditedTaskContentsNumber({
        numId: 0,
      })
    );
  };
  const changeContents = (e: any) => {
    dispatch(
      setEditedTaskContents({
        ...taskList,
        contents: e.target.value,
      })
    );
  };
  const changeTaskContents = (e: any) => {
    dispatch(
      setEditedTaskContents({
        ...taskList,
        taskContents: e.target.value,
      })
    );
  };
  const changeTaskEndDate = (e: any) => {
    dispatch(
      setEditedTaskContents({
        ...taskList,
        startDate: e.target.value,
      })
    );
  };
  const createSubmitData = () => {
    const data = taskData.tasks.map((d: any) => {
      if (d.id === taskList.id) {
        return taskList;
      } else {
        return d;
      }
    });
    return data;
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    console.log(createSubmitData());
    editedTaskContentsMutation.mutate({
      task: taskList,
      replaceData: createSubmitData(),
    });
    modalClose();
  };

  return (
    <div className="fixed z-0 w-11/12 top-0 justify-center items-center">
      <div
        className="modal-overlay absolute z-0 w-screen h-screen bg-gray-900 opacity-50"
        onClick={modalClose}
      />
      <div className="px-8 pb-8 ml-12 mt-24 z-50 absolute w-full mx-auto prose text-left prose-blue bg-white">
        <div className="top-4 left-4 absolute items-center text-gray-300 px-3 py-2 text-base leading-6 font-medium rounded-full">
          {taskList.user}
        </div>
        <div className="text-gray-600 absolute top-5 right-24">
          締切日
          <input
            className=" px-4 bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg"
            placeholder="締切"
            type="date"
            required
            onChange={(e) => changeTaskEndDate(e)}
            value={taskList.startDate}
          />
        </div>
        <div
          className="bg-gray-200 top-4 right-4 absolute items-center cursor-pointer text-gray-500 px-3 py-2 text-base leading-6 font-medium rounded-full hover:bg-blue-200 hover:text-white"
          onClick={(e) => {
            submitHandler(e);
          }}
        >
          保存
        </div>
        <div className="w-full mx-auto">
          <h3>
            <textarea
              value={taskList.contents}
              placeholder="タイトルはここに記入"
              className="font-normal w-full mt-8 p-2 outline-none border-none"
              onChange={changeContents}
            />
          </h3>
          <textarea
            className="w-full p-4 outline-none border-none"
            value={taskList.taskContents}
            placeholder="詳細はここに記入"
            onChange={changeTaskContents}
          />
        </div>
      </div>
    </div>
  );
};
