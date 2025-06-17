import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import './Dropdown.css'

interface iDropdownProps {
  children?: ReactNode
  isOpen: boolean
  after?: ReactNode
  animationClose?: string
  animationOpen?: string
  before?: ReactNode
  setIsOpen: (isOpen: boolean) => void
  className?: string
}

const Dropdown: React.FC<iDropdownProps> = ({
  children,
  isOpen,
  after,
  animationClose = 'dropdown_animation_close',
  animationOpen = 'dropdown_animation_open',
  before,
  setIsOpen,
  className = ''
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState({
    className: ''
  })

  const onAnimationEnd = useCallback(() => {
    // When component is change his visibility(display) in DOM,
    // animation of close can run unnecessary on showing element.
    // const dropdownElement = dropdownRef.current
    setAnimationState((prevState) => ({
      className: isOpen ? prevState.className : ''
    }))
  }, [isOpen])

  useEffect(() => {
    if (animationOpen && animationClose) {
      setAnimationState(() => ({
        className: isOpen ? animationOpen : animationClose
      }))
    }
  }, [animationClose, animationOpen, isOpen])

  // Close dropdown by click outside
  useEffect(() => {
    // Add a handler to keep track of the click target.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onClickWindow(event: any) {
      const dropdownElement = dropdownRef.current

      if (dropdownElement && animationOpen) {
        // Is event target inside of dropdown element
        const isContainsTarget = dropdownElement.contains(event.target)
        // Is dropdown element has "open" class
        const hasOpenClass = dropdownElement.classList.contains(animationOpen)

        if (!isContainsTarget && hasOpenClass) {
          // Trigger close event with animation
          // dropdownElement.click() - trigger "onClickWindow" again
          setIsOpen(false)
        }
      }
    }
    // Add event listener for current dropdown on first render
    window.addEventListener('click', onClickWindow)

    return () => {
      // Remove event listener for current dropdown on unmount
      window.removeEventListener('click', onClickWindow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={[
        'dropdown',
        className,
        isOpen ? 'dropdown_state_open' : 'dropdown_state_close',
        animationState.className
      ]
        .filter(Boolean)
        .join(' ')}
      ref={dropdownRef}
    >
      {before}
      {children && (
        <div
          className={`dropdown__wrapper ${animationState.className}`}
          // Add "onAnimationEnd" only for wrapper for ignore dropdown button
          onAnimationEnd={onAnimationEnd}
        >
          {children}
        </div>
      )}
      {after}
    </div>
  )
}

export { Dropdown }
