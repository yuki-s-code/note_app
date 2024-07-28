import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { FileInput, FileInputProps } from "@mantine/core";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ValueComponent: FileInputProps["valueComponent"] = ({ value }: any) => {
  function getLastIndexOfPath(filePath: string): string {
    const pathParts = filePath.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart;
  }
  const lastIndexPath = getLastIndexOfPath(value.path);
  const date = new Date(value.lastDate);
  const formattedDate = date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  if (value === null) {
    return null;
  }
  console.log(value);
  return (
    <div className=" absolute left-12">
      <div className=" flex justify-between">
        <div className="text-base font-bold ">{lastIndexPath}</div>
        <div className=" text-xs mt-1 ml-12">{formattedDate}</div>
      </div>
    </div>
  );
};

export const InsertFile = createReactBlockSpec(
  {
    type: "file",
    propSchema: {
      //@ts-ignore
      data: {},
    },
    content: "inline",
  },
  {
    render: (props) => {
      const icon = <FileIcon className=" h-4 w-4" />;
      const [value, setValue]: any = useState<File | null>(null);
      console.log(value);

      useEffect(() => {
        setValue(props.block.props.data || null);
      }, [props.block.props.data]);

      const onChangeFile = (v: any) => {
        setValue(v);
        console.log(v);
        if (v) {
          props.editor.updateBlock(props.block, {
            type: "file",
            //@ts-ignore
            props: { data: { path: v.path, lastDate: v.lastModifiedDate } },
          });
        } else {
          props.editor.updateBlock(props.block, {
            type: "file",
            //@ts-ignore
            props: { data: { path: v, lastDate: v } },
          });
        }
      };
      console.log(props.block.props.data);

      return (
        <div className=" mt-5">
          <FileInput
            leftSection={icon}
            clearable
            value={props.block.props.data}
            placeholder="ファイルを選択してください"
            leftSectionPointerEvents="none"
            onChange={(v) => onChangeFile(v)}
            valueComponent={ValueComponent}
          />
          <div ref={props.contentRef} />
        </div>
      );
    },
  }
);
