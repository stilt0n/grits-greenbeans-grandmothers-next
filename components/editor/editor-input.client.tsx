'use client';
import { useId, HTMLProps } from 'react';
import { EditorContent } from '@tiptap/react';
import { Label } from '@/components/ui/label';
import { useTipTap, UseTipTapProps } from './useTipTap.client';
import { EditorMenu } from './editor-menu.client';
import { cn } from '@/lib/utils';

export interface EditorInputProps extends UseTipTapProps {
  menuAriaLabel: string;
  label: string;
  className?: string;
  inputProps?: Omit<HTMLProps<HTMLInputElement>, 'type' | 'hidden'>;
  errorMessage?: string;
}

const EditorInput = ({
  onChange,
  initialContent,
  inputProps,
  ...props
}: EditorInputProps) => {
  const { editor } = useTipTap({
    onChange,
    initialContent,
  });
  const editorId = useId();
  return (
    <>
      <input
        hidden
        type='text'
        required
        {...inputProps}
        defaultValue={initialContent}
      />
      <Label htmlFor={editorId}>
        {props.label}
        <span className='text-red-700'>*</span>
      </Label>
      <EditorMenu editor={editor} aria-label={props.menuAriaLabel} />
      <EditorContent
        id={editorId}
        editor={editor}
        className={cn(
          'prose prose-zinc lg:prose-xl bg-white',
          'outline outline-1 outline-zinc-200 rounded-sm focus-within:outline-2 focus-within:outline-zinc-400',
          props.className
        )}
      />
      {props.errorMessage ? (
        <span className='text-red-700'>{props.errorMessage}</span>
      ) : null}
    </>
  );
};

export default EditorInput;
