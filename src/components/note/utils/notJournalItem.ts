export const notJournalItem = (i: any) => {
  const notSheetItems = Object.entries(i)
  .filter(
    ([key, value]: any) => key === "root" || value.data.type !== "journals"
  )
  .reduce((obj: any, [key, value]: any) => {
    obj[key] = value;
    return obj;
  }, {});

  return notSheetItems
}
