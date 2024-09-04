'use client';
import { mls } from '@/lib/utils';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

export interface UseTipTapProps {
  onChange: (editorContent: string) => void;
  initialContent?: string;
}

const defaultContent = mls`
  <h2>Ingredients</h2>
  <ul>
    <li>Your ingredients go here</li>
  </ul>

  <h2>Instructions</h2>
  <ol>
    <li>What's the first step?</li>
  </ol>
`;

const extensions = [
  StarterKit,
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

export const useTipTap = ({
  onChange,
  initialContent = defaultContent,
}: UseTipTapProps) => {
  const editor = useEditor({
    extensions,
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor?.getHTML() ?? '');
    },
  });
  return { editor };
};
