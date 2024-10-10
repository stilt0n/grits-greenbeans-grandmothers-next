'use client';
import type { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons';
import { NumberedListIcon } from '@/components/icons';

const iconSize = 'h-4 w-4';

interface EditorMenuProps {
  editor: Editor | null;
}

type TextLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

const textLevels: TextLevel[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

type EditorAction =
  | 'bold'
  | 'underline'
  | 'italic'
  | 'left'
  | 'center'
  | 'right'
  | 'ol'
  | 'ul'
  | TextLevel;

const getTextFromAbbreviation = (abbreviation: TextLevel) => {
  if (abbreviation.startsWith('h')) {
    return `Heading ${abbreviation[1]}`;
  }
  return 'Paragraph';
};

const getActiveTextLevel = (editor: Editor) => {
  return (
    textLevels.find((lvl) => {
      if (lvl.startsWith('h')) {
        return editor.isActive('heading', { level: parseInt(lvl[1]) });
      }
      return editor.isActive(lvl);
    }) ?? 'p'
  );
};

export const EditorMenu = (props: EditorMenuProps) => {
  if (props.editor === null) {
    // This may not be a good idea
    return null;
  }
  const { editor } = props;
  const onEditorSettingsChange = executeEditorAction.bind(null, props.editor);
  const activeTextLevel = getActiveTextLevel(editor);
  return (
    <div className='flex flex-row h-8'>
      <Toggle
        value='bold'
        pressed={editor.isActive('bold')}
        onPressedChange={() => onEditorSettingsChange('bold')}
      >
        <FontBoldIcon className={iconSize} />
      </Toggle>
      <Toggle
        value='italic'
        pressed={editor.isActive('italic')}
        onPressedChange={() => onEditorSettingsChange('italic')}
      >
        <FontItalicIcon className={iconSize} />
      </Toggle>
      <Toggle
        value='underline'
        pressed={editor.isActive('underline')}
        onPressedChange={() => onEditorSettingsChange('underline')}
      >
        <UnderlineIcon className={iconSize} />
      </Toggle>
      <Separator orientation='vertical' className='mx-2' />
      <Toggle
        value='left'
        pressed={editor.isActive({ textAlign: 'left' })}
        onPressedChange={() => onEditorSettingsChange('left')}
      >
        <TextAlignLeftIcon className={iconSize} />
      </Toggle>
      <Toggle
        value='center'
        pressed={editor.isActive({ textAlign: 'center' })}
        onPressedChange={() => onEditorSettingsChange('center')}
      >
        <TextAlignCenterIcon className={iconSize} />
      </Toggle>
      <Toggle
        value='right'
        pressed={editor.isActive({ textAlign: 'right' })}
        onPressedChange={() => onEditorSettingsChange('right')}
      >
        <TextAlignRightIcon className={iconSize} />
      </Toggle>
      <Separator orientation='vertical' className='mx-2' />
      <Toggle
        value='ul'
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => onEditorSettingsChange('ul')}
      >
        <ListBulletIcon className={iconSize} />
      </Toggle>
      <Toggle
        value='ol'
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => onEditorSettingsChange('ol')}
      >
        <NumberedListIcon />
      </Toggle>
      <Separator orientation='vertical' className='mx-2' />
      <Select
        defaultValue='p'
        onValueChange={(value) => {
          onEditorSettingsChange(value as EditorAction);
        }}
        value={activeTextLevel}
      >
        <SelectTrigger className='w-32 bg-white'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {textLevels.map((value) => {
            return (
              <SelectItem value={value} key={value}>
                {getTextFromAbbreviation(value)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

const executeEditorAction = (editor: Editor | null, action: EditorAction) => {
  if (editor === null) {
    return;
  }
  switch (action) {
    case 'bold':
      editor.chain().focus().toggleBold().run();
      break;
    case 'underline':
      editor.chain().focus().toggleUnderline().run();
      break;
    case 'italic':
      editor.chain().focus().toggleItalic().run();
      break;
    case 'left':
      editor.chain().focus().setTextAlign('left').run();
      break;
    case 'center':
      editor.chain().focus().setTextAlign('center').run();
      break;
    case 'right':
      editor.chain().focus().setTextAlign('right').run();
      break;
    case 'ol':
      editor.chain().focus().toggleOrderedList().run();
      break;
    case 'ul':
      editor.chain().focus().toggleBulletList().run();
      break;
    case 'p':
      editor.chain().focus().setParagraph().run();
      break;
    default:
      if (action.startsWith('h')) {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: parseInt(action[1]) as any })
          .run();
      }
  }
};
