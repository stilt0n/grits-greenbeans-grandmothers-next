'use client';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { parseIntWithFallback, truncateRange, range } from '@/lib/utils';

export interface GalleryPaginationProps {
  pageCount: number;
}

export const GalleryPagination = (props: GalleryPaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = truncateRange(
    parseIntWithFallback(searchParams.get('page'), 1),
    1,
    props.pageCount
  );
  const itemNumbers = getItemNumbers(currentPage, props.pageCount);
  const page = (pageNumber: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      'page',
      truncateRange(pageNumber, 1, props.pageCount).toString()
    );
    return `${pathname}?${newSearchParams.toString()}`;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            aria-disabled={currentPage === 1 || !currentPage}
            href={page(1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={currentPage === 1 || !currentPage}
            href={page(currentPage - 1)}
          />
        </PaginationItem>
        {itemNumbers.map((pageNumber) => (
          <PaginationItem key={`page-${pageNumber}`}>
            <PaginationLink
              isActive={currentPage === pageNumber}
              href={page(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage === props.pageCount}
            href={page(currentPage + 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            aria-disabled={currentPage === props.pageCount || !currentPage}
            href={page(props.pageCount)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const getItemNumbers = (selected: number, max: number) => {
  if (max < 6) {
    return range(1, max + 1);
  }
  if (selected < 3) {
    return range(1, 6);
  }
  if (max - 5 <= selected) {
    return range(max - 4, max + 1);
  }
  return range(selected - 2, selected + 3);
};
