import { createReactBlockSpec } from "@blocknote/react";

export const Separator = createReactBlockSpec(
  {
    type: "separator",
    propSchema: {},
    content: "none",
  },
  {
    render: ({ block }: any) => {
      return <hr id={block?.id} />;
    },
    toExternalHTML: () => {
      return <hr />;
    },
  }
);
