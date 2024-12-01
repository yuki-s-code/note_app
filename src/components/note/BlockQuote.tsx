//BlockQuote.tsx

import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { MantineProvider } from "@mantine/core";

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
