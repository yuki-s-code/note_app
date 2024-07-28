import React, { useState } from "react";
import { useAppDispatch } from "@/libs/app/hooks";
import { resetCreateFolderModal } from "@/slices/noteSlice";
import usePagination from "./utils/usePagination";
import {
  // Button,
  Dialog,
  // DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { SearchFusehNote } from "./SearchFuseNote";

export const SearchNote = ({ open, setOpen }: any) => {
  const dispatch = useAppDispatch();

  const { nextPage, resetPage } = usePagination(5);
  const [searchText, setSearchText] = useState("");

  const handler = () => {
    setOpen(!open);
    resetPage();
    setSearchText("");
    dispatch(resetCreateFolderModal());
  };

  return (
    <Dialog
      placeholder="true"
      onPointerEnterCapture
      onPointerLeaveCapture
      open={open}
      handler={handler}
    >
      <DialogHeader
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        検索一覧
      </DialogHeader>
      <div className="h-96">
        <div className=" flex">
          <input
            className=" w-11/12 pl-2 ml-2 mt-2 border-none outline-none text-xl"
            type="text"
            placeholder="あなたのNoteを検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto">
          <div className="mt-2">
            <div className=" h-72">
              <SearchFusehNote
                searchText={searchText}
                setSearchText={setSearchText}
                open={open}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      </div>
      <DialogFooter
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
        className=" flex justify-center items-center"
      >
        <div className=" -mt-8" onClick={nextPage}>
          <div className=" p-1 rounded opacity-40 hover:opacity-70 cursor-pointer text-sm text-blue-300">
            さらに表示
          </div>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
