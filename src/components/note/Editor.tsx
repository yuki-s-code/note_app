import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  filterSuggestionItems,
  uploadToTmpFilesDotOrg_DEV_ONLY,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import {
  selectComplexAllFolder,
  selectTitleId,
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
  Typography,
} from "@material-tailwind/react";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { getData } from "./utils/getData";
import { PaletteIcon } from "lucide-react";
import { FcDataSheet } from "react-icons/fc";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import {
  insertAlert,
  insertPDF,
  insertTimeItem,
  insertTodayItem,
} from "./insert/InsertCustumItem";
import { notJournalItem } from "./utils/notJournalItem";
import { convertToIndexTitles } from "./utils/convertToIndexTItle";
import { PDF } from "./PDF";
import { motion } from "framer-motion";

function Icon({ id, open }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function Editor({ initialContent, result }: any) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(1);

  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);

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

  const onClickTitled = useCallback((m: any) => {
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
  }, []);

  const mentionLists = useMemo(
    () => convertToIndexTitles(notJournalItem(i)),
    [i]
  );

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

  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Adds all default blocks.
      ...defaultBlockSpecs,
      // Adds the Alert block.
      alert: Alert,
      //@ts-ignore
      procode: CodeBlock,
      //@ts-ignore
      pdf: PDF,
    },
    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: Mention,
    },
  });

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: JSON.parse(initialContent),
      uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
    },
    []
  );

  return (
    <>
      <div className="appearance-none mt-4 block rounded-lg p-4 text-xl focus:outline-none">
        <div>
          <div>
            <div className=" absolute -mt-20">
              <EmojiPicker icon={i[noteId].data.icon} onChange={onIconChange} />
            </div>
            <div className=" w-full -mt-2 flex gap-1 text-xs font-bold ml-36 text-gray-500">
              <div className="w-12">更新日</div>
              <div className=" w-36">{dataToString()}</div>
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
                                  ) : l.type == "excalidraw" ? (
                                    <PaletteIcon className=" h-4 w-4 mt-1" />
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
            <textarea
              className="absolute text-4xl font-bold top-3 w-full h-full resize-none p-3 border-none outline-none select-auto"
              value={i[noteId].data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="無題"
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        className={mentionId ? `max-w-3xl mt-8` : `max-w-4xl mt-8`}
        initial={{ opacity: 0, y: 20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in initial state
        animate={{ opacity: 1, y: 0, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in animate state
        exit={{ opacity: 0, y: -20, marginLeft: mentionId ? 0 : 100 }} // Include marginLeft in exit state
        transition={{ duration: 0.5 }} // Animation duration
      >
        <BlockNoteView
          editor={editor}
          onChange={() => {
            localStorage.setItem(
              "editorContent",
              JSON.stringify(editor.document)
            );
          }}
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
      </motion.div>
      <div className=" mt-4 border border-b-2 opacity-10 hover:opacity-60 hover:border-b-4 cursor-pointer" />
    </>
  );
}

export default Editor;
