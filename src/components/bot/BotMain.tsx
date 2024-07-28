import { Typewriter } from "react-simple-typewriter";
import { Fragment } from "react/jsx-runtime";
import { dateNavigation, timeNavigation } from "../note/utils/dateNavigation";

export const BotMain = ({ modelItem }: any) => {
  console.log(modelItem);
  return (
    <div className="flex flex-col items-start text-sm">
      {modelItem.map((i: any, l: any) => (
        <Fragment key={l}>
          {i.path == "bot" ? (
            <>
              <div className="bg-gray-200 rounded-xl px-4 py-2 mb-2 w-auto max-w-[80%] m-4">
                <div className="w-auto max-w-full whitespace-normal break-words">
                  <Typewriter
                    words={i.message}
                    loop={1}
                    // cursor
                    // cursorStyle="_"
                    typeSpeed={40}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
                </div>
              </div>
              <div className="text-gray-400 -mt-1 flex text-xs">
                <div className=" pl-6">{i.timestamp.date}</div>
                <div className=" pl-2">{i.timestamp.time}</div>
              </div>
            </>
          ) : (
            <>
              {i.message.length && (
                <>
                  {i.message.map((ii: any, ll: any) => (
                    <div
                      key={ll}
                      className="bg-blue-500 text-white rounded-xl px-4 py-2 ml-auto flex w-auto max-w-[80%] m-4"
                    >
                      <div className="w-auto max-w-full whitespace-normal break-words">
                        {ii}
                      </div>
                    </div>
                  ))}
                  <div className=" text-gray-400 ml-auto pr-2 -mt-3 flex text-xs">
                    <div className=" pl-6">{i.timestamp.date}</div>
                    <div className=" pl-2">{i.timestamp.time}</div>
                  </div>
                </>
              )}
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};
