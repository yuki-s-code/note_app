import { isSameDay, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import "react-day-picker/dist/style.css";
import { Link } from "react-router-dom";

export default function CalendarApp({
  selected,
  onSelect,
  month,
  onMonthChange,
  today,
  handleTodayClick,
}: any) {
  const navigate = useNavigate();
  const modifiers = {
    selectedDay: (day: Date) => selected && isSameDay(day, selected),
  };
  const onTheSelect = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    navigate(`/root/note/journals/${formattedDate}`);
    onSelect(date);
  };
  return (
    <div>
      <DayPicker
        mode="single"
        selected={selected}
        //@ts-ignore
        onSelect={onTheSelect}
        // footer={footer}
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays
        modifiers={modifiers}
        modifiersStyles={{
          selectedDay: {
            background: "blue", // 選択された日の文字色を赤に変更
          },
        }}
      />
      <div className=" cursor-pointer -mt-2 p-2 ml-4 w-14 text-xs bg-blue-100 hover:bg-blue-200 rounded-xl">
        <Link to={`/root/note/journals/${format(today, "yyyy-MM-dd")}`}>
          <div onClick={handleTodayClick}>Today</div>
        </Link>
      </div>
    </div>
  );
}
