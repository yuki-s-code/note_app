import { FC, useState } from "react";
import uid from "../../../libs/utils/uid";
import { useMutateTask } from "@/libs/hooks/taskHook/useMutateTasks";

export const TaskAddInput = ({ id }: any) => {
  const [text, setText] = useState({
    id: "",
    contents: "",
    taskContents: "",
    user: window.localStorage.sns_id,
  });
  const { addTaskMutation }: any = useMutateTask();

  const setId = () => {
    const taskId = uid();
    return {
      id: taskId,
      contents: text.contents,
      taskContents: text.taskContents,
      user: window.localStorage.sns_id,
    };
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (text.contents === "") {
      return;
    }
    addTaskMutation.mutate({ id, text: setId() });
    setText({
      id: "",
      contents: "",
      taskContents: "",
      user: window.localStorage.sns_id,
    });
  };
  const handleChange = (e: any) => {
    setText({ ...text, contents: e.target.value });
  };
  return (
    <div className="pt-2 rounded-3xl">
      <form onSubmit={handleSubmit}>
        <input
          className=" w-full p-2 text-sm outline-none border-none rounded-md"
          type="text"
          placeholder="カードの追加"
          onChange={handleChange}
          onBlur={handleSubmit}
          value={text.contents}
        />
      </form>
    </div>
  );
};
