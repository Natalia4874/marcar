type tImageUrl =
  `https://ru-msk-dr3-1.store.cloud.mts.ru/store/images/items/${string}/${string}/${string}.jpg`

interface iCarImageObject {
  image: tImageUrl[] | string[]
}

interface iCar {
  unique_id?: number
  images?: iCarImageObject
  mark_id?: string
  folder_id?: string
  price?: number
  modification_id?: string
  run?: number
  gearbox?: string
  engine_type?: string
  color?: string
  year?: number
}

export type { iCar }
