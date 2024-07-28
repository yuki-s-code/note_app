import NoteTop from "./NoteTop";
import { useAppDispatch, useAppSelector } from "../../libs/app/hooks";
import {
  resetSearchName,
  selectComplexFolder,
  setComplexAllFolder,
  setComplexFolder,
  setNoteBlocks,
  setTreeIdGet,
} from "../../slices/noteSlice";
import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useQueryTreeFolder } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { Message } from "./Message";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import uid from "@/libs/utils/uid";
import { FcDataSheet, FcFile, FcFolder } from "react-icons/fc";
import { Button } from "@material-tailwind/react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const Note = memo(() => {
  const dispatch = useAppDispatch();
  const { noteId, ymday }: any = useParams();
  const { data, status, refetch }: any = useQueryTreeFolder();

  // State to manage sidebar visibility
  const [showSidebar, setShowSidebar] = useState(true);

  // Framer Motion Animation Variants
  const sidebarVariants = {
    open: { width: 240, transition: { type: "tween", duration: 0.5 } },
    closed: { width: 0, transition: { type: "tween", duration: 0.5 } },
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      if (data && data.docs.length) {
        dispatch(setComplexAllFolder(data?.updatedTreeItems));
      }
    };
    fetchData();
  }, [data, dispatch, refetch]);

  const items = useAppSelector(selectComplexFolder);
  const { addRootCreateFolder, addRootCreateNote }: any =
    useMutateFolderBlocks();

  const submitItemHandler = useCallback(
    (isFolder: any, dataType: any) => {
      const uuid = uid();
      dispatch(
        setComplexFolder({
          index: uuid,
          canMove: true,
          isFolder: isFolder,
          children: [],
          data: {
            title: "無題",
            icon: isFolder ? "📓" : "📝",
            image: "",
            type: dataType,
          },
          canRename: true,
          roots: true,
          bookmarks: [],
        })
      );
      dispatch(resetSearchName());
      if (isFolder) {
        addRootCreateFolder.mutate({ items, uuid, type: dataType });
      } else {
        addRootCreateNote.mutate({ items, uuid, type: dataType });
      }
      dispatch(setTreeIdGet({ id: uuid }));
      dispatch(
        setNoteBlocks({ id: uuid, contents: {}, pageLinks: [], user: "all" })
      );
    },
    [dispatch, addRootCreateFolder, addRootCreateNote, items]
  );

  const submitFolderHandler = useCallback(() => {
    submitItemHandler(true, "folder");
  }, []);
  const submitNoteHandler = useCallback(() => {
    submitItemHandler(false, "note");
  }, []);
  const submitSheetHandler = useCallback(() => {
    submitItemHandler(false, "sheet");
  }, []);

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  return (
    <div>
      <div className=" flex">
        <div className="absolute left-20 top-2">
          {/* Add a button to toggle the sidebar */}
          <div
            onClick={toggleSidebar}
            className="absolute p-3 rounded-full text-gray-500 bg-gray-100 opacity-40 hover:opacity-80 cursor-pointer"
          >
            {showSidebar ? <HiChevronDoubleLeft /> : <HiChevronDoubleRight />}
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            variants={sidebarVariants}
            initial={false} // Start with initial state (false = closed)
            animate={showSidebar ? "open" : "closed"} // Animate based on showSidebar
          >
            {showSidebar && <NoteTop />}
          </motion.div>
        </AnimatePresence>

        {noteId || ymday ? (
          <div className="-mt-8 w-full pl-32 pr-16">
            <Outlet />
          </div>
        ) : (
          <div className="mt-8 w-full pl-32">
            <Message />
            <div className=" flex items-center justify-center gap-4 opacity-90">
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitFolderHandler}
                className=" flex items-center gap-3"
              >
                <FcFolder className=" w-6 h-6" />
                新規フォルダー
              </Button>
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitNoteHandler}
                className=" flex items-center gap-3"
              >
                <FcFile className=" w-6 h-6" />
                新規ノート
              </Button>
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={submitSheetHandler}
                className=" flex items-center gap-3"
              >
                <FcDataSheet className=" w-6 h-6" />
                新規データシート
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Note;
