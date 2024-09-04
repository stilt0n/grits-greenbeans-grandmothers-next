'use client';
import { useId } from 'react';
import { EditorContent } from '@tiptap/react';
import { Label } from '@/components/ui/label';
import { useTipTap } from './useTipTap.client';
import type { UseTipTapProps } from './useTipTap.client';
import { EditorMenu } from './editor-menu.client';
import { cn } from '@/lib/utils';

export interface EditorInputProps extends UseTipTapProps {
  menuAriaLabel: string;
  label: string;
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
  const editorId = useId();
  return (
    <>
      <Label htmlFor={editorId}>{props.label}</Label>
      <div className={cn('mt-4', props.className)}>
        <EditorMenu editor={editor} aria-label={props.menuAriaLabel} />
        <EditorContent
          id={editorId}
          editor={editor}
          className='prose prose-zinc lg:prose-xl outline outline-1 outline-zinc-200 rounded-sm'
        />
      </div>
    </>
  );
};

export default EditorInput;
