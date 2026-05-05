// types/index.ts
export type Event = {
  id: string
  start_date: string
  end_date: string | null
  users: {
    pseudo: string
    pseudo_slug: string
    insta: string
    user_style: {
      style_id: string
      styles: { name: string }
    }[]
  }
  cities:{
    city_name: string,
    city_slug: string,
    country_name: string,
    country_slug: string,
  }
  shops:{
    shop_name: string,
    shop_slug: string,
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
  owner_email?: string

}
