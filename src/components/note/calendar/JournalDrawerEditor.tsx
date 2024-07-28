import React, { useCallback, useMemo, useRef } from "react";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  filterSuggestionItems,
  uploadToTmpFilesDotOrg_DEV_ONLY,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import "@blocknote/react/style.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Alert } from "../Alert";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import EmojiPicker from "@/components/modals/note/EmojiPicker";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import {
  insertAlert,
  insertPDF,
  insertTimeItem,
  insertTodayItem,
} from "../insert/InsertCustumItem";
import { notJournalItem } from "../utils/notJournalItem";
import { convertToIndexTitles } from "../utils/convertToIndexTItle";
import { extractMentionedUsers } from "../utils/getData";
import { useParams } from "react-router-dom";
import { JournalMention } from "./JournalMention";
import { PDF } from "../PDF";

export const JournalDrawerEditor = ({ initialContent }: any) => {
  const dispatch = useAppDispatch();
  const { mentionId }: any = useParams();
  const i: any = useAppSelector(selectComplexAllFolder);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote, updateTreeIcon, folderBlocksContentsMutation }: any =
    useMutateFolderBlocks();

  const pageLink: any | null = localStorage.getItem("editorPageLinks");
  const pageLinkObject = pageLink == null ? [] : JSON.parse(pageLink);

  const result: Record<string, any> = [];
  for (const key of pageLinkObject) {
    if (i.hasOwnProperty(key)) {
      result.push(i[key]);
    }
  }

  const previousMention: any = useMemo(() => {
    return initialContent?.length > 0 // initialContentがnullまたは空文字列でないか確認
      ? extractMentionedUsers(initialContent)
      : "";
  }, [initialContent]);

  const mentionLists: any = convertToIndexTitles(notJournalItem(i));

  const onTitleChange = useCallback(
    (t: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [mentionId]: {
            ...i[mentionId],
            data: {
              ...i[mentionId].data,
              title: t,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeNote.mutate({ index: mentionId, data: t });
      }, 500);
    },
    [i, mentionId, updateTreeNote]
  );

  const onIconChange = useCallback(
    (newIcon: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [mentionId]: {
            ...i[mentionId],
            data: {
              ...i[mentionId].data,
              icon: newIcon,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeIcon.mutate({ index: mentionId, data: newIcon });
      }, 500);
    },
    [i, mentionId, updateTreeIcon]
  );

  const onContentChange = useCallback((i: any) => {
    localStorage.setItem("mentionContent", JSON.stringify(i));
    if (timer.current) {
      clearTimeout(timer.current);
    }
    const initial: any = localStorage.getItem("mentionContent");
    const nowMention: any = extractMentionedUsers(JSON.parse(initial));

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

    timer.current = setTimeout(() => {
      folderBlocksContentsMutation.mutate({
        id: mentionId,
        contents: JSON.parse(initial),
        pageLinks: pageLinksChanges,
      });
    }, 500);
  }, []);

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Adds all default blocks.
      ...defaultBlockSpecs,
      // Adds the Alert block.
      alert: Alert,
      //@ts-ignore
      procode: CodeBlock,
      pdf: PDF,
    },
    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: JournalMention,
    },
  });

  // List containing all default Slash Menu Items, as well as our custom one.
  const getCustomSlashMenuItems = useCallback(
    (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => [
      //@ts-ignore
      ...getDefaultReactSlashMenuItems(editor),
      //@ts-ignore
      insertTodayItem(editor),
      //@ts-ignore
      insertTimeItem(editor),
      //@ts-ignore
      insertAlert(editor),
      //@ts-ignore
      insertCode(),
      //@ts-ignore
      insertPDF(editor),
    ],
    []
  );
  const getMentionMenuItems = useCallback(
    (editor: typeof schema.BlockNoteEditor): DefaultReactSuggestionItem[] => {
      return mentionLists.map((user: any) => ({
        title: user.title,
        onItemClick: () => {
          editor.insertInlineContent([
            {
              type: "mention",
              props: {
                user,
              },
            },
            " ", // add a space after the mention
          ]);
        },
      }));
    },
    [mentionLists]
  );

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: initialContent,
      uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
    },
    []
  );

  return (
    <>
      <div className="appearance-none mt-4 block w-full rounded-lg p-4 text-xl focus:outline-none">
        <>
          <EmojiPicker icon={i[mentionId].data.icon} onChange={onIconChange} />
          <div className="relative w-full flex mt-4">
            <div
              className="invisible min-h-[3.2em] overflow-x-hidden whitespace-pre-wrap break-words p-3"
              aria-hidden={true}
            />
            <textarea
              className="absolute text-4xl font-bold top-0 w-full h-full resize-none p-3 border-none outline-none"
              value={i[mentionId].data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="無題"
            />
          </div>
        </>
      </div>
      <div>
        <BlockNoteView
          editor={editor}
          onChange={() => onContentChange(editor.document)}
          theme={"light"}
          slashMenu={false}
        >
          <SuggestionMenuController
            triggerCharacter={"/"}
            // Replaces the default Slash Menu items with our custom ones.
            getItems={async (query) =>
              //@ts-ignore
              filterSuggestionItems(getCustomSlashMenuItems(editor), query)
            }
          />
          <SuggestionMenuController
            triggerCharacter={"@"}
            getItems={async (query) =>
              // Gets the mentions menu items
              filterSuggestionItems(getMentionMenuItems(editor), query)
            }
          />
        </BlockNoteView>
      </div>
    </>
  );
};
