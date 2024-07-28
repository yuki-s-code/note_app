import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const EmojiPicker = ({ icon, onChange }: any) => {
  const [isShowPicker, setIsShowPicker] = useState(false);

  const showPicker: any = () => setIsShowPicker(!isShowPicker);

  const selectEmoji = (e: any) => {
    const emojiCode = e.unified.split("-");
    let codesArray: any = [];
    emojiCode.forEach((el: any) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setIsShowPicker(false);
    onChange(emoji);
  };
  return (
    <>
      <div
        className={
          icon
            ? " text-8xl w-24 h-24 cursor-pointer"
            : "text-8xl cursor-pointer w-12 h-12 border-2 border-dashed"
        }
        onClick={() => showPicker()}
      >
        {icon}
      </div>
      <div className={isShowPicker ? "block absolute z-50" : "hidden"}>
        <Picker data={data} onEmojiSelect={selectEmoji} />
      </div>
    </>
  );
};

export default EmojiPicker;
