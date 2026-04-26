import { describe, it, expect } from 'bun:test';
import {
  convertPageToForm,
  convertFormDataToRecipe,
  recipeToFormData,
  convertImageUrlToImageId,
  convertRecipeToPromptContext,
  convertNluxChatHistory,
} from '../parsers';
import { IMAGE_BASE_URL } from '../../constants';

describe('convertPageToForm', () => {
  it('drops imageUrl, stringifies tags, and preserves remaining fields', () => {
    const result = convertPageToForm({
      title: 'Cornbread',
      description: 'Skillet cornbread',
      instructions: '<p>mix and bake</p>',
      author: 'grandma',
      recipeTime: '40 minutes',
      imageUrl: 'https://example.com/image.png',
      tags: ['southern', 'baking'],
    });

    expect(result).toEqual({
      title: 'Cornbread',
      description: 'Skillet cornbread',
      instructions: '<p>mix and bake</p>',
      author: 'grandma',
      recipeTime: '40 minutes',
      tags: JSON.stringify(['southern', 'baking']),
      imageFileList: null,
      cropCoordinates: null,
    });
    expect(result).not.toHaveProperty('imageUrl');
  });

  it('defaults missing recipeTime to null', () => {
    const result = convertPageToForm({
      title: 'Quick Soup',
      description: 'Easy soup',
      instructions: '<p>simmer</p>',
      author: null,
      imageUrl: null,
      tags: [],
    });
    expect(result.recipeTime).toBeNull();
  });
});

describe('convertFormDataToRecipe', () => {
  const buildFormData = (entries: Record<string, string>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entries)) fd.append(k, v);
    return fd;
  };

  it('converts the literal string "null" back into null', () => {
    const fd = buildFormData({
      title: 'Pie',
      description: 'A pie',
      instructions: '<p>bake</p>',
      author: 'null',
      recipeTime: 'null',
      tags: 'null',
      cropCoordinates: 'null',
    });
    const result = convertFormDataToRecipe(fd);
    expect(result.author).toBeNull();
    expect(result.recipeTime).toBeNull();
    expect(result.tags).toBeNull();
    expect(result.cropCoordinates).toBeNull();
  });

  it('parses tag and cropCoordinate JSON strings into structured values', () => {
    const fd = buildFormData({
      title: 'Pie',
      description: 'A pie',
      instructions: '<p>bake</p>',
      tags: JSON.stringify(['dessert', 'baking']),
      cropCoordinates: JSON.stringify({
        x: 10,
        y: 20,
        width: 100,
        height: 200,
      }),
    });
    const result = convertFormDataToRecipe(fd);
    expect(result.tags).toEqual(['dessert', 'baking']);
    expect(result.cropCoordinates).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 200,
    });
  });

  it('throws when required fields are missing under the strict schema', () => {
    const fd = buildFormData({ description: 'a thing' });
    expect(() => convertFormDataToRecipe(fd)).toThrow();
  });

  it('accepts partial data with the optional flag', () => {
    const fd = buildFormData({ title: 'Just a title' });
    const result = convertFormDataToRecipe(fd, { optional: true });
    expect(result.title).toBe('Just a title');
    expect(result).not.toHaveProperty('description');
  });
});

describe('recipeToFormData', () => {
  it('serializes nullish fields to the literal string "null"', () => {
    const fd = recipeToFormData({
      title: 'Pie',
      description: 'A pie',
      instructions: '<p>bake</p>',
      author: null,
      recipeTime: null,
      tags: null,
      cropCoordinates: null,
      imageFileList: null,
    });
    expect(fd.get('author')).toBe('null');
    expect(fd.get('recipeTime')).toBe('null');
    expect(fd.get('tags')).toBe('null');
    expect(fd.get('cropCoordinates')).toBe('null');
  });

  it('does not append an image field when imageFileList is null', () => {
    const fd = recipeToFormData({ title: 'x', imageFileList: null });
    expect(fd.has('image')).toBe(false);
  });

  it('appends a single image when imageFileList contains exactly one file', () => {
    const file = new File(['data'], 'pic.png', { type: 'image/png' });
    const fakeList = { length: 1, 0: file } as unknown as FileList;
    const fd = recipeToFormData({ title: 'x', imageFileList: fakeList });
    expect(fd.get('image')).toBe(file);
  });

  it('throws when imageFileList contains more than one file', () => {
    const fakeList = { length: 2 } as unknown as FileList;
    expect(() =>
      recipeToFormData({ title: 'x', imageFileList: fakeList })
    ).toThrow(TypeError);
  });
});

describe('convertImageUrlToImageId', () => {
  it('strips the configured image base url and /images/ prefix', () => {
    const url = `${IMAGE_BASE_URL}/images/abc-123.png`;
    expect(convertImageUrlToImageId(url)).toBe('abc-123.png');
  });

  it('returns the original string when it does not match the prefix', () => {
    expect(convertImageUrlToImageId('https://other.example.com/foo.png')).toBe(
      'https://other.example.com/foo.png'
    );
  });
});

describe('convertRecipeToPromptContext', () => {
  it('includes a recipe-time line when recipeTime is provided', () => {
    const out = convertRecipeToPromptContext({
      title: 'Pie',
      description: 'A pie',
      instructions: 'mix\nbake',
      recipeTime: '1 hour',
    });
    expect(out).toContain("<p class='recipe-time'>1 hour</p>");
    expect(out).toContain("<h1 class='title'>Pie</h1>");
    expect(out).toContain("<h2 class='description'>A pie</h2>");
  });

  it('omits the recipe-time line when recipeTime is empty/nullish', () => {
    const out = convertRecipeToPromptContext({
      title: 'Pie',
      description: 'A pie',
      instructions: 'mix',
      recipeTime: null,
    });
    expect(out).not.toContain('recipe-time');
  });

  it('indents non-empty instruction lines and leaves blank lines empty', () => {
    const out = convertRecipeToPromptContext({
      title: 't',
      description: 'd',
      instructions: 'step one\n\nstep two',
      recipeTime: null,
    });
    expect(out).toContain('  step one');
    expect(out).toContain('  step two');
    // blank line should not be indented to "  "
    expect(out).not.toContain('  \n');
  });
});

describe('convertNluxChatHistory', () => {
  it('returns an empty array when chatHistory is undefined', () => {
    expect(convertNluxChatHistory()).toEqual([]);
  });

  it('passes through string messages unchanged', () => {
    const result = convertNluxChatHistory([{ role: 'user', message: 'hello' }]);
    expect(result).toEqual([{ role: 'user', content: 'hello' }]);
  });

  it('joins streamed string[] message chunks into a single string', () => {
    const result = convertNluxChatHistory([
      { role: 'assistant', message: ['hel', 'lo ', 'world'] },
    ]);
    expect(result).toEqual([{ role: 'assistant', content: 'hello world' }]);
  });
});
