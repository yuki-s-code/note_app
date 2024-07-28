import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import CalendarApp from "./CalendarApp";
import { DayScroller } from "./DayScroller";
import { JournalEditor } from "./JournalEditor";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CalendarDaysIcon } from "lucide-react";
import { SuccessToast } from "@/components/atoms/toast/SuccessToast";
import toast from "react-hot-toast/headless";

export const JournalApp = memo(() => {
  const { mentionId }: any = useParams();
  const navigate = useNavigate();
  const [selected, setSelected]: any = useState<Date | null>(new Date());
  const [openRight, setOpenRight] = useState(false);
  const [calendarWidth, setCalendarWidth] = useState(300); // Initial width
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0); // ドラッグ開始時のX座標
  const [saveSuccess, setSaveSuccess]: any = useState(false);

  if (saveSuccess) {
    toast("Save was success");
  }

  const handleMouseDown = (e: any) => {
    setSaveSuccess(false);
    setIsResizing(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setSaveSuccess(false);
    setIsResizing(false);
  };

  const handleMouseMove = (e: any) => {
    if (isResizing) {
      setSaveSuccess(false);
      const deltaX = startX - e.clientX;
      const newWidth = calendarWidth + deltaX;

      setCalendarWidth(Math.max(newWidth, 200)); // 最小幅は200px
      setStartX(e.clientX); // 開始位置を更新
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const today = new Date();
  const [month, setMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  ); // todayの月を初期値にする
  const handleTodayClick = () => {
    setSaveSuccess(false);
    const today = new Date();
    setSelected(today);
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    navigate(`/root/note/journals/${format(today, "yyyy-MM-dd")}`);
  };

  return (
    <>
      <div>
        <div>
          <div className="sticky top-0 z-10 bg-white h-12 gap-2 flex justify-between">
            <div className=" h-12">
              {selected && (
                <DayScroller
                  selectedDate={selected}
                  setSelected={setSelected}
                  setMonth={setMonth}
                  handleTodayClick={handleTodayClick}
                />
              )}
              <div className=" relative z-0">
                <JournalEditor
                  openRight={openRight}
                  setSaveSuccess={setSaveSuccess}
                />
              </div>
            </div>
            <div>
              <div className="flex relative z-0">
                {openRight ? (
                  <div
                    className="sticky top-12 flex-none"
                    style={{ width: calendarWidth }}
                  >
                    <div className=" flex">
                      <div
                        className="h-[700px] duration-200 hover:bg-gray-400 hover:duration-200 ease-in-out w-1 hover:w-1 bg-gray-100 cursor-ew-resize z-10"
                        //@ts-ignore
                        onMouseDown={handleMouseDown}
                        onDoubleClick={() => setOpenRight(false)}
                      />
                      <div
                        className=" z-40"
                        style={{ width: calendarWidth - 4 }}
                      >
                        <CalendarApp
                          selected={selected}
                          onSelect={setSelected}
                          month={month}
                          onMonthChange={setMonth}
                          today={today}
                          handleTodayClick={handleTodayClick}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className=" cursor-pointer mr-4 mt-2 text-blue-gray-200 hover:text-blue-gray-400"
                    onClick={() => setOpenRight(true)}
                  >
                    <CalendarDaysIcon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto z-50">
        {mentionId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} // 初期状態: 非表示、少し縮小
            animate={{ opacity: 1, scale: 1 }} // アニメーション後: 表示、元のサイズ
            exit={{ opacity: 0, scale: 0.9 }} // コンポーネントが消える際のアニメーション
            transition={{ duration: 0.5 }} // アニメーション時間
            className="fixed top-12"
          >
            <Outlet />
          </motion.div>
        )}
      </div>
      <SuccessToast />
    </>
  );
});
