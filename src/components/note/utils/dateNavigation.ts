export const dateNavigation = () => {
  let today = new Date();
  let formattedDate = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  console.log(formattedDate);
  return formattedDate;
};

export const timeNavigation = () => {
  const options: any = {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("ja-JP", options);
  console.log(`東京の現在時刻: ${formatter.format(new Date())}`);
  return formatter.format(new Date());
};
