import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { ChevronDown, PencilIcon, PlusIcon, X } from "lucide-react";

const TABLE_HEAD = ["質問", "回答", "カテゴリー", "キーワード", ""];
const CATEGORY: any = {
  mon: "tuki",
  color: "green",
};

const TABLE_ROWS = [
  {
    id: "id",
    question: "青少年育成課はどこにありますか",
    answer: "南館４階です",
    category: {
      mon: "tuki",
      color: "green",
    },
    keywords: "Organization",
  },
  {
    id: "idd",
    question: "青少年育成課はどこにありますか",
    answer: "南館４階です",
    category: {
      mon: "tuki",
      color: "green",
    },
    keywords: "Organization",
  },
  {
    id: "iddd",
    question: "青少年育成課はどこにありますか",
    answer: "南館４階です",
    category: {
      mon: "tuki",
      color: "green",
    },
    keywords: "Organization",
  },
  {
    id: "idddd",
    question: "青少年育成課はどこにありますか",
    answer: "南館４階です",
    category: {
      mon: "tuki",
      color: "green",
    },
    keywords: "Organization",
  },
  {
    id: "iddddd",
    question: "青少年育成課はどこにありますか",
    answer: "南館４階です",
    category: {
      mon: "tuki",
      color: "green",
    },
    keywords: "Organization",
  },
];

export function BotSetting({ setEditedOpen }: any) {
  return (
    <Card
      className=" h-screen w-screen"
      placeholder="true"
      onPointerEnterCapture
      onPointerLeaveCapture
    >
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none"
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
            >
              Bot管理画面
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
            >
              ここで内容を変更できます
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              variant="outlined"
              size="sm"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
            >
              全てを見る
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" /> 新規作成
            </Button>
            <Button
              className="flex items-center gap-3 ml-12"
              size="sm"
              placeholder="true"
              onPointerEnterCapture
              onPointerLeaveCapture
              onClick={() => setEditedOpen(false)}
            >
              <X strokeWidth={2} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody
        className="overflow-scroll px-0"
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    placeholder="true"
                    onPointerEnterCapture
                    onPointerLeaveCapture
                  >
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronDown strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              ({ id, question, answer, category, keywords }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder="true"
                            onPointerEnterCapture
                            onPointerLeaveCapture
                          >
                            {question}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                          placeholder="true"
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          {answer}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={category.mon}
                          color={category.color}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder="true"
                        onPointerEnterCapture
                        onPointerLeaveCapture
                      >
                        {keywords}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton
                          variant="text"
                          placeholder="true"
                          onPointerEnterCapture
                          onPointerLeaveCapture
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter
        className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
        >
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            placeholder="true"
            onPointerEnterCapture
            onPointerLeaveCapture
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            placeholder="true"
            onPointerEnterCapture
            onPointerLeaveCapture
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
