import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  uploadToTmpFilesDotOrg_DEV_ONLY,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { Alert } from "../Alert";
import { CodeBlock, insertCode } from "@defensestation/blocknote-code";
import {
  insertAlert,
  insertPDF,
  insertSeparator,
  insertTimeItem,
  insertTodayItem,
} from "../insert/InsertCustumItem";
import { useAppSelector } from "@/libs/app/hooks";
import { selectComplexAllFolder } from "@/slices/noteSlice";
import { notJournalItem } from "../utils/notJournalItem";
import { convertToIndexTitles } from "../utils/convertToIndexTItle";
import { JournalMention } from "./JournalMention";
import { PDF } from "../PDF";
import { Separator } from "../insert/fileInsert/Separator";

export const JEditor = ({ initialContent }: any) => {
  const i: any = useAppSelector(selectComplexAllFolder);
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Adds all default blocks.
      ...defaultBlockSpecs,
      // Adds the Alert block.
      alert: Alert,
      //@ts-ignore
      procode: CodeBlock,
      pdf: PDF,
      separator: Separator,
    },
    inlineContentSpecs: {
      // Adds all default inline content.
      ...defaultInlineContentSpecs,
      // Adds the mention tag.
      mention: JournalMention,
    },
  });

  const mentionLists: any = convertToIndexTitles(notJournalItem(i));

  const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
  ): DefaultReactSuggestionItem[] => [
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
    //@ts-ignore
    insertSeparator(editor),
  ];

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
    },
    []
  );

  return (
    <div>
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
    </div>
  );
};
