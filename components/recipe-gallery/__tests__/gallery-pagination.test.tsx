import { GalleryPagination } from '../gallery-pagination.client';
import { withMockNavigation } from '@/__mocks__/nextMocks';
import { describe, it, expect, afterEach } from 'bun:test';
import { screen, render, within, cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('Given Gallery Pagination component', () => {
  it('should render three list items when there is one page', () => {
    withMockNavigation();
    render(<GalleryPagination pageCount={1} />);
    const pagination = screen.getByRole('navigation');
    const { getAllByRole } = within(pagination);
    expect(getAllByRole('listitem')).toHaveLength(3);
  });

  it('should render no more than seven list items', () => {
    withMockNavigation();
    render(<GalleryPagination pageCount={10} />);
    const pagination = screen.getByRole('navigation');
    const { getAllByRole } = within(pagination);
    expect(getAllByRole('listitem')).toHaveLength(7);
  });

  it('should set aria current based on search params', () => {
    withMockNavigation({ searchParams: { page: '4' } });
    render(<GalleryPagination pageCount={10} />);
    const current = screen.getByRole('link', { current: 'page' });
    expect(current.innerText).toBe('4');
  });

  it('should disable previous button when on first page', () => {
    withMockNavigation();
    render(<GalleryPagination pageCount={7} />);
    const current = screen.getByRole('link', { current: 'page' });
  });
});
