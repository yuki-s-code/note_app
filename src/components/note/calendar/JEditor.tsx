//JEditor.tsx

import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  uploadToTmpFilesDotOrg_DEV_ONLY,
  locales,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  BlockTypeSelectItem,
  DefaultReactSuggestionItem,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Alert } from "../Alert";
import {
  insertAlert,
  insertBlockQuote,
  insertPDF,
  insertTimeItem,
  insertTodayItem,
  insertTomorrowItem,
  insertYesterDayItem,
} from "../insert/InsertCustumItem";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetCodeState,
  selectComplexAllFolder,
  setAddCodeState,
} from "@/slices/noteSlice";
import { notJournalItem } from "../utils/notJournalItem";
import { convertToIndexTitles } from "../utils/convertToIndexTItle";
import { JournalMention } from "./JournalMention";
import { PDF } from "../PDF";
import { RiAlertFill, RiDoubleQuotesL } from "react-icons/ri";
import { BlockQuote } from "../BlockQuote";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowConversionExtension,
  DableLeftConversionExtension,
  DableRightConversionExtension,
} from "../utils/ArrowConversionExtension";
import CharacterCount from "@tiptap/extension-character-count";
import { Tooltip } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { GitCompareIcon } from "lucide-react";
import { formatHTML } from "../utils/formatHTML";
import { DiffNoteViewr } from "../DiffNoteViewr";

const limit = 10000;

// アイコンのアニメーションバリアント
const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

export const JEditor = ({ initialContent, setCodeItem }: any) => {
  const dispatch = useAppDispatch();
  const [openDiff, setOpenDiff] = useState(false);
  const i: any = useAppSelector(selectComplexAllFolder);
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      alert: Alert,
      blockquote: BlockQuote,
      pdf: PDF,
      //@ts-ignore
      procode: CodeBlock,
    },
    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: JournalMention,
    },
  });

  const mentionLists: any = convertToIndexTitles(notJournalItem(i));

  // List containing all default Slash Menu Items, as well as our custom one.
  const getCustomSlashMenuItems = useCallback(
    (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => [
      //@ts-ignore
      ...getDefaultReactSlashMenuItems(editor),
      //@ts-ignore
      insertTodayItem(editor),
      //@ts-ignore
      insertTomorrowItem(editor),
      //@ts-ignore
      insertYesterDayItem(editor),
      //@ts-ignore
      insertTimeItem(editor),
      //@ts-ignore
      insertAlert(editor),
      //@ts-ignore
      insertBlockQuote(editor),
      //@ts-ignore
      insertPDF(editor),
      //@ts-ignore
      insertCode(editor),
    ],
    []
  );

  const getMentionMenuItems = (
    editor: typeof schema.BlockNoteEditor
  ): DefaultReactSuggestionItem[] => {
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
  };

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: initialContent,
      uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
      _tiptapOptions: {
        extensions: [
          ArrowConversionExtension,
          DableRightConversionExtension,
          DableLeftConversionExtension,
          CharacterCount.configure({
            limit,
          }),
        ],
      },
      dictionary: locales.ja,
    },
    []
  );

  const characterCount =
    editor?._tiptapEditor?.storage.characterCount.characters() || 0;

  const percentage = editor ? Math.round((100 / limit) * characterCount) : 0;

  const isWarning = characterCount >= limit;
  // 追加: キャラクターカウントとワードカウントの状態管理
  const [charCount, setCharCount] = useState(
    editor._tiptapEditor.storage.characterCount.characters()
  );

  const onChange = async () => {
    if (editor) {
      localStorage.setItem("editorContent", JSON.stringify(editor.document));
      const html: any = await editor.blocksToHTMLLossy(editor.document);
      setCodeItem({
        id: "",
        code: formatHTML(html),
        language: "html",
      });
      if (editor._tiptapEditor) {
        setCharCount(editor._tiptapEditor.storage.characterCount.characters());
      }
    }
  };

  useEffect(() => {
    dispatch(resetCodeState());
    const fetchData = async () => {
      if (editor) {
        const html = await editor.blocksToHTMLLossy(editor.document);
        dispatch(
          setAddCodeState({
            id: "initial",
            code: formatHTML(html),
            language: "html",
          })
        );
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className=" absolute -mt-24 text-blue-gray-400">
        <div
          className={`flex items-center text-xs gap-2 ml-2 ${
            charCount === limit ? "character-count--warning" : ""
          }`}
        >
          <svg className=" -mt-1" height="20" width="20" viewBox="0 0 20 20">
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
              className={`${isWarning ? "text-red-500" : "text-blue-500"}`}
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>
          <div>
            {charCount} / {limit} 文字数
          </div>
          <Tooltip content={"差分表示"}>
            <motion.div
              className="ml-40 absolute cursor-pointer"
              variants={iconVariants}
              initial="initial"
              whileTap="tap"
              animate={"initial"}
            >
              <GitCompareIcon
                className={` ${openDiff ? " text-blue-400" : ""}`}
                onClick={() => setOpenDiff(!openDiff)}
              />
            </motion.div>
          </Tooltip>
        </div>
      </div>
      <>
        {openDiff ? (
          <div className=" -ml-80">
            <DiffNoteViewr />
          </div>
        ) : (
          <BlockNoteView
            editor={editor}
            onChange={onChange}
            theme={"light"}
            slashMenu={false}
            formattingToolbar={false}
          >
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar
                  blockTypeSelectItems={[
                    ...blockTypeSelectItems(editor.dictionary),
                    {
                      name: "注目",
                      type: "alert",
                      icon: RiAlertFill,
                      isSelected: (block: any) => block.type === "alert",
                    } satisfies BlockTypeSelectItem,
                    {
                      name: "引用",
                      type: "blockquote",
                      icon: RiDoubleQuotesL,
                      isSelected: (block: any) => block.type === "blockquote",
                    } satisfies BlockTypeSelectItem,
                  ]}
                />
              )}
            />
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
        )}
      </>
    </div>
  );
};
