import { GalleryPagination } from '../gallery-pagination.client';
import { withMockNavigation } from '@/__mocks__/nextMocks';
import { describe, it, expect } from 'bun:test';
import { screen, render, within } from '@testing-library/react';

describe('Given Gallery Pagination component', () => {
  it('should render three list items when there is one page', () => {
    withMockNavigation();
    render(<GalleryPagination pageCount={1} />);
    const pagination = screen.getByRole('navigation');
    const { getAllByRole } = within(pagination);
    expect(getAllByRole('listitem')).toHaveLength(5);
  });

  it('should render no more than seven list items', () => {
    withMockNavigation();
    render(<GalleryPagination pageCount={10} />);
    const pagination = screen.getByRole('navigation');
    const { getAllByRole } = within(pagination);
    expect(getAllByRole('listitem')).toHaveLength(9);
  });

  it('should set aria current based on search params', () => {
    withMockNavigation({ searchParams: { page: '4' } });
    render(<GalleryPagination pageCount={10} />);
    const current = screen.getByRole('link', { current: 'page' });
    expect(current).toHaveTextContent('4');
  });

  it('should disable previous and first button when on first page', () => {
    withMockNavigation({ searchParams: { page: '1' } });
    render(<GalleryPagination pageCount={7} />);
    const prev = document.querySelectorAll('[aria-disabled]');
    expect(prev).toHaveLength(2);
    expect(prev[0]).toHaveTextContent(/first/i);
    expect(prev[1]).toHaveTextContent(/previous/i);
  });

  it('should disable last and next button when on last page', () => {
    withMockNavigation({ searchParams: { page: '7' } });
    render(<GalleryPagination pageCount={7} />);
    const next = document.querySelectorAll('[aria-disabled]');
    expect(next).toHaveLength(2);
    expect(next[0]).toHaveTextContent(/next/i);
    expect(next[1]).toHaveTextContent(/last/i);
  });
});
