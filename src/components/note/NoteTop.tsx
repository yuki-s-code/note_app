import { memo, useCallback, useState } from "react";

import CreateRootFolder from "./CreateRootFolder";
import { NoteTreeCompose } from "./NoteTreeCompose";

import { SearchNote } from "./SearchNote";
import { BookmarkList } from "./BookmarkList";
import { useQueryTrashList } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { FcEmptyTrash, FcFullTrash } from "react-icons/fc";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { CalendarDaysIcon } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch } from "@/libs/app/hooks";
import { setTitleId } from "@/slices/noteSlice";
import { nanoid } from "nanoid";

const NoteTop = memo(() => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const { data, status }: any = useQueryTrashList(5);

  const idx = nanoid();
  const todayX = dayjs().format("YYYY-MM-DD");
  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, []);

  const handleTrashOpen = () => {
    setTrashOpen(!trashOpen);
  };

  const onClickOpenJournal = () => {
    localStorage.removeItem("editorContent");
    localStorage.removeItem("editorPageLinks");
    localStorage.removeItem("dataSheetContent");
    localStorage.removeItem("excalidrawContent");
    dispatch(
      setTitleId({
        index: idx,
        dataItem: todayX,
        dataIcon: "",
        dataImage: "",
        dataType: "calendar",
      })
    );
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div>
      <div
        className=" fixed overflow-y-scroll"
        style={{
          maxHeight: "calc(100vh - 60px)",
          overflowX: "hidden",
        }}
      >
        <style>
          {`
            .scrollbar-hidden::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div
          className={`text-xs h-1/6 pt-3 ${open ? "scrollbar-hidden" : ""}}`}
        >
          <div className=" flex">
            <div
              className="pl-4 w-12 text-gray-400 hover:text-gray-500 font-bold cursor-pointer"
              onClick={handleOpen}
            >
              検索
            </div>
            <SearchNote open={open} setOpen={setOpen} />
            <div className=" -mt-1">
              {data?.docs?.length ? (
                <FcFullTrash
                  onClick={handleTrashOpen}
                  className=" text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
                />
              ) : (
                <FcEmptyTrash
                  onClick={handleTrashOpen}
                  className=" text-2xl cursor-pointer hover:opacity-80 ml-2 opacity-40"
                />
              )}
              <Dialog
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                open={trashOpen}
                handler={handleTrashOpen}
              >
                <DialogHeader
                  placeholder="true"
                  onPointerEnterCapture
                  onPointerLeaveCapture
                >
                  ゴミ箱一覧
                </DialogHeader>
                <div className=" h-96 overflow-y-auto">
                  {data?.docs?.map((d: any, i: any) => (
                    <DialogBody
                      placeholder="true"
                      onPointerEnterCapture
                      onPointerLeaveCapture
                      key={i}
                    >
                      <div className=" flex">
                        <div>{d.data.icon}</div>
                        <div>{d.data.title}</div>
                      </div>
                    </DialogBody>
                  ))}
                </div>
                <DialogFooter
                  placeholder="true"
                  onPointerEnterCapture
                  onPointerLeaveCapture
                >
                  <Button
                    placeholder="true"
                    onPointerEnterCapture
                    onPointerLeaveCapture
                    variant="text"
                    color="red"
                    onClick={handleTrashOpen}
                    className="mr-1"
                  >
                    <span>キャンセル</span>
                  </Button>
                </DialogFooter>
              </Dialog>
            </div>
          </div>

          <div className="mt-2">
            <CreateRootFolder />
          </div>
        </div>
        <div className="pb-4 pt-4 h-5/6">
          <div className="ml-6 text-gray-600 hover:text-gray-800 cursor-pointer">
            <Link to={`/root/note/journals/${todayX}`}>
              <div className=" flex">
                <div>
                  <CalendarDaysIcon className=" w-4 h-4" />
                </div>
                <div className=" ml-2 text-sm" onClick={onClickOpenJournal}>
                  Journals
                </div>
              </div>
            </Link>
          </div>
          <div>
            <BookmarkList />
          </div>
          <NoteTreeCompose />
        </div>
      </div>
    </div>
  );
});
export default NoteTop;
