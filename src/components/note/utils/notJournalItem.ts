// notJournalItem.ts

export const notJournalItem = (items: any) => {
  // 除外するキー（'journals' タイプのアイテム）を特定
  const keysToExclude = new Set(
    Object.entries(items)
      .filter(
        ([key, value]: [string, any]) =>
          key !== "root" && value.data.type === "journals"
      )
      .map(([key]) => key)
  );

  // 除外されたアイテムを除く新しいアイテムオブジェクトを作成
  const filteredItems = Object.entries(items)
    .filter(([key]) => !keysToExclude.has(key))
    .reduce((obj: any, [key, value]: [string, any]) => {
      obj[key] = { ...value };
      return obj;
    }, {});

  // 他のアイテムの children 配列から除外されたアイテムの参照を削除
  Object.values(filteredItems).forEach((item: any) => {
    if (item.children) {
      item.children = item.children.filter(
        (childId: string) => !keysToExclude.has(childId)
      );
    }
  });

  return filteredItems;
};