import { VscFoldDown } from "react-icons/vsc";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { BotInput } from "./BotInput";
import { motion, AnimatePresence } from "framer-motion";
import { BotMain } from "./BotMain";
import { BotIcon } from "./BotIcon";
import { dateNavigation, timeNavigation } from "../note/utils/dateNavigation";
import { PencilIcon } from "lucide-react";

export interface modelStyle {
  path: string;
  options: any[];
  checkboxes: object;
  message: string[];
  component: any | null;
  timestamp: string;
}

const initialState = [
  {
    path: "bot",
    options: [],
    checkboxes: { items: [], min: 0 },
    message: [
      "こんにちは！私は、ユニバーです。Shibataが開発した最新のAIアシスタントです。どんな質問やお手伝いが必要か教えてくださいね。芦屋市に関することから日常のちょっとした疑問まで、幅広くサポートしますので、どうぞお気軽にご相談ください！",
    ],
    component: null,
    timestamp: { date: dateNavigation(), time: timeNavigation() },
  },
];

export const BotTop = ({ editedOpen, setEditedOpen }: any) => {
  const [modalOpen, setModalOpen]: any = useState(false);
  const [searchItem, setSearchItem]: any = useState([]);
  const [modelItem, setModelItem]: any = useState(initialState);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const handleClose = () => {
    setSearchItem([]);
    setModelItem(initialState);
    setModalOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <AnimatePresence>
        {!modalOpen ? (
          <Tooltip content="私はユニバーです">
            <motion.div
              className="cursor-pointer -mt-14"
              onClick={() => setModalOpen(true)}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <BotIcon />
            </motion.div>
          </Tooltip>
        ) : (
          <motion.div
            className="w-[450px] h-[640px] bg-white shadow-md border rounded-3xl overflow-hidden flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="p-4 ml-2 flex justify-between">
              <div className="flex">
                <div className="-mt-3">
                  <BotIcon />
                </div>
                <div className="ml-8 mt-2 font-bold text-lg text-gray-600">
                  ユニバー アシスタント
                </div>
                <div
                  className="ml-8 mt-2 font-bold text-lg text-gray-600 cursor-pointer hover:text-gray-800"
                  onClick={() => setEditedOpen(!editedOpen)}
                >
                  <PencilIcon />
                </div>
              </div>
              <div onClick={handleClose}>
                <VscFoldDown
                  size={20}
                  className="mt-4 text-gray-400 cursor-pointer hover:text-gray-800"
                />
              </div>
            </div>
            <div className="border-b-2 border-gray-100 w-10/12 ml-8" />
            <div className="flex-1 overflow-y-auto">
              <BotMain modelItem={modelItem} />
            </div>
            <div className="p-4">
              <BotInput
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                modelItem={modelItem}
                setModelItem={setModelItem}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
