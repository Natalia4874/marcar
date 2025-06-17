'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { iCar } from '@/interfaces'

import { Dropdown } from '../components/Dropdown/Dropdown'
import { DropdownItem } from '../components/Dropdown/DropdownItem'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'
import { Loader } from '../components/Loader/Loader'
import { Pagination } from '../components/Pagination/Pagination'
import { SearchInput } from '../components/SearchInput/SearchInput'
import ProductsListItem from './ProductsListItem'

import './index.css'

const PER_PAGE_COUNT = 12

export default function ProductsList() {
  const [filteredProducts, setFilteredProducts] = useState<iCar[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

  const getData = useCallback(
    async (searchQuery: string = '') => {
      try {
        setLoading(true)
        setError(null)

        const url = new URL('/api/cars', window.location.origin)
        url.searchParams.append('_limit', PER_PAGE_COUNT.toString())
        url.searchParams.append('_page', page.toString())

        if (searchQuery) {
          url.searchParams.append('q', searchQuery)
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        const items = data.data || []
        const total = data.meta?.total || 0

        setFilteredProducts(items)
        setTotalItems(total)

        if (items.length === 0) {
          setError('No products found')
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching data:', error)

        setFilteredProducts([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    },
    [page]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)

      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      setSearchTimeout(
        setTimeout(() => {
          setPage(1)
          getData(value)
        }, 500)
      )
    },
    [getData, searchTimeout]
  )

  const onClickClean = useCallback(() => {
    setSearchValue('')
    setPage(1)
    getData()
  }, [getData])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        getData(searchValue)
      }
    },
    [getData, searchValue]
  )

  const handlePageChange = useCallback(({ selected }: { selected: number }) => {
    setPage(selected + 1)
  }, [])

  const handleSort = useCallback(
    (type: 'asc' | 'desc' | 'none') => {
      setIsOpenDropdown(false)

      if (type === 'none') {
        getData(searchValue)
        return
      }

      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => {
          const priceA = a.price || 0
          const priceB = b.price || 0
          return type === 'asc' ? priceA - priceB : priceB - priceA
        })
      )
    },
    [getData, searchValue]
  )

  useEffect(() => {
    const controller = new AbortController()

    getData(searchValue)

    return () => {
      controller.abort()
    }
  }, [page, searchValue, getData])

  if (error) {
    return <div>Something went wrong: {error}</div>
  }

  return (
    <div className="wrapper">
      <div className="search">
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          onClickClean={onClickClean}
          onKeyDown={handleKeyDown}
          placeholder="Поиск..."
          ref={searchRef}
        />
        <div className="sort">
          <button
            className="sort__btn"
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          >
            Сортировка
          </button>
          <Dropdown isOpen={isOpenDropdown} setIsOpen={setIsOpenDropdown}>
            <DropdownItem
              showDivider={true}
              label="Дешевле"
              onClick={() => handleSort('asc')}
            />
            <DropdownItem
              showDivider={true}
              label="Дороже"
              onClick={() => handleSort('desc')}
            />
            <DropdownItem
              showDivider={true}
              label="Не выбрана"
              onClick={() => handleSort('none')}
            />
          </Dropdown>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && !filteredProducts.length && (
        <div className="no-results">
          <p>Ничего не найдено. Попробуйте изменить параметры поиска.</p>
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <>
          <ul className="list">
            {filteredProducts.map((item: iCar) => (
              <ProductsListItem key={item.unique_id} item={item} />
            ))}
          </ul>
        </>
      )}
      {filteredProducts.length > 0 && (
        <Pagination
          allItemsCount={totalItems}
          pageNumber={page}
          perPageCount={PER_PAGE_COUNT}
          previousLabel={<ChevronLeftIcon />}
          nextLabel={<ChevronRightIcon />}
          onChangePage={handlePageChange}
        />
      )}
    </div>
  )
}
