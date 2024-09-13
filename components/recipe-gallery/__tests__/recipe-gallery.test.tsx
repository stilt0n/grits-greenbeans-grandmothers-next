import {
  mockLoadPageCountAction as loadPageCountAction,
  mockLoadRecipeAction as loadRecipeAction,
} from '@/__mocks__/loadRecipes';
import { withMockNavigation } from '@/__mocks__/nextMocks';
import { it, describe, expect } from 'bun:test';
import { render, screen, within } from '@testing-library/react';
import RecipeGallery, { type RecipeGalleryProps } from '../recipe-gallery';

describe('Given Recipe Gallery component', () => {
  const renderGallery = ({
    page = 1,
    pageSize = 10,
  }: Partial<Pick<RecipeGalleryProps, 'page' | 'pageSize'>>) => {
    const props = {
      page,
      pageSize,
      loadPageCountAction,
      loadRecipeAction,
    };
    return render(<RecipeGallery {...props} />);
  };

  it.todo('limits gallery items to page size', () => {
    withMockNavigation();
    const pageSize = 10;
    renderGallery({ pageSize });
    const [gallery] = screen.getAllByRole('list');
    const { getAllByRole } = within(gallery);
    expect(getAllByRole('listitem')).toHaveLength(pageSize);
  });

  it.todo('shows items based on search params', () => {
    withMockNavigation({ searchParams: { page: '3' } });
    renderGallery({});
    const activePage = screen.getByRole('link', { current: 'page' });
    expect(activePage).toHaveTextContent('3');
    expect(screen.getByText('Recipe 30')).toBeInTheDocument();
    expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
  });
});
