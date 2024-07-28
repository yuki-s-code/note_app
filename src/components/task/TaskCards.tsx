import { FC, useEffect, useState } from "react";
import { AddTaskCardButton } from "./button//AddTaskCardButton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { TaskCardTitle } from "./TaskCardTItle";
import { Card } from "./Card";
import { TaskCardDeleteButton } from "./button/TaskCardDeleteButton";
import { TaskAddInput } from "./input/TaskAddInput";
import { useAppDispatch } from "../../libs/app/hooks";
import {
  setEditedTaskContents,
  setEditedTaskTitle,
} from "../../slices/taskSlice";
import { useQueryTasks } from "../../libs/hooks/taskHook/useQueryTasks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { useMutateTask } from "@/libs/hooks/taskHook/useMutateTasks";

export const TaskCards = () => {
  const [datas, setData]: any = useState([]);
  const { status, data }: any = useQueryTasks();
  const dispatch = useAppDispatch();
  const { editedTaskMutation, replaceTaskMutation }: any = useMutateTask();

  useEffect(() => {
    const taskList = data?.docs.map((list: any) => {
      return list;
    });
    const sortedList = taskList?.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );
    setData(sortedList);
  }, [data]);

  const handleDrangEnd = (result: any) => {
    const { source, destination }: any = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = datas.findIndex(
        (e: any) => e._id === source.droppableId
      );
      const destinationColIndex = datas.findIndex(
        (e: any) => e._id === destination.droppableId
      );
      const sourceCol = datas[sourceColIndex];
      const destinationCol = datas[destinationColIndex];
      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];
      const [removed] = sourceTask.splice(source.index, 1);
      destinationTask.splice(destination.index, 0, removed);
      datas[sourceColIndex].tasks = sourceTask;
      datas[destinationColIndex].tasks = destinationTask;
      replaceTaskMutation.mutate({
        id: destination.droppableId,
        replaceId: source.droppableId,
        task: sourceTask,
        replaceTask: destinationTask,
      });
      setData(datas);
    } else {
      const sourceColIndex = datas.findIndex(
        (e: any) => e._id === source.droppableId
      );
      const sourceCol = datas[sourceColIndex];
      const sourceTask = [...sourceCol.tasks];
      const [removed] = sourceTask.splice(source.index, 1);
      sourceTask.splice(destination.index, 0, removed);
      datas[sourceColIndex].tasks = sourceTask;
      editedTaskMutation.mutate({ id: source.droppableId, task: sourceTask });
      setData(datas);
    }
  };
  const handleTitletSet = (e: any) => {
    dispatch(
      setEditedTaskTitle({
        _id: e._id,
        title: e.title,
        tasks: e.tasks,
      })
    );
  };
  const handleContentSet = (e: any) => {
    dispatch(
      setEditedTaskContents({
        id: e.id,
        contents: e.contents,
        taskContents: e.taskContents,
        startDate: e.startDate,
        user: e.user,
      })
    );
  };
  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  return (
    <>
      <DragDropContext onDragEnd={handleDrangEnd}>
        <div className="flex justify-start items-start flex-wrap w-11/12 overflow-x-auto">
          {datas?.map((section: any) => (
            <Droppable key={section._id} droppableId={section._id}>
              {(provided: any) => (
                <div
                  className="w-64 p-2 m-2 bg-gray-200 rounded-md"
                  onClick={() => handleTitletSet(section)}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="flex justify-between">
                    <TaskCardTitle title={section.title} id={section._id} />
                    <TaskCardDeleteButton id={section._id} />
                  </div>
                  <div className="overflow-auto max-h-72">
                    <TaskAddInput id={section._id} />
                    {section.tasks.map((task: any, index: any) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="p-2 m-2 bg-gray-200 rounded-md"
                            onClick={() => handleContentSet(task)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              id={section._id}
                              task={task}
                              section={section}
                              numId={index}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <AddTaskCardButton taskCardsList={datas} setTaskCardsList={setData} />
        </div>
      </DragDropContext>
    </>
  );
};
