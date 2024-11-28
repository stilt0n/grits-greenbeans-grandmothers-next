'use client';
import { useState, useEffect, SyntheticEvent } from 'react';
import ReactCrop, {
  type Crop,
  PercentCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import { CropCoordinates } from '@/types/recipeTypes';
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
  src: string | null;
  onChange: (coords: CropCoordinates | null) => void;
}

// helper to prevent initial percentages from being out of bounds
const getStartingWidthAndHeight = (width: number, height: number) => {
  if (height < width) {
    return [undefined, 90 * 0.5625];
  }
  return [90, undefined];
};

const scaleCrop = (c: PercentCrop, d: { w: number; h: number }) => ({
  x: (c.x * d.w) / 100,
  y: (c.y * d.h) / 100,
  width: (c.width * d.w) / 100,
  height: (c.height * d.h) / 100,
});

const ImageEditorForm = (props: ImageEditorFormProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>();

  // I'm not really sure if this is a good approach
  // What I want to accomplish is:
  //  - do not render image editor when there is no image
  //  - cropCoordinates should always be null if there is no image
  if (props.src === null) {
    props.onChange(null);
    return null;
  }

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const [startWidth, startHeight] = getStartingWidthAndHeight(width, height);
    setImageDimensions({ width, height });
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: startWidth,
          height: startHeight,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  return (
    <ReactCrop
      crop={crop}
      onChange={(_, c) => setCrop(c)}
      aspect={16 / 9}
      style={{
        maxWidth: '100%',
        width: imageDimensions?.width,
        height: 'auto',
      }}
      keepSelection
      onComplete={(_, c) => {
        if (!imageDimensions) {
          props.onChange(null);
          return;
        }
        const { width: w, height: h } = imageDimensions;
        props.onChange(scaleCrop(c, { w, h }));
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.src} onLoad={onImageLoad} alt='' />
    </ReactCrop>
  );
};

export default ImageEditorForm;
