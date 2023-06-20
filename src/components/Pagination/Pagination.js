import { useMemo } from "react";
export const DOTS = "...";
const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};

export const usePaginationRange = ({
  totalPages,
  buttonConst=3,
  siblingCount=1,
  currentPage,
}) => {
    const paginationRange = useMemo(() => {
        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumbers = buttonConst + 2 * siblingCount;

        /*
            If the number of pages is less than the page numbers we want to show in our
            paginationComponent, we return the range [1..totalPages]
            */
        if (totalPageNumbers >= totalPages) {
        return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
        currentPage + siblingCount,
        totalPages
        );

        /*
        We do not want to show dots if there is only one position left 
        after/before the left/right page count as that would lead to a change if our Pagination
        component size which we do not want
        */
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex <= totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * siblingCount;
        let leftRange = range(1, leftItemCount);

        return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * siblingCount;
        let rightRange = range(
            totalPages - rightItemCount + 1,
            totalPages
        );

        return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalPages, siblingCount, currentPage, buttonConst]);

    return paginationRange;
};