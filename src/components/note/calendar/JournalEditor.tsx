import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import useSaveKey from "@/libs/utils/useSaveKey";
import {
  resetSearchName,
  selectComplexAllFolder,
  selectComplexFolder,
  selectLiveBlock,
  setComplexFolder,
  setLiveBlock,
  setNoteBlocks,
  setTreeIdGet,
} from "@/slices/noteSlice";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { JEditor } from "./JEditor";
import { DefaultSkeleton } from "@/components/atoms/fetch/DefaultSkeleton";
import { extractMentionedUsers } from "../utils/getData";
import { useQueryFolderBlocks } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "@/components/atoms/fetch/Loding";
import { Error } from "@/components/atoms/fetch/Error";
import { motion } from "framer-motion";

export const JournalEditor = memo(({ openRight, setSaveSuccess }: any) => {
  const dispatch = useAppDispatch();
  const ic: any = useAppSelector(selectComplexAllFolder);
  const { open } = useAppSelector(selectLiveBlock);
  const { ymday, mentionId }: any = useParams();
  const items: any = useAppSelector(selectComplexFolder);

  const { data, status, refetch }: any = useQueryFolderBlocks(ymday);
  const pageLink: any | null = localStorage.getItem("editorPageLinks");
  const pageLinkObject = pageLink == null ? [] : JSON.parse(pageLink);

  const { addRootCreateNote, addJournalsDataMutation }: any =
    useMutateFolderBlocks();

  useEffect(() => {
    refetch();
    const editorStr: any =
      data && data.docs.length ? data?.docs[0].contents : "";
    localStorage.setItem("editorContent", JSON.stringify(editorStr));
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
    }, 300);
  }, [ymday]);

  const previousMention: any = useMemo(() => {
    return extractMentionedUsers(
      data && data.docs.length ? data?.docs[0].contents : ""
    );
  }, []);

  const submitItemHandler = useCallback(
    (isFolder: any, dataType: any) => {
      setSaveSuccess(false);
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
      dispatch(
        setComplexFolder({
          index: ymday,
          canMove: true,
          isFolder: isFolder,
          children: [],
          data: {
            title: ymday,
            icon: "📝",
            image: "",
            type: dataType,
          },
          canRename: true,
          roots: true,
          bookmarks: [],
        })
      );
      dispatch(resetSearchName());
      addJournalsDataMutation.mutate({
        items,
        uuid: ymday,
        type: dataType,
        journalData: initial,
        pageLinks: pageLinksChanges,
      });
      dispatch(
        setTreeIdGet({
          id: ymday,
        })
      );
      dispatch(
        setNoteBlocks({
          id: ymday,
          contents: initial,
          pageLinks: pageLink == null ? [] : JSON.parse(pageLink),
          user: "all",
        })
      );
      setSaveSuccess(true);
    },
    [dispatch, addRootCreateNote, items]
  );

  const result: Record<string, any> = [];
  for (const key of pageLinkObject) {
    if (ic.hasOwnProperty(key)) {
      result.push(ic[key]);
    }
  }

  const onClickSave = () => {
    submitItemHandler(false, "journals");
  };

  useSaveKey(() => onClickSave());

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;
  if (open === false)
    return (
      <div className="">
        <DefaultSkeleton />
      </div>
    );
  if (status === "success")
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in initial state
        animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in animate state
        exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 144 }} // Include marginLeft in exit state
        transition={{ duration: 0.5 }} // Animation duration
      >
        <div className="mt-20  text-4xl text-blue-gray-400 select-none ">
          {ymday}
        </div>
        <div
          className={
            openRight || mentionId
              ? `mt-8 h-full max-w-3xl`
              : `mt-8 h-full max-w-4xl`
          }
        >
          <JEditor
            initialContent={data?.docs.length ? data?.docs[0].contents : ""}
          />
        </div>
      </motion.div>
    );
  return null;
});
