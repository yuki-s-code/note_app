import React, { useCallback } from "react";
import { useQueryAllSearchFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "../atoms/fetch/Loding";
import { Error } from "../atoms/fetch/Error";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetCreateFolderModal,
  resetNoteBlocks,
  selectComplexAllFolder,
  setCreateFolderModal,
  setItemIndex,
  setTitleId,
} from "@/slices/noteSlice";
import progress from "@/libs/utils/progress";
import axios from "axios";
import { NOTEBLOCKS } from "@/libs/types/note";
import { Link } from "react-router-dom";
import usePagination from "./utils/usePagination";
import Fuse from "fuse.js";
import { highlightText } from "./utils/highlightText";

export const SearchFusehNote = ({
  searchText,
  setSearchText,
  open,
  setOpen,
}: any) => {
  const dispatch = useAppDispatch();
  const item: any = useAppSelector(selectComplexAllFolder);

  const { resetPage } = usePagination(5);
  const { data, status }: any = useQueryAllSearchFolderBlocks();
  const modalOpenHandler = () => {
    resetPage();
    setSearchText("");
    dispatch(resetCreateFolderModal());
  };

  const onClickCreateFolderModal = useCallback((n: any, m: any, i: any) => {
    dispatch(resetNoteBlocks());
    dispatch(
      setTitleId({
        index: m.index,
        dataItem: m.data.title,
        dataIcon: m.data.icon,
        dataImage: m.data.image,
        dataType: m.data.type,
      })
    );
    dispatch(
      setItemIndex({
        index: m.index,
      })
    );
    dispatch(
      setCreateFolderModal({
        open: n,
      })
    );
  }, []);

  const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
  };

  const getDataItem = async (m: any) => {
    const apiUrl = "http://localhost:8088/notes";
    return await axios.get<NOTEBLOCKS>(`${apiUrl}/get_folder`, {
      params: {
        id: m,
      },
    });
  };

  const getData = async (m: any) => {
    const data_item: any = await getDataItem(m);
    localStorage.removeItem("editorContent");
    if (isEmpty(data_item?.data?.docs[0]?.contents)) {
      localStorage.setItem("editorContent", JSON.stringify(""));
    } else {
      localStorage.setItem(
        "editorContent",
        JSON.stringify(data_item?.data.docs[0].contents)
      );
    }
  };

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  if (status === "success") {
    const searchFuse = () => {
      const options = {
        keys: ["contents"],
        // threshold: 1.0, // 一致のしきい値を下げて厳格な検索を行う
        minMatchCharLength: 2, // 3文字以上のクエリでのみ検索を行う
        includeMatches: true,
        ignoreLocation: true,
        includeScore: true,
        shouldSort: true,
        // tokenize: (text: any) => tokenize(text, "trigram"),
        tokenize: true,
      };
      const fuse = new Fuse(data?.textOb, options);
      const result = fuse.search(searchText);
      const sortedData = result.sort((a: any, b: any) => a.score - b.score);
      return sortedData;
    };

    return (
      <div>
        {searchFuse().map((result: any) => (
          <Link key={result.refIndex} to={`/root/note/${result.item.id}`}>
            <div
              className=" py-2 px-2 text-sm text-gray-700 border border-b-1 opacity-70 hover:opacity-100 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onClickCreateFolderModal(
                  2,
                  item[result.item.id],
                  result.item.id
                ),
                  getData(result.item.id),
                  modalOpenHandler();
                setOpen(!open);
              }}
            >
              <div className=" flex">
                {item[result.item.id] ? (
                  <>
                    <div className=" font-bold">
                      {item[result.item.id].data.icon}
                    </div>
                    <div className=" font-bold pl-2">
                      {item[result.item.id].data.title}
                    </div>
                    <div className="text-xs pl-8">
                      {progress(result.item.updatedAt)}
                    </div>
                  </>
                ) : null}
              </div>
              <div className=" py-2 ml-5 line-clamp-3 overflow-y-auto">
                {highlightText(result.item.contents, result.matches[0].indices)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
  return null;
};
