import { useState } from "react";
import { useMutateTask } from "../../libs/hooks/taskHook/useMutateTasks";

export const TaskCardTitle = ({ title, id }: any) => {
  const [inputCardTitle, setInputCardTitle] = useState(
    title ? title : "本日のタスク"
  );
  const [isClick, setIsClick] = useState(false);
  const { editedTaskTitleMutation }: any = useMutateTask();
  const handleClick = () => {
    setIsClick(true);
  };
  const handleChange = (e: any) => {
    setInputCardTitle(e.target.value);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    editedTaskTitleMutation.mutate({ id, title: inputCardTitle });
    setIsClick(false);
  };
  const handleOnBlur = () => {
    editedTaskTitleMutation.mutate({ id, title: inputCardTitle });
    setIsClick(false);
  };
  return (
    <div
      className="font-bold w-full cursor-pointer rounded-md"
      onClick={handleClick}
    >
      {isClick ? (
        <form onSubmit={handleSubmit}>
          <input
            className=" font-normal text-sm w-full p-1 outline-none border-none"
            autoFocus
            type="text"
            placeholder="本日のタスク"
            onChange={handleChange}
            value={inputCardTitle}
            onBlur={handleOnBlur}
            maxLength={20}
          />
        </form>
      ) : (
        <div className=" text-sm">{inputCardTitle}</div>
      )}
    </div>
  );
};
