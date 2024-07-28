import React from "react";
import { useToaster } from "react-hot-toast/headless";

export const SuccessToast = () => {
  const { toasts, handlers }: any = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight }: any = handlers;
  return (
    <div
      className=" fixed bottom-12 left-1/3 text-sm text-blue-gray-300 z-50"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast: any) => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
          gutter: 8,
        });

        const ref = (el: any) => {
          if (el && typeof toast.height !== "number") {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };
        return (
          <div
            key={toast.id}
            ref={ref}
            style={{
              position: "absolute",
              width: "450px",
              textAlign: "center",
              padding: "4px 4px 4px 4px",
              borderRadius: "4px",
              background: "#696969",
              color: "white",
              transition: "all 0.5s ease-out",
              opacity: toast.visible ? 0.5 : 0,
              transform: `translateY(${offset}px)`,
            }}
            {...toast.ariaProps}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
};
