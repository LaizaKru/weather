export type Observation = {
  id: number
  timestamp: string
  temp: number
  weather: Weather
  author: Author
  comment?: string
}

export type ObservationCreate = Pick<
  Observation,
  'temp' | 'weather' | 'author' | 'comment'
>

export type Weather = {
  id: number
  title: string
}

export type Author = {
  id: number
  name: string
}
