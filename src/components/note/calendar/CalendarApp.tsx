// CalendarApp.tsx

import { isSameDay, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useNavigate, Link } from "react-router-dom";
import "react-day-picker/dist/style.css";
import React, { useState } from "react";
import "./styles.css";
import { useQueryJournalsByMonth } from "@/libs/hooks/noteHook/useQueryFolderBlocks";
import { Loding } from "@/components/atoms/fetch/Loding"; // 実際は "Loading" が正しい綴りかもしれません
import { Error } from "@/components/atoms/fetch/Error";
import { UncheckedItems } from "./UncheckedItems";
import { Calendar, ListTodo } from "lucide-react";

export default function CalendarApp({
  selected,
  onSelect,
  month,
  onMonthChange,
  today,
  handleTodayClick,
}: any) {
  const navigate = useNavigate();

  // 選択された月を 'yyyy-MM' 形式にフォーマット
  const formattedMonth = format(month, "yyyy-MM");
  // 新しいフックを使用して特定の月のジャーナルを取得
  const { data, status }: any = useQueryJournalsByMonth(formattedMonth);
  const [onItem, setOnItem]: any = useState(false);

  if (status === "loading") return <Loding />;
  if (status === "error") return <Error />;

  // data?.docs に含まれる index を Date にパースし、
  // 有効日付だけを配列に変換する
  const schedules: Date[] =
    data?.docs
      ?.map((doc: any) => {
        const d = new Date(doc.index);
        // index が "2025-01-09" などでない場合もあるので、NaN チェックをする
        return isNaN(d.valueOf()) ? null : d;
      })
      .filter(Boolean) || []; // null を除外

  // DayPicker に渡す modifiers
  const modifiers = {
    selectedDay: (day: Date) => selected && isSameDay(day, selected),
    hasSchedule: (day: Date) => schedules.some((sch) => isSameDay(day, sch)),
  };

  // 日付クリック時の動作
  const onTheSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      navigate(`/root/note/journals/${formattedDate}`);
      onSelect(date);
    }
  };

  // アイコンの色を動的に変更するための関数
  const getIconColor = (isActive: boolean) =>
    isActive ? "#3b82f6" : "#9ca3af"; // Blue-500 : Gray-400

  return (
    <div>
      <div className=" flex gap-2 ml-4 my-4">
        <ListTodo
          className=" hover:bg-gray-100 cursor-pointer"
          color={getIconColor(onItem)}
          onClick={() => setOnItem(true)}
        />
        <Calendar
          className=" hover:bg-gray-100 cursor-pointer"
          color={getIconColor(!onItem)}
          onClick={() => setOnItem(false)}
        />
      </div>
      {!onItem ? (
        <div>
          <div className="cursor-pointer mt-2 p-2 ml-4 w-14 text-xs bg-blue-100 hover:bg-blue-200 rounded-xl">
            <Link to={`/root/note/journals/${format(today, "yyyy-MM-dd")}`}>
              <div onClick={handleTodayClick}>Today</div>
            </Link>
          </div>
          <DayPicker
            mode="single"
            selected={selected}
            // 選択時に呼び出す関数
            onSelect={onTheSelect}
            month={month}
            onMonthChange={onMonthChange}
            showOutsideDays
            // ここで修飾子をまとめて渡す
            modifiers={modifiers}
            // もしスタイルを当てたいだけなら modifiersStyles にしてもOK
            // ここではクラス指定の例を示す
            modifiersClassNames={{
              selectedDay: "selected-day",
              hasSchedule: "has-schedule",
            }}
          />
        </div>
      ) : (
        <UncheckedItems />
      )}
    </div>
  );
}
