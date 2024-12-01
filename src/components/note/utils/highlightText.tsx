//ハイライト
export const highlightText = (text: any, indices: any) => {
  const parts = [];
  let lastIndex = 0;

  indices.forEach((indexArr: any) => {
    const [start, end] = indexArr;
    if (start > lastIndex) {
      parts.push(
        <span key={lastIndex}>{text.substring(lastIndex, start)}</span>
      );
    }
    parts.push(
      <span key={start} style={{ fontWeight: "bold", color: "orange" }}>
        {text.substring(start, end + 1)}
      </span>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
  }

  return parts;
};
