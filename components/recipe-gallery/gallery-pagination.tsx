'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
  const page = (pageNumber: number) => `${pathname}?page=${pageNumber}`;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={currentPage === 1}
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
    return range(max - 5, max + 1);
  }
  return range(selected - 2, selected + 2);
};
