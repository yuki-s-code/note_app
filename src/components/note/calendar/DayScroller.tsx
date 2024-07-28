import React, { useEffect, useRef, useState } from "react";
import { addDays, differenceInDays, format } from "date-fns";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

export const DayScroller: React.FC<{
  selectedDate: Date | null;
  setSelected: (date: Date | null) => void;
  setMonth: (date: Date) => void;
  handleTodayClick: any;
}> = ({ selectedDate, setSelected, setMonth, handleTodayClick }) => {
  const [daysToDisplay, setDaysToDisplay] = useState<Date[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevDay = () => {
    if (selectedDate) {
      setSelected(addDays(selectedDate, -1));
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      setSelected(addDays(selectedDate, 1));
    }
  };

  const handleDayClick = (day: Date) => {
    setSelected(day);
    setMonth(new Date(day.getFullYear(), day.getMonth(), 1)); // 選択された日付の月の1日を設定
  };

  useEffect(() => {
    if (selectedDate) {
      const todayIndex = 3; // 7日間のうち、中央が今日
      const startDate = addDays(selectedDate, -todayIndex);
      const endDate = addDays(selectedDate, 6 - todayIndex);
      const daysCount = differenceInDays(endDate, startDate) + 1;
      const days = Array.from({ length: daysCount }, (_, i) =>
        addDays(startDate, i)
      );
      setDaysToDisplay(days);

      // 中央にスクロールするアニメーション (初回のみ)
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          const targetScrollLeft =
            (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
          scrollContainer.scrollLeft = targetScrollLeft;
          setIsAnimating(false);
        }, 100); // 少し遅らせてスムーズにアニメーションさせる
      }
    } else {
      setDaysToDisplay([]);
    }
  }, [selectedDate, scrollContainerRef.current]);

  useEffect(() => {
    let animationFrameId: number | null = null;
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer && isAnimating) {
      let startTime: number | null = null;
      const scrollAnimation = (currentTime: number) => {
        if (!startTime) {
          startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
        const duration = 500; // アニメーションの所要時間（ミリ秒）
        const progress = Math.min(elapsedTime / duration, 1);
        const targetScrollLeft =
          scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollContainer.scrollLeft = targetScrollLeft * progress;
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(scrollAnimation);
        } else {
          setIsAnimating(false);
        }
      };
      animationFrameId = requestAnimationFrame(scrollAnimation);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAnimating, scrollContainerRef.current]);

  return (
    <div className="flex items-center border-b-2 border-gray-100">
      <button className=" text-xl cursor-pointer" onClick={handlePrevDay}>
        <HiChevronLeft />
      </button>
      <div
        className="flex flex-wrap overflow-hidden whitespace-nowrap"
        ref={scrollContainerRef}
      >
        {daysToDisplay.map((day, i) => (
          <Link key={i} to={`/root/note/journals/${format(day, "yyyy-MM-dd")}`}>
            <div
              className={`text-xs inline-block items-center justify-center py-1 w-[88px] cursor-pointer rounded-md hover:bg-gray-200 ${
                //@ts-ignore
                format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                  ? "bg-blue-600 rounded-full text-white"
                  : ""
              }`}
              key={format(day, "yyyy-MM-dd")}
              onClick={() => handleDayClick(day)}
            >
              <div className=" ml-[32px] text-current">
                {format(day, "EEE")}
              </div>
              <div className=" ml-[32px]">
                <span>{format(day, "M/d")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button
        className="px-2 py-2 text-xl cursor-pointer"
        onClick={handleNextDay}
      >
        <HiChevronRight />
      </button>
      <button
        className="ml-2 px-2 py-2 bg-gray-100 text-xs text-blue-gray-500 rounded-md hover:bg-gray-200"
        onClick={handleTodayClick}
      >
        Today
      </button>
    </div>
  );
};
