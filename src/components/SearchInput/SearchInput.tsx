import React, {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEvent,
  ReactNode,
  useCallback
} from 'react'

import './SearchInput.css'

import { ClearIcon, SearchIcon } from '../Icons'

interface iSearchProps {
  after?: ReactNode
  before?: ReactNode
  dataTour?: string
  placeholder?: string
  value: string
  onChange?: (value: string) => void
  onClickClean?: () => void
  onFocus?: FocusEventHandler<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  className?: string
}

const SearchInput = React.forwardRef(function SearchInput(
  props: iSearchProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    after,
    before,
    dataTour,
    placeholder,
    value,
    onChange,
    onClickClean,
    onFocus,
    onKeyDown
  } = props

  const onChangeSearchInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value)
    },
    [onChange]
  )

  const onClickClearIcon = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      event.stopPropagation()
      onChange?.('')
      if (onClickClean) {
        onClickClean()
      }
    },
    [onChange, onClickClean]
  )

  return (
    <label className="search-input" data-tour={dataTour}>
      {before}
      <SearchIcon className="search-input__icon" />
      <div className="search-input__wrapper">
        <input
          className="search-input__value"
          ref={ref}
          required={true}
          type="text"
          value={value}
          onChange={onChangeSearchInput}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <div className="search-input__placeholder">
          <div className="search-input__placeholder-value">
            {placeholder || 'Search'}
          </div>
        </div>
        {value && (
          <ClearIcon
            className="search-input__clear"
            onClick={onClickClearIcon}
          />
        )}
      </div>
      {after}
    </label>
  )
})

export { SearchInput }
