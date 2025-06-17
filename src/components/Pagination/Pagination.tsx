import { useMemo } from 'react'

import ceil from 'lodash/ceil'
import ReactPaginate from 'react-paginate'

import './Pagination.css'

interface iPaginationProps {
  allItemsCount?: number
  marginPagesDisplayed?: number
  nextLabel?: React.ReactNode
  pageNumber?: number
  pageRangeDisplayed?: number
  perPageCount?: number
  previousLabel?: React.ReactNode
  onChangePage?: (selectedItem: { selected: number }) => void
}

const Pagination: React.FC<iPaginationProps> = ({
  allItemsCount = 0,
  marginPagesDisplayed = 3,
  nextLabel = 'Next',
  pageNumber = 1,
  pageRangeDisplayed = 3,
  perPageCount = 10,
  previousLabel = 'Previous',
  onChangePage
}) => {
  const paginationPagesCount = useMemo(() => {
    return allItemsCount > 0 ? ceil(allItemsCount / perPageCount) : 0
  }, [allItemsCount, perPageCount])

  const paginationPageIndex = useMemo(() => {
    const intPageNumber = Number(pageNumber)
    return !isNaN(intPageNumber) && intPageNumber > 1 ? intPageNumber - 1 : 0
  }, [pageNumber])

  return (
    <div className="pagination">
      <ReactPaginate
        activeClassName="pagination__item_state_active cursor_type_default"
        activeLinkClassName="pagination__item-link_state_active"
        breakClassName="pagination__item pagination__item_break"
        // break element
        breakLabel="..."
        breakLinkClassName="pagination__item-link"
        disabledClassName="pagination__item_state_disabled cursor_type_default"
        disabledLinkClassName="pagination__item_state_disabled"
        // pages settings
        forcePage={paginationPageIndex}
        marginPagesDisplayed={marginPagesDisplayed}
        nextClassName="pagination__item pagination__item_next"
        // next button
        nextLabel={nextLabel}
        nextLinkClassName="pagination__item-link"
        // page item
        pageClassName="pagination__item"
        pageCount={paginationPagesCount}
        pageLinkClassName="pagination__item-link"
        pageRangeDisplayed={pageRangeDisplayed}
        previousClassName="pagination__item pagination__item_previous"
        // previous button
        previousLabel={previousLabel}
        previousLinkClassName="pagination__item-link"
        containerClassName="pagination__container"
        onPageChange={onChangePage}
      />
    </div>
  )
}

export { Pagination }
