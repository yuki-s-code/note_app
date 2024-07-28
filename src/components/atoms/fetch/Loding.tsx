export const Loding = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin relative inline-flex justify-center items-center flex-shrink-0 h-6 w-6 rounded-full mr-6"
        aria-hidden="true"
      >
        <span className="absolute -top-1/4 inset-x-0 mx-auto h-2/4 w-2/4 bg-red-600 rounded-full dark:bg-red-300" />
        <span className="absolute top-0 -left-1/4 h-2/4 w-2/4 bg-red-600 scale-90 opacity-75 rounded-full dark:bg-red-300" />
        <span className="absolute top-2/4 -left-1/4 h-2/4 w-2/4 bg-red-600 scale-75 opacity-50 rounded-full dark:bg-red-300" />
        <span className="absolute -bottom-1/4 left-0 h-2/4 w-2/4 bg-red-600 scale-50 opacity-25 rounded-full dark:bg-red-300" />
      </div>
      読み込んでいます
    </div>
  );
};
