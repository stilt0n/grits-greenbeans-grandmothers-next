import { describe, it, expect } from 'bun:test';
import type { Editor } from '@tiptap/react';
import {
  getTextFromAbbreviation,
  getActiveTextLevel,
  executeEditorAction,
} from '../editor-menu.client';

describe('getTextFromAbbreviation', () => {
  it('maps heading abbreviations to "Heading N"', () => {
    expect(getTextFromAbbreviation('h1')).toBe('Heading 1');
    expect(getTextFromAbbreviation('h2')).toBe('Heading 2');
    expect(getTextFromAbbreviation('h6')).toBe('Heading 6');
  });

  it('maps "p" to "Paragraph"', () => {
    expect(getTextFromAbbreviation('p')).toBe('Paragraph');
  });
});

const makeEditor = (active: (name: string, attrs?: any) => boolean) =>
  ({ isActive: active }) as unknown as Editor;

describe('getActiveTextLevel', () => {
  it('returns the active heading level when the cursor is in a heading', () => {
    const editor = makeEditor(
      (name, attrs) => name === 'heading' && attrs?.level === 3
    );
    expect(getActiveTextLevel(editor)).toBe('h3');
  });

  it('returns "p" when no heading is active', () => {
    const editor = makeEditor(() => false);
    expect(getActiveTextLevel(editor)).toBe('p');
  });
});

const makeChainEditor = () => {
  const calls: string[] = [];
  const chain: any = new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        if (prop === 'run') return () => true;
        return (...args: unknown[]) => {
          calls.push(
            args.length > 0 ? `${prop}(${JSON.stringify(args[0])})` : prop
          );
          return chain;
        };
      },
    }
  );
  const editor = { chain: () => chain } as unknown as Editor;
  return { editor, calls };
};

describe('executeEditorAction', () => {
  it('is a no-op when the editor is null', () => {
    expect(() => executeEditorAction(null, 'bold')).not.toThrow();
  });

  it.each([
    ['bold', 'toggleBold'],
    ['italic', 'toggleItalic'],
    ['underline', 'toggleUnderline'],
    ['ol', 'toggleOrderedList'],
    ['ul', 'toggleBulletList'],
    ['p', 'setParagraph'],
  ] as const)('maps "%s" to editor.%s', (action, command) => {
    const { editor, calls } = makeChainEditor();
    executeEditorAction(editor, action);
    expect(calls).toContain(command);
  });

  it.each(['left', 'center', 'right'] as const)(
    'maps "%s" to setTextAlign',
    (align) => {
      const { editor, calls } = makeChainEditor();
      executeEditorAction(editor, align);
      expect(calls).toContain(`setTextAlign(${JSON.stringify(align)})`);
    }
  );

  it('maps heading abbreviations to toggleHeading with the correct level', () => {
    const { editor, calls } = makeChainEditor();
    executeEditorAction(editor, 'h4');
    expect(calls).toContain(`toggleHeading(${JSON.stringify({ level: 4 })})`);
  });
});
