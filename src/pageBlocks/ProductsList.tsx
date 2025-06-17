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
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

  const getData = useCallback(
    async (searchQuery: string = '') => {
      try {
        setLoading(true)
        setError(null)

        let url = `https://plex-parser.ru-rating.ru/cars?_limit=${PER_PAGE_COUNT}&_page=${page}`

        if (searchQuery) {
          url += `&q=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        const items = data.data || []
        const total = data.meta?.total || 0

        setFilteredProducts(items)
        setTotalItems(total)
        setTotalPages(Math.ceil(total / PER_PAGE_COUNT))

        if (items.length === 0) {
          setError('No products found')
        }
      } catch (error) {
        setError(error.message)
        console.error('Error fetching data:', error)

        setFilteredProducts([])
        setTotalItems(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    },
    [page]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setSearchTimeout(
      setTimeout(() => {
        getData(value)
      }, 500)
    )
  }

  const onClickClean = () => {
    setSearchValue('')
    getData()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      getData(searchValue)
    }
  }

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1)
  }

  const handleSort = (type: 'asc' | 'desc' | 'none') => {
    setIsOpenDropdown(false)

    const sortedProducts = [...filteredProducts]
    if (type === 'none') {
      getData(searchValue)
      return
    }

    sortedProducts.sort((a, b) => {
      const priceA = a.price || 0
      const priceB = b.price || 0
      return type === 'asc' ? priceA - priceB : priceB - priceA
    })

    setFilteredProducts(sortedProducts)
  }

  useEffect(() => {
    getData(searchValue)
  }, [page, getData, searchValue])

  if (error) {
    return <div>Something went wrong</div>
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
