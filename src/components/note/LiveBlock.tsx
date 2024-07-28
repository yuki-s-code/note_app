"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "./Editor";
import { DefaultSkeleton } from "../atoms/fetch/DefaultSkeleton";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  selectLiveBlock,
  selectTitleId,
  setItemIndex,
  setLiveBlock,
  setTitleId,
} from "@/slices/noteSlice";
import {
  Badge,
  Breadcrumbs,
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import useSaveKey from "@/libs/utils/useSaveKey";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import { truncateText } from "./utils/truncateText";
import { extractMentionedUsers, getData } from "./utils/getData";
import CoverImage from "../../assets/beautiful_underwater.jpg";
import { ImageGalery } from "./ImageGalery";
import { BookmarkIcon, CheckIcon, PrinterIcon } from "lucide-react";
import ReactToPrint from "react-to-print";
import toast from "react-hot-toast/headless";
import { SuccessToast } from "../atoms/toast/SuccessToast";

export default function LiveBlock() {
  const dispatch = useAppDispatch();
  const ic: any = useAppSelector(selectComplexAllFolder);
  const { noteId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);
  const { open }: any = useAppSelector(selectLiveBlock);
  const [itemBre, setItemBre]: any = useState([]);
  const initialContent: any | null = localStorage.getItem("editorContent");

  const pageLink: any | null = localStorage.getItem("editorPageLinks");
  const pageLinkObject: any =
    pageLink == null ? [] : new Set(JSON.parse(pageLink));

  const result: Record<string, any> = [];
  for (const key of pageLinkObject) {
    if (ic.hasOwnProperty(key)) {
      result.push(ic[key]);
    }
  }

  const componentRef: any = useRef();

  const previousMention: any = useMemo(() => {
    return initialContent?.length > 0 // initialContentがnullまたは空文字列でないか確認
      ? extractMentionedUsers(JSON.parse(initialContent))
      : "";
  }, [initialContent]);

  const { folderBlocksContentsMutation, updateTreeBookmarked }: any =
    useMutateFolderBlocks();
  const [imageGaleryOpen, setImageGaleryOpen]: any = useState(false);
  const [imageStringOpen, setImageStringOpen]: any = useState(false);

  const userId = window.localStorage.sns_id;

  const handleOpen = () => setImageGaleryOpen(!imageGaleryOpen);

  const onClickSave = useCallback(() => {
    const initial = JSON.parse(localStorage.getItem("editorContent") || "");
    const nowMention = extractMentionedUsers(initial);

    // Use sets for efficient difference calculation
    const prevMentionSet = new Set(
      previousMention?.map((item: any) => item.index) || []
    );
    const nowMentionSet = new Set(
      nowMention.map((item: any) => item.index) || []
    );

    const pageLinksChanges = {
      added: nowMention
        .filter((item: any) => !prevMentionSet.has(item.index))
        .map((item: any) => item.index),
      removed: previousMention
        .filter((item: any) => !nowMentionSet.has(item.index))
        .map((item: any) => item.index),
      unchanged: nowMention
        .filter((item: any) => prevMentionSet.has(item.index))
        .map((item: any) => item.index),
    };
    // console.log(pageLinkObject);
    console.log(pageLinksChanges);

    folderBlocksContentsMutation.mutate({
      id: noteId,
      contents: initial,
      pageLinks: pageLinksChanges,
    });
    toast("Save was success");
  }, [folderBlocksContentsMutation, noteId, previousMention]);

  useSaveKey(() => onClickSave());

  const parentIndexesWithData: any = useMemo(() => {
    let currentIndex = noteId;
    const resultss: any = [];
    while (true) {
      const parentIndex = Object.keys(ic).find(
        (key) => ic[key].children?.includes(currentIndex)
      );
      if (parentIndex) {
        resultss.push(ic[parentIndex]);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
    return resultss.reverse();
  }, [noteId, ic]);

  useEffect(() => {
    setItemBre(parentIndexesWithData);
    dispatch(
      setLiveBlock({
        open: false,
      })
    );
    setTimeout(() => {
      dispatch(
        setLiveBlock({
          open: true,
        })
      );
    }, 150);
  }, [noteId]);

  const onClickTitled = useCallback((m: any) => {
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
  }, []);

  const BookMarkChecked = useCallback(() => {
    const tf: boolean = ic[noteId].bookmarks.includes(userId) ? false : true;
    updateTreeBookmarked.mutate({
      index: titleId.index,
      data: userId,
      trueToFalse: tf,
    });
  }, [ic, noteId, dispatch]);

  const Checked = ({ tf }: any) => {
    return (
      <Tooltip
        content={`${tf ? "ブックマーク済" : "ブックマークされてません"}`}
      >
        <BookmarkIcon className=" h-7 w-7" />
      </Tooltip>
    );
  };

  return (
    <>
      {open ? (
        <div ref={componentRef}>
          <Breadcrumbs
            placeholder="true"
            onPointerEnterCapture
            onPointerLeaveCapture
            className=""
            separator=">"
          >
            {itemBre.map((l: any, i: any) => (
              <div key={i} className="opacity-60">
                {i == 0 ? (
                  <Link to={`/root/note`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    to={`/root/note/${l.index}`}
                    className="flex"
                    onClick={() => {
                      onClickTitled(l), getData(l);
                    }}
                  >
                    <div>{truncateText(l.data.title, 5)}</div>
                  </Link>
                )}
              </div>
            ))}
          </Breadcrumbs>
          <div className=" flex flex-col">
            <div className=" w-full" style={{ position: "relative" }}>
              <div className=" flex">
                <div
                  className=" z-0 w-full"
                  onMouseEnter={() => setImageStringOpen(true)}
                  onMouseLeave={() => setImageStringOpen(false)}
                >
                  {imageStringOpen ? (
                    <>
                      <div className=" absolute text-white font-bold cursor-pointer opacity-60 hover:opacity-80 right-4">
                        <Button
                          placeholder="true"
                          onPointerEnterCapture
                          onPointerLeaveCapture
                          onClick={handleOpen}
                        >
                          Cover画像を選択
                        </Button>
                      </div>

                      <Dialog
                        placeholder="true"
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        open={imageGaleryOpen}
                        handler={handleOpen}
                      >
                        <DialogHeader
                          placeholder="true"
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          Image Galery
                        </DialogHeader>
                        <DialogBody
                          placeholder="true"
                          onPointerEnterCapture
                          onPointerLeaveCapture
                          className=" h-96 overflow-auto"
                        >
                          <ImageGalery />
                        </DialogBody>
                      </Dialog>
                    </>
                  ) : null}
                  <img
                    className="h-64 w-full object-cover object-center"
                    src={`${
                      ic[noteId].data.image ? ic[noteId].data.image : CoverImage
                    }`}
                    alt="自然の画像"
                  />
                </div>
                <div>
                  <div className=" relative">
                    <div className=" absolute top-0 left-0 ml-[2px]">
                      <div
                        className=" cursor-pointer opacity-60 "
                        onClick={() => BookMarkChecked()}
                      >
                        {ic[noteId].bookmarks.includes(userId) ? (
                          <Badge
                            className="bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
                            content={
                              <CheckIcon
                                className="h-4 w-4 text-white"
                                strokeWidth={2.5}
                              />
                            }
                          >
                            <Checked tf={true} />
                          </Badge>
                        ) : (
                          <Checked tf={false} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" relative">
                    <div className=" absolute left-0 top-8">
                      <div className=" p-1 rounded-xl cursor-pointer hover:bg-gray-200">
                        <ReactToPrint
                          trigger={() => (
                            <PrinterIcon className=" text-gray-700" />
                          )}
                          content={() => componentRef.current}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="relative z-0">
                <Editor initialContent={initialContent} result={result} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-10/12">
          <DefaultSkeleton />
        </div>
      )}
      <SuccessToast />
    </>
  );
}
