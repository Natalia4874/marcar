import React, { MouseEvent, ReactNode } from 'react'

import { Divider } from '../Divider'

import './Dropdown.css'

interface iDropdownItemProps {
  children?: ReactNode
  isActive?: boolean
  isHover?: boolean
  after?: ReactNode
  before?: ReactNode
  desc?: string
  href?: string
  label?: string
  link?: string
  rel?: string
  showDivider?: boolean
  target?: string
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void
}

const DropdownItem: React.FC<iDropdownItemProps> = ({
  children,
  isActive = false,
  isHover = false,
  after,
  before,
  desc,
  href,
  label,
  link,
  rel,
  showDivider = false,
  target,
  onClick,
  onMouseEnter
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    onClick?.(event)
  }

  return (
    <div
      className={[
        'dropdown__item',
        isActive && 'dropdown__item_state_active',
        isHover && 'dropdown__item_state_hover'
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      role="dropdown-item"
    >
      <div className="dropdown__item-wrapper">
        <a
          className="dropdown__item-link"
          href={link || href}
          rel={rel}
          target={target}
        >
          <React.Fragment>
            {before}
            {children || (
              <React.Fragment>
                {label && <span className="dropdown__item-label">{label}</span>}
                {desc && <span className="dropdown__item-desc">{desc}</span>}
              </React.Fragment>
            )}
            {after}
          </React.Fragment>
        </a>
      </div>
      {showDivider && <Divider />}
    </div>
  )
}

export { DropdownItem }
