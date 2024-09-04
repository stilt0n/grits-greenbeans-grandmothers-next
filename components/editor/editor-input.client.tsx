'use client';
import { EditorContent } from '@tiptap/react';
import { useTipTap } from './useTipTap.client';
import type { UseTipTapProps } from './useTipTap.client';
import { EditorMenu } from './editor-menu.client';

export interface EditorInputProps extends UseTipTapProps {
  className?: string;
}

const EditorInput = ({
  onChange,
  initialContent,
  ...props
}: EditorInputProps) => {
  const { editor } = useTipTap({
    onChange,
    initialContent,
  });
  return (
    <div className={props.className}>
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} className='prose prose-zinc lg:prose-xl' />
    </div>
  );
};

export default EditorInput;
