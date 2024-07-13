"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { formUrlQuery } from "@/utils/url";
import { ApiMetadata } from "@/types/api";

type Props = {
  pageNumber: number;
  isNext: boolean;
  metadata: ApiMetadata;
};

const TablePagination: React.FC<Props> = ({ pageNumber, isNext, metadata }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const totalPages = metadata.last_page;

    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (pageNumber <= 3) {
        // Near the beginning
        pageNumbers.push(1, 2, 3, "ellipsis", totalPages);
      } else if (pageNumber >= totalPages - 2) {
        // Near the end
        pageNumbers.push(
          1,
          "ellipsis",
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // In the middle
        pageNumbers.push(
          1,
          "ellipsis",
          pageNumber - 1,
          pageNumber,
          pageNumber + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {metadata.current_page > metadata.first_page && (
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => handleNavigation("prev")}
            />
          </PaginationItem>
        )}
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                className="cursor-pointer"
                isActive={page === pageNumber}
                onClick={() =>
                  router.push(
                    formUrlQuery({
                      params: searchParams.toString(),
                      key: "page",
                      value: page.toString(),
                    }),
                  )
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {pageNumber < metadata.last_page && (
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => handleNavigation("next")}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
