import { ReactNode } from 'react'

import './Loader.css'

interface iLoaderProps {
  children?: ReactNode
  text?: string
}

const Loader: React.FC<iLoaderProps> = ({ children, text }) => {
  return (
    <div className="loader">
      {children || (
        <div className="loader__inner">
          <span className="loader__item" />
          <span className="loader__item" />
          <span className="loader__item" />
        </div>
      )}
      {text && <p className="loader__text">{text}</p>}
    </div>
  )
}

export { Loader }
