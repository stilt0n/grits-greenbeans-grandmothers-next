import { RecipeForm } from '@/components/recipe-edit-form.client';
import { it, describe, expect, mock, afterEach } from 'bun:test';
import { screen, render, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('given a default recipe edit form', () => {
  afterEach(() => {
    cleanup();
  });

  it('invalid input blocks form submission', async () => {
    // the optional event argument complicates using the mock api here
    let callData = {};
    const onSuccess = mock((data) => {
      callData = data;
    });
    const onError = mock(() => {});
    const initialData = {
      title: 'Test',
      description: 'This is a test recipe',
      author: 'grandmother_bot',
      recipeTime: '20 minutes',
      imageUrl: null,
      instructions: '<p>test recipe</p>',
    };

    render(
      <RecipeForm
        onSubmitSuccess={onSuccess}
        onSubmitError={onError}
        initialRecipeData={initialData}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(callData).toEqual(initialData);
  });

  it('calls onError when required fields are missing', async () => {
    const onSuccess = mock(() => {});
    const onError = mock(() => {});
    const initialData = {
      title: '',
      description: '',
      author: 'grandmother_bot',
      recipeTime: '20 minutes',
      imageUrl: null,
      instructions: '<p>test recipe</p>',
    };

    render(
      <RecipeForm
        onSubmitSuccess={onSuccess}
        onSubmitError={onError}
        initialRecipeData={initialData}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
