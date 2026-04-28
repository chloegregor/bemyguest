// types/index.ts
export type Event = {
  id: string
  city_name: string
  city_slug: string
  shop_name: string
  shop_slug: string
  start_date: string
  end_date: string | null
  user_id: string
  users: {
    pseudo: string
    insta: string
    user_style: {
      style_id: string
      styles: { name: string }
    }[]
  }
}


export type SingUpData = {
  role: string
  resident: boolean
  email: string
  password: string
  pseudo: string | null
  pseudoSlug: string | null
  insta: string | null
  shopName: string |null
  shopSlug: string | null
  shopPlaceId: string | null
  cityPlaceId: string |null

}
