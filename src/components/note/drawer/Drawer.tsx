import DrawerSheetTop from "./sheet/DrawerSheetTop";
import { useAppSelector } from "@/libs/app/hooks";
import { selectMentionBlock } from "@/slices/noteSlice";
import { DrawerTop } from "./DrawerTop";

export const Drawer = () => {
  const { mentionType }: any = useAppSelector(selectMentionBlock);

  return (
    <div>{mentionType == "sheet" ? <DrawerSheetTop /> : <DrawerTop />}</div>
  );
};
