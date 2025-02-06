//BlockQuote.tsx

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Divider, MantineProvider } from "@mantine/core";
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useState } from "react";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  bracketMatching,
  defaultHighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { RiScissorsLine } from "react-icons/ri";

export const BlockQuote = createReactBlockSpec(
  {
    type: "blockquote",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "blockquote",
        values: ["blockquote"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return (
        <MantineProvider>
          <blockquote className="w-full py-2 px-4 my-1 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            <div className=" text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">
              <div className={"inline-content"} ref={props.contentRef} />
            </div>
          </blockquote>
        </MantineProvider>
      );
    },
  }
);

// BlockDivider コンポーネント
// ユーザーが線の太さ、色、スタイルを設定できるようにしています
export const BlockDivider = createReactBlockSpec(
  {
    type: "prodivider",
    propSchema: {
      // Divider の太さ（ピクセル値）
      thickness: {
        default: 2,
        type: "number",
      },
      // Divider の色（Mantine のテーマカラー名など、または CSS カラーコード）
      color: {
        default: "gray",
        type: "string",
      },
      // 線のスタイル：solid（実線）、dotted（点線）、dashed（破線）
      variant: {
        default: "solid",
        values: ["solid", "dotted", "dashed"],
      },
      type: {
        default: "prodivider",
        values: ["prodivider"],
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <MantineProvider>
          <Divider
            className=" ml-4 opacity-20 bg-gradient-to-r from-blue-600 to-green-600 h-[2px]"
            my="md"
            style={{ width: "100%" }}
          />
        </MantineProvider>
      );
    },
  }
);

// BlockCode コンポーネントをおしゃれに＋言語選択機能付き
export const BlockCode = createReactBlockSpec(
  {
    type: "procode",
    propSchema: {
      language: {
        default: "javascript",
        values: [
          "javascript",
          "typescript",
          "markdown",
          "html",
          "css",
          "python",
          "java",
          "cpp",
          "ruby",
          "go",
          "php",
          "csharp",
          "swift",
          "kotlin",
          "rust",
          "scala",
          "perl",
          "sql",
          "shell",
          "json",
        ],
      },
      code: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props: any) => {
      // ブロックの props から言語とコードを取得
      const { language: initLang, code: initCode } = props.block.props;
      const [language, setLanguage] = useState<string>(
        initLang || "javascript"
      );
      const [codeValue, setCodeValue] = useState<string>(initCode || "");

      // CodeMirror 用の言語拡張のマッピング
      const languageExtensions: { [key: string]: any } = {
        javascript: langs.javascript(),
        typescript: langs.typescript(),
        markdown: langs.markdown(),
        html: langs.html(),
        css: langs.css(),
        python: langs.python(),
        java: langs.java(),
        cpp: langs.cpp(),
        ruby: langs.ruby(),
        go: langs.go(),
        php: langs.php ? langs.php() : null,
        csharp: langs.csharp ? langs.csharp() : null,
        swift: langs.swift ? langs.swift() : null,
        kotlin: langs.kotlin ? langs.kotlin() : null,
        rust: langs.rust ? langs.rust() : null,
        scala: langs.scala ? langs.scala() : null,
        perl: langs.perl ? langs.perl() : null,
        sql: langs.sql ? langs.sql() : null,
        shell: langs.shell ? langs.shell() : null,
        json: langs.json ? langs.json() : null,
      };

      // コード内容変更時の処理
      const onInputChange = (value: string) => {
        setCodeValue(value);
        // BlockNote 側のブロック内容を更新
        props.editor.updateBlock(props.block, {
          props: { ...props.block.props, code: value },
        });
      };

      return (
        <MantineProvider>
          <div className="w-full">
            {/* ヘッダー：言語選択 */}
            <div className="flex justify-between items-center bg-gray-900 text-white px-4 py-2 rounded-t-lg">
              <span className="text-sm font-mono">コード</span>
              <select
                className="bg-gray-800 text-white text-sm font-mono outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.keys(languageExtensions).map((langKey) => (
                  <option key={langKey} value={langKey}>
                    {langKey.charAt(0).toUpperCase() + langKey.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {/* コードエディター部分 */}
            <div className="rounded-b-lg shadow-lg overflow-x-auto">
              <ReactCodeMirror
                id={props.block.id}
                autoFocus
                placeholder="Write your code here..."
                style={{ width: "100%", resize: "vertical" }}
                value={codeValue}
                height="100%"
                width="100%"
                // basicSetup で行番号を有効化、かつ EditorView.lineWrapping を追加
                basicSetup={{ lineNumbers: true }}
                extensions={[
                  languageExtensions[language] || langs.javascript(),
                  EditorView.lineWrapping,
                  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                  bracketMatching(),
                  highlightActiveLine(),
                  highlightActiveLineGutter(),
                ]}
                theme="dark"
                onChange={(value: string) => onInputChange(value)}
              />
            </div>
          </div>
        </MantineProvider>
      );
    },
    toExternalHTML: ({ block }: any) => {
      return (
        <pre>
          <code>{block?.props?.code}</code>
        </pre>
      );
    },
  }
);
