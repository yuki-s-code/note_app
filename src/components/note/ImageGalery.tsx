import React, { useCallback } from "react";
import Image01 from "../../assets/image01.jpg";
import Image02 from "../../assets/image02.jpg";
import Image03 from "../../assets/image03.jpeg";
import Image04 from "../../assets/image04.jpeg";
import Image05 from "../../assets/image05.jpeg";
import Image06 from "../../assets/image06.jpg";
import Image07 from "../../assets/image07.jpg";
import Image08 from "../../assets/Image08.jpg";
import Image09 from "../../assets/Image09.jpg";
import Image10 from "../../assets/Image10.jpg";
import Image11 from "../../assets/Image11.jpg";
import Image12 from "../../assets/Image12.jpg";
import Image13 from "../../assets/Image13.jpg";
import Image14 from "../../assets/Image14.jpg";
import Image15 from "../../assets/Image15.jpg";
import Image16 from "../../assets/Image16.jpg";
import Image17 from "../../assets/Image17.jpg";
import Image18 from "../../assets/Image18.jpg";
import Image19 from "../../assets/Image19.jpg";
import Image20 from "../../assets/Image20.jpg";
import Image21 from "../../assets/Image21.jpg";
import Image22 from "../../assets/Image22.jpg";
import Image23 from "../../assets/Image23.jpg";
import Image24 from "../../assets/Image24.jpeg";
import Image25 from "../../assets/Image25.jpg";
import Image26 from "../../assets/Image26.jpg";
import Image27 from "../../assets/Image27.jpg";
import Image28 from "../../assets/Image28.jpg";
import Image29 from "../../assets/Image29.jpg";
import Image30 from "../../assets/Image30.jpg";
import Image31 from "../../assets/Image31.jpg";
import Image32 from "../../assets/Image32.jpg";
import Image33 from "../../assets/Image33.jpg";
import Image34 from "../../assets/Image34.jpg";
import Image35 from "../../assets/Image35.jpg";
import Image36 from "../../assets/Image36.jpg";
import Image37 from "../../assets/Image37.jpg";
import Image38 from "../../assets/Image38.jpg";
import Image39 from "../../assets/Image39.jpg";
import Image40 from "../../assets/Image40.jpg";
import Image41 from "../../assets/Image41.jpg";
import Image42 from "../../assets/Image42.jpg";
import Image43 from "../../assets/Image43.jpg";
import Image44 from "../../assets/Image44.jpg";
import Image45 from "../../assets/Image45.jpg";
import Image46 from "../../assets/Image46.jpg";
import Image47 from "../../assets/Image47.jpg";
import Image48 from "../../assets/Image48.jpg";
import Image49 from "../../assets/Image49.jpg";
import Image50 from "../../assets/Image50.jpg";
import Image51 from "../../assets/Image51.jpg";
import Image52 from "../../assets/Image52.jpg";
import Image53 from "../../assets/Image53.jpg";
import Image54 from "../../assets/Image54.jpg";
import Image55 from "../../assets/Image55.jpg";
import Image56 from "../../assets/Image56.jpg";
import Image57 from "../../assets/Image57.jpg";
import Image58 from "../../assets/Image58.jpg";
import Image59 from "../../assets/Image59.jpg";
import Image60 from "../../assets/Image60.jpg";
import Image61 from "../../assets/Image61.jpg";
import Image62 from "../../assets/Image62.jpg";
import Image63 from "../../assets/Image63.jpg";
import Image64 from "../../assets/Image64.jpg";
import Image65 from "../../assets/Image65.jpg";
import Image66 from "../../assets/Image66.jpg";
import Image67 from "../../assets/Image67.jpg";
import Image68 from "../../assets/Image68.jpg";
import Image69 from "../../assets/Image69.jpg";
import Image70 from "../../assets/Image70.jpg";
import Image71 from "../../assets/Image71.jpg";
import Image72 from "../../assets/Image72.jpg";
import Image73 from "../../assets/Image73.jpg";
import Image74 from "../../assets/Image74.jpg";
import Image75 from "../../assets/Image75.jpg";
import Image76 from "../../assets/Image76.jpg";
import Image77 from "../../assets/Image77.jpg";
import Image78 from "../../assets/Image78.jpg";
import Image79 from "../../assets/Image79.jpg";
import Image80 from "../../assets/Image80.jpg";
import { useAppDispatch, useAppSelector } from "@/libs/app/hooks";
import { useParams } from "react-router-dom";
import {
  selectComplexAllFolder,
  selectTitleId,
  setComplexAllFolder,
} from "@/slices/noteSlice";
import { useMutateFolderBlocks } from "@/libs/hooks/noteHook/useMutateFolderBlocks";

export const ImageGalery = () => {
  const data = [
    {
      imgelink: Image01,
    },
    {
      imgelink: Image02,
    },
    {
      imgelink: Image03,
    },
    {
      imgelink: Image04,
    },
    {
      imgelink: Image05,
    },
    {
      imgelink: Image06,
    },
    {
      imgelink: Image07,
    },
    {
      imgelink: Image08,
    },
    {
      imgelink: Image09,
    },
    {
      imgelink: Image10,
    },
    {
      imgelink: Image11,
    },
    {
      imgelink: Image12,
    },
    {
      imgelink: Image13,
    },
    {
      imgelink: Image14,
    },
    {
      imgelink: Image15,
    },
    {
      imgelink: Image16,
    },
    {
      imgelink: Image17,
    },
    {
      imgelink: Image18,
    },
    {
      imgelink: Image19,
    },
    {
      imgelink: Image20,
    },
    {
      imgelink: Image21,
    },
    {
      imgelink: Image22,
    },
    {
      imgelink: Image23,
    },
    {
      imgelink: Image24,
    },
    {
      imgelink: Image25,
    },
    {
      imgelink: Image26,
    },
    {
      imgelink: Image27,
    },
    {
      imgelink: Image28,
    },
    {
      imgelink: Image29,
    },
    {
      imgelink: Image30,
    },
    {
      imgelink: Image31,
    },
    {
      imgelink: Image32,
    },
    {
      imgelink: Image33,
    },
    {
      imgelink: Image34,
    },
    {
      imgelink: Image35,
    },
    {
      imgelink: Image36,
    },
    {
      imgelink: Image37,
    },
    {
      imgelink: Image38,
    },
    {
      imgelink: Image39,
    },
    {
      imgelink: Image40,
    },
    {
      imgelink: Image41,
    },
    {
      imgelink: Image42,
    },
    {
      imgelink: Image43,
    },
    {
      imgelink: Image44,
    },
    {
      imgelink: Image45,
    },
    {
      imgelink: Image46,
    },
    {
      imgelink: Image47,
    },
    {
      imgelink: Image48,
    },
    {
      imgelink: Image49,
    },
    {
      imgelink: Image50,
    },
    {
      imgelink: Image51,
    },
    {
      imgelink: Image52,
    },
    {
      imgelink: Image53,
    },
    {
      imgelink: Image54,
    },
    {
      imgelink: Image55,
    },
    {
      imgelink: Image56,
    },
    {
      imgelink: Image57,
    },
    {
      imgelink: Image58,
    },
    {
      imgelink: Image59,
    },
    {
      imgelink: Image60,
    },
    {
      imgelink: Image61,
    },
    {
      imgelink: Image62,
    },
    {
      imgelink: Image63,
    },
    {
      imgelink: Image64,
    },
    {
      imgelink: Image65,
    },
    {
      imgelink: Image66,
    },
    {
      imgelink: Image67,
    },
    {
      imgelink: Image68,
    },
    {
      imgelink: Image69,
    },
    {
      imgelink: Image70,
    },
    {
      imgelink: Image71,
    },
    {
      imgelink: Image72,
    },
    {
      imgelink: Image73,
    },
    {
      imgelink: Image74,
    },
    {
      imgelink: Image75,
    },
    {
      imgelink: Image76,
    },
    {
      imgelink: Image77,
    },
    {
      imgelink: Image78,
    },
    {
      imgelink: Image79,
    },
    {
      imgelink: Image80,
    },
  ];

  const dispatch = useAppDispatch();
  const { noteId }: any = useParams();
  const titleId: any = useAppSelector(selectTitleId);
  const i: any = useAppSelector(selectComplexAllFolder);
  const { updateTreeImage }: any = useMutateFolderBlocks();

  const onClickImage = useCallback(
    (t: any) => {
      dispatch(
        setComplexAllFolder({
          ...i,
          [noteId]: {
            ...i[noteId],
            data: {
              ...i[noteId].data,
              image: t,
            },
          },
        })
      );
      console.log({ index: titleId.index, data: t });
      updateTreeImage.mutate({ index: titleId.index, data: t });
    },
    [i, noteId, dispatch, updateTreeImage]
  );

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 gap-4">
        {data.map(({ imgelink }, index) => (
          <div key={index} onClick={() => onClickImage(imgelink)}>
            <img
              src={imgelink}
              className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
              alt="gallery-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
