'use client';
import { useState, useEffect, SyntheticEvent } from 'react';
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export const useImageFileUrl = (fileList: FileList | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (fileList?.length === 1) {
      const file = fileList[0];
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    }
    setImageUrl(null);
  }, [fileList]);
  return imageUrl;
};

export interface ImageEditorFormProps {
  src: string;
}

// helper to prevent initial percentages from being out of bounds
const getStartingWidthAndHeight = (width: number, height: number) => {
  if (height < width) {
    return [undefined, 90];
  }
  return [90, undefined];
};

const ImageEditorForm = (props: ImageEditorFormProps) => {
  const [crop, setCrop] = useState<Crop>();
  const onImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const [startWidth, startHeight] = getStartingWidthAndHeight(width, height);
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: startWidth,
          height: startHeight,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };
  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.src} onLoad={onImageLoad} alt='' />
    </ReactCrop>
  );
};

export default ImageEditorForm;
