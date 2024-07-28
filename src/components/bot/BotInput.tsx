import { Textarea, IconButton } from "@material-tailwind/react";
import { dateNavigation, timeNavigation } from "../note/utils/dateNavigation";

export const BotInput = ({
  searchItem,
  setSearchItem,
  modelItem,
  setModelItem,
}: any) => {
  const itemPush = () => {
    setSearchItem([]);
    setModelItem([
      ...modelItem,
      {
        path: "user",
        options: [],
        checkboxes: { items: [], min: 0 },
        message: [searchItem],
        component: null,
        timestamp: { date: dateNavigation(), time: timeNavigation() },
      },
    ]);
  };
  return (
    <div className="flex w-[420px] flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-10/5 p-2">
      <Textarea
        rows={1}
        resize={true}
        value={searchItem}
        onChange={(e: any) => setSearchItem(e.target.value)}
        placeholder="ここに入力してください"
        onPointerEnterCapture
        onPointerLeaveCapture
        className="min-h-full !border-0 focus:border-transparent"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      <IconButton
        variant="text"
        className="rounded-full"
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
        onClick={() => itemPush()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </IconButton>
    </div>
  );
};
