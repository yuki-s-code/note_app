import { CgToday } from "react-icons/cg";
import { dateNavigation, timeNavigation } from "../utils/dateNavigation";
import { CiTimer } from "react-icons/ci";
import {
  BlockNoteEditor,
  PartialBlock,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { RiAlertFill } from "react-icons/ri";
import { RiFilePdfFill } from "react-icons/ri";
import { RulerIcon } from "lucide-react";

export const insertTodayItem = (editor: BlockNoteEditor) => ({
  title: "Today",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const insertDateTime: PartialBlock = {
      type: "paragraph",
      content: [
        { type: "text", text: dateNavigation(), styles: { bold: true } },
      ],
    };
    editor.insertBlocks([insertDateTime], currentBlock, "before");
  },
  aliases: ["today", "td"],
  group: "Date & Time",
  icon: <CgToday />,
  subtext: "insert today",
});

export const insertTimeItem = (editor: BlockNoteEditor) => ({
  title: "Now",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const insertDateTime: PartialBlock = {
      type: "paragraph",
      content: [
        { type: "text", text: timeNavigation(), styles: { bold: false } },
      ],
    };
    editor.insertBlocks([insertDateTime], currentBlock, "before");
  },
  aliases: ["now", "no"],
  group: "Date & Time",
  icon: <CiTimer />,
  subtext: "insert time",
});
// Slash menu item to insert an Alert block
export const insertAlert = (editor: any) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    });
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Other",
  icon: <RiAlertFill />,
});
// Slash menu item to insert a PDF block
export const insertPDF = (editor: any) => ({
  title: "PDF",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "pdf",
    });
  },
  aliases: ["pdf", "document", "embed", "file"],
  group: "Other",
  icon: <RiFilePdfFill />,
});

export const insertSeparator = (editor: BlockNoteEditor) => ({
  title: "Separator",
  group: "Others",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      //@ts-expect-error types not defined
      type: "separator",
    });
  },
  aliases: ["hr", "separator", "sep", "rule"],
  icon: <RulerIcon />,
  subtext: "Insert a separator block.",
});
