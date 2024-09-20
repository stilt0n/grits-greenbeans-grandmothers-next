'use client';
import { useEffect, type RefObject } from 'react';

export const useFocusHotkey = (key: string, ref: RefObject<any>) => {
  useEffect(() => {
    const onPress = (e: any) => {
      if (e.key === key && !inputLikeElementHasFocus()) {
        e.preventDefault();
        ref.current?.focus();
      }
    };

    document.addEventListener('keydown', onPress);
    return () => document.removeEventListener('keydown', onPress);
  }, [key, ref]);
};

const editableTags = ['INPUT', 'TEXTAREA', 'SELECT'];

const inputLikeElementHasFocus = () => {
  const focusedElement = document.activeElement;
  return (
    focusedElement instanceof HTMLElement &&
    (focusedElement.isContentEditable ||
      editableTags.includes(focusedElement.tagName))
  );
};
