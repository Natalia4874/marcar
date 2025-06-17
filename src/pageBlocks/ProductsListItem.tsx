import { iCar } from '@/interfaces'
import Image from 'next/image'

import { Icon } from '../components/Icons'

import './index.css'

export default function ProductsListItem({ item }: { item: iCar }) {
  return (
    <li className="list-item">
      <Image
        className="list-item__image"
        src={item.images?.image?.[0] || '/fallBackImage.jpg'}
        alt={`${item.mark_id} + ${item.folder_id}` || 'Товар'}
        width={0}
        height={0}
        sizes="100vw"
        onError={(e) => {
          e.currentTarget.src = '/fallBackImage.jpg'
        }}
      />
      <div className="list-item__name">
        {item.mark_id} {item.folder_id}
      </div>

      <div className="list-item__price">
        <Icon size={16} />
        <div>{item.price?.toLocaleString()} ₽</div>
        <div className="list-item__price--loan">
          от {Math.round((item.price || 0) / 70).toLocaleString()} ₽/мес
        </div>
      </div>

      <div className="list-item__model">
        <Icon size={16} />
        <div>{item.modification_id}</div>
      </div>

      <div className="list-item__mileage">
        <Icon size={16} />
        <div>{item.run?.toLocaleString()} км</div>
        <div>{item.gearbox}</div>
      </div>

      <div className="list-item__other">
        <Icon size={16} />
        <div>{item.engine_type}</div>
        <div>{item.color}</div>
        <div>{item.year}</div>
      </div>
    </li>
  )
}
