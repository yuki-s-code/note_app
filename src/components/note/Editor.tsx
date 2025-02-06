//Editor.tsx

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  filterSuggestionItems,
  uploadToTmpFilesDotOrg_DEV_ONLY,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  locales,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  BlockTypeSelectItem,
  DefaultReactSuggestionItem,
  DragHandleButton,
  FormattingToolbar,
  FormattingToolbarController,
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useParams } from "react-router-dom";
import { RiAlertFill, RiDoubleQuotesL } from "react-icons/ri";

import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  resetCodeState,
  selectComplexAllFolder,
  selectTitleId,
  setAddCodeState,
  setComplexAllFolder,
  setItemIndex,
  setTitleId,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";
import EmojiPicker from "../modals/note/EmojiPicker";
import { Alert } from "./Alert";
import { Mention } from "./Mention";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { getData } from "./utils/getData";
import { GitCompareIcon, PaletteIcon } from "lucide-react";
import { FcDataSheet } from "react-icons/fc";
import {
  insertAlert,
  insertBlockQuote,
  insertCode,
  insertDivider,
  insertPDF,
  insertTimeItem,
  insertTodayItem,
  insertTomorrowItem,
  insertYesterDayItem,
} from "./insert/InsertCustumItem";
import { convertToIndexTitles } from "./utils/convertToIndexTItle";
import { PDF } from "./PDF";
import { motion } from "framer-motion";
import {
  ArrowConversionExtension,
  DableLeftConversionExtension,
  DableRightConversionExtension,
} from "./utils/ArrowConversionExtension";
import { BlockCode, BlockDivider, BlockQuote } from "./BlockQuote";
import CharacterCount from "@tiptap/extension-character-count";
import { DiffNoteViewr } from "./DiffNoteViewr";
import { formatHTML } from "./utils/formatHTML";
import { journalItem, notJournalItem } from "./utils/notJournalItem";
import { RemoveBlockButton } from "./utils/RemoveBlockButton";
import { DayOrNoteSwitch } from "./utils/DayOrNoteSwitch";

// アイコンコンポーネントの再利用可能化
const Icon = memo(({ id, open }: { id: number; open: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={`${
      id === open ? "rotate-180" : ""
    } h-5 w-5 transition-transform duration-300`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
));

// アイコンのアニメーションバリアント
const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

const limit = 20000;

function Editor({ initialContent, result, setCodeItem }: any) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(1);
  const [openDiff, setOpenDiff] = useState(false);
  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);
  const [isChecked, setIsChecked] = useState(false);

  const { noteId, mentionId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);
  const i: any = useAppSelector(selectComplexAllFolder);
  const updatedDay: any | null = localStorage.getItem("editorContentUpdated");
  const inputDateTime: any = new Date(JSON.parse(updatedDay));
  const dataToString = useCallback(() => {
    // 年、月、日、時間、分、秒を取得
    const year = inputDateTime.getFullYear();
    const month = String(inputDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(inputDateTime.getDate()).padStart(2, "0");
    const hours = String(inputDateTime.getHours()).padStart(2, "0");
    const minutes = String(inputDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(inputDateTime.getSeconds()).padStart(2, "0");

    // 変換後の日時を作成
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }, [inputDateTime]);

  const onClickTitled = useCallback(
    (m: any) => {
      dispatch(
        setTitleId({
          index: m.index,
          dataItem: m.title,
          dataIcon: m.icon,
          dataImage: m.image,
          dataType: m.type,
        })
      );
      dispatch(
        setItemIndex({
          index: m.index,
        })
      );
    },
    [dispatch]
  );

  const mentionLists = useMemo(
    () =>
      isChecked
        ? convertToIndexTitles(journalItem(i))
        : convertToIndexTitles(notJournalItem(i)),
    [i, isChecked]
  );
  console.log(mentionLists);

  const mentionString: any | null = localStorage.getItem("mentionCount");
  const mentionObject: any = useMemo(
    () => (mentionString ? JSON.parse(mentionString) : []),
    [mentionString]
  );

  const timer = useRef<NodeJS.Timeout | null>(null);
  const { updateTreeNote, updateTreeIcon }: any = useMutateFolderBlocks();

  const onTitleChange = useCallback(
    (t: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [noteId]: {
            ...i[noteId],
            data: {
              ...i[noteId].data,
              title: t,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeNote.mutate({ index: titleId.index, data: t });
      }, 500);
    },
    [i, noteId, updateTreeNote, titleId]
  );

  const onIconChange = useCallback(
    (newIcon: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [noteId]: {
            ...i[noteId],
            data: {
              ...i[noteId].data,
              icon: newIcon,
            },
          },
        })
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        updateTreeIcon.mutate({ index: titleId.index, data: newIcon });
      }, 500);
    },
    [i, noteId, updateTreeIcon, titleId]
  );

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
      //@ts-ignore
      insertDivider(editor),
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

  const schema = useMemo(
    () =>
      BlockNoteSchema.create({
        blockSpecs: {
          ...defaultBlockSpecs,
          alert: Alert,
          blockquote: BlockQuote,
          pdf: PDF,
          procode: BlockCode,
          prodivider: BlockDivider,
        },
        inlineContentSpecs: {
          ...defaultInlineContentSpecs,
          mention: Mention,
        },
      }),
    []
  );

  const initialContentParsed = useMemo(() => {
    try {
      return initialContent ? JSON.parse(initialContent) : undefined; // 空の場合は空のオブジェクト
    } catch (error) {
      console.error("Error parsing initial content:", error);
      return undefined; // エラーが発生した場合は空のオブジェクトを返す
    }
  }, [initialContent]);

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: initialContentParsed,
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
        id: dataToString(),
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
    <>
      <div className="hover-scrollbar overflow-y-auto overflow-x-hidden appearance-none mt-4 block rounded-lg p-4 text-xl focus:outline-none">
        <div>
          <div>
            <div className=" absolute -ml-3 top-20">
              <EmojiPicker
                icon={i[noteId].data.icon}
                onChange={onIconChange}
                sideItem={mentionId}
              />
            </div>
            <div className=" relative w-full -mt-2 flex gap-6 text-xs font-bold text-gray-500">
              <div className=" flex mt-1">
                <div>更新日</div>
                <div className=" ml-2">{dataToString()}</div>
              </div>

              <div
                className={`flex items-center text-xs gap-2 ml-2 ${
                  charCount === limit ? "character-count--warning" : ""
                }`}
              >
                <svg
                  className=" -mt-1"
                  height="20"
                  width="20"
                  viewBox="0 0 20 20"
                >
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
                    className={`${
                      isWarning ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  <circle r="6" cx="10" cy="10" fill="white" />
                </svg>
                <div>
                  {charCount} / {limit}
                </div>
              </div>
              <div className=" ml-4">
                <Tooltip content={"差分表示"}>
                  <motion.div
                    className="cursor-pointer"
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
              <div className=" ml-4">
                <DayOrNoteSwitch
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                />
              </div>
            </div>
            <motion.div
              className="relative w-full flex mt-4"
              initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in initial state
              animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in animate state
              exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 128 }} // Include marginLeft in exit state
              transition={{ duration: 0.5 }} // Animation duration
            >
              <Accordion
                open={open === 0}
                icon={<Icon id={0} open={open} />}
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                <AccordionHeader
                  className="  text-xs text-gray-400 mt-2 w-10/12"
                  onClick={() => handleOpen(1)}
                  placeholder="true"
                  onPointerEnterCapture
                  onPointerLeaveCapture
                >
                  INFO
                </AccordionHeader>
                <AccordionBody>
                  <div className=" flex">
                    <div className="-mt-4">
                      <Popover placement="top-start">
                        <PopoverHandler>
                          <Button
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            variant="text"
                            className=" text-gray-500 flex"
                          >
                            <VscFileSymlinkFile className=" w-4 h-4 mr-1" />
                            <div>Pageリンク数 {mentionObject.length}</div>
                          </Button>
                        </PopoverHandler>
                        {mentionObject.length ? (
                          <PopoverContent
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            className=" max-h-64 overflow-y-auto"
                          >
                            {mentionObject.map((l: any) => (
                              <Link
                                key={l.index}
                                to={`/root/note/${l.index}`}
                                className="flex cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  onClickTitled(l);
                                  getData(l);
                                }}
                              >
                                <Typography
                                  placeholder="true"
                                  onPointerEnterCapture
                                  onPointerLeaveCapture
                                  className=" w-56 flex"
                                >
                                  {l.type == "sheet" ? (
                                    <FcDataSheet className=" mt-1" />
                                  ) : (
                                    l.icon
                                  )}
                                  {l.title}
                                </Typography>
                              </Link>
                            ))}
                          </PopoverContent>
                        ) : null}
                      </Popover>
                    </div>
                    <div className="ml-8 -mt-4">
                      <Popover placement="top-start">
                        <PopoverHandler>
                          <Button
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            variant="text"
                            className=" text-gray-500 flex"
                          >
                            <VscFileSymlinkFile className=" w-4 h-4 mr-1" />
                            <div>Backリンク数 {result.length}</div>
                          </Button>
                        </PopoverHandler>
                        {result.length ? (
                          <PopoverContent
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            className=" max-h-64 overflow-y-auto"
                          >
                            {result.map((l: any) => (
                              <Link
                                key={l.index}
                                to={`/root/note/${l.index}`}
                                className="flex cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  onClickTitled(l);
                                  getData(l);
                                }}
                              >
                                <Typography
                                  placeholder="true"
                                  onPointerEnterCapture
                                  onPointerLeaveCapture
                                  className=" w-56 flex"
                                >
                                  {l.data.type == "sheet" ? (
                                    <FcDataSheet className=" mt-1" />
                                  ) : l.data.type == "excalidraw" ? (
                                    <PaletteIcon className=" h-4 w-4 mt-1" />
                                  ) : (
                                    l.data.icon
                                  )}
                                  {l.data.title}
                                </Typography>
                              </Link>
                            ))}
                          </PopoverContent>
                        ) : null}
                      </Popover>
                    </div>
                  </div>
                </AccordionBody>
              </Accordion>
            </motion.div>
          </div>
          <motion.div
            className="relative w-full flex"
            initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in initial state
            animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in animate state
            exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 104 }} // Include marginLeft in exit state
            transition={{ duration: 0.5 }} // Animation duration
          >
            <div
              className="invisible min-h-[3.2em] overflow-x-hidden whitespace-pre-wrap break-words p-3"
              aria-hidden={true}
            />
            <input
              className="absolute text-4xl font-bold top-3 w-full h-full resize-none p-3 border-none outline-none select-auto"
              value={i[noteId].data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="無題"
            />
          </motion.div>
        </div>
      </div>
      <>
        {openDiff ? (
          <div className=" -ml-72">
            <DiffNoteViewr />
          </div>
        ) : (
          <motion.div
            className={
              mentionId ? `max-w-4xl h-full mt-4` : `max-w-4xl h-full mt-4`
            }
            initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in initial state
            animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in animate state
            exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in exit state
            transition={{ duration: 0.5 }} // Animation duration
          >
            <BlockNoteView
              editor={editor}
              onChange={onChange}
              theme={"light"}
              slashMenu={false}
              formattingToolbar={false}
              sideMenu={false}
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
              <SideMenuController
                sideMenu={(props) => (
                  <SideMenu {...props}>
                    {/* Button which removes the hovered block. */}
                    <RemoveBlockButton {...props} />
                    <DragHandleButton {...props} />
                  </SideMenu>
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
          </motion.div>
        )}
      </>
    </>
  );
}

export default Editor;
