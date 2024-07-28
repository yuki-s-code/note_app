import { FC } from "react";
import { TaskCards } from "./TaskCards";
import taskImage from "../../assets/task_back_image.jpg";
import { Task } from "./Task";
import { useAppSelector } from "../../libs/app/hooks";
import { selectModalOpen } from "../../slices/taskSlice";

const TaskApp: FC = () => {
  const { open } = useAppSelector(selectModalOpen);
  return (
    <div className="w-screen overflow-auto">
      <div>
        {open ? (
          <div className="w-full absolute z-10">
            <Task />
          </div>
        ) : null}

        <img className=" h-screen w-screen" src={taskImage} alt="" />
        <div className="absolute top-10 z-0 w-5/6 h-4/5 overflow-y-auto">
          <TaskCards />
        </div>
      </div>
    </div>
  );
};
export default TaskApp;
