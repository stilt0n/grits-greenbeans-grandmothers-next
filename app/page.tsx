// Temporary
'use client';
import EditorInput from '@/components/editor';

export default function Home() {
  return (
    <EditorInput
      className='mx-8 mt-4'
      onChange={(editorContent) => console.log(editorContent)}
    />
  );
}
