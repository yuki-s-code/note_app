//insertCustomItem.tsx

import { CgToday } from "react-icons/cg";
import {
  dateNavigation,
  timeNavigation,
  tomorrowNavigation,
  yesterdayNavigation,
} from "../utils/dateNavigation";
import { CiTimer } from "react-icons/ci";
import {
  BlockNoteEditor,
  PartialBlock,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { RiAlertFill, RiDoubleQuotesL, RiFilePdfFill } from "react-icons/ri";

export const insertTodayItem = (editor: BlockNoteEditor) => ({
  title: "今日",
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
  group: "日付と時間",
  icon: <CgToday />,
  subtext: "今日の日付を挿入します",
});

export const insertTomorrowItem = (editor: BlockNoteEditor) => ({
  title: "明日",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const insertDateTime: PartialBlock = {
      type: "paragraph",
      content: [
        { type: "text", text: tomorrowNavigation(), styles: { bold: true } },
      ],
    };
    editor.insertBlocks([insertDateTime], currentBlock, "before");
  },
  aliases: ["tomorrow", "to"],
  group: "日付と時間",
  icon: <CgToday />,
  subtext: "明日の日付を挿入します",
});

export const insertYesterDayItem = (editor: BlockNoteEditor) => ({
  title: "昨日",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const insertDateTime: PartialBlock = {
      type: "paragraph",
      content: [
        { type: "text", text: yesterdayNavigation(), styles: { bold: true } },
      ],
    };
    editor.insertBlocks([insertDateTime], currentBlock, "before");
  },
  aliases: ["yesterday", "ya"],
  group: "日付と時間",
  icon: <CgToday />,
  subtext: "昨日の日付を挿入します",
});

export const insertTimeItem = (editor: BlockNoteEditor) => ({
  title: "現時点",
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
  group: "日付と時間",
  icon: <CiTimer />,
  subtext: "時間を挿入します",
});
// Slash menu item to insert an Alert block
export const insertAlert = (editor: any) => ({
  title: "注目",
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
  subtext: "文を強調したいときに使用",
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
  subtext: "PDFを挿入します",
});

export const insertBlockQuote = (editor: any) => ({
  title: "引用",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "blockquote",
    });
  },
  aliases: ["blockquote"],
  group: "Other",
  icon: <RiDoubleQuotesL />,
  subtext: "引用した文を挿入",
});

// export const insertSeparator = (editor: BlockNoteEditor) => ({
//   title: "Separator",
//   group: "Other",
//   onItemClick: () => {
//     insertOrUpdateBlock(editor, {
//       //@ts-expect-error types not defined
//       type: "separator",
//     });
//   },
//   aliases: ["hr", "separator", "sep", "rule"],
//   icon: <RulerIcon />,
//   subtext: "Insert a separator block.",
// });
