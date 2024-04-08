import { http, HttpResponse } from 'msw'

import type {
  Observation,
  ObservationCreate,
  Weather,
  Author,
} from '../types.ts'

const getTimestamp = () => new Date().toISOString()

const weaters: Weather[] = [
  { id: 1, title: 'Солнечно' },
  { id: 2, title: 'Облачно' },
  { id: 3, title: 'Дождливо' },
]
const authors: Author[] = [
  { id: 1, name: 'Иван Иванов' },
  { id: 2, name: 'Петр Петров' },
  { id: 4, name: 'Василий Васильев' },
]
let observations: Observation[] = [
  {
    id: 1,
    timestamp: '2024-03-30T17:32:11.954Z',
    temp: 26,
    weather: weaters[0],
    author: authors[0],
    comment: 'Прикольная погода',
  },
  {
    id: 2,
    timestamp: '2024-04-01T17:32:11.954Z',
    temp: 22,
    weather: weaters[1],
    author: authors[1],
    comment: 'Погода норм',
  },
  {
    id: 3,
    timestamp: '2024-04-03T17:32:11.954Z',
    temp: 16,
    weather: weaters[2],
    author: authors[2],
    comment: 'Погода ужас',
  },
  {
    id: 4,
    timestamp: '2024-04-04T17:32:11.954Z',
    temp: 18,
    weather: weaters[0],
    author: authors[0],
    comment: 'Погода отличная',
  },
  {
    id: 5,
    timestamp: '2024-04-05T17:32:11.954Z',
    temp: 24,
    weather: weaters[1],
    author: authors[1],
    comment: 'Погода супер',
  },
  {
    id: 6,
    timestamp: '2024-04-06T17:32:11.954Z',
    temp: 28,
    weather: weaters[2],
    author: authors[2],
    comment: 'Погода хорошая',
  },
  {
    id: 7,
    timestamp: '2024-04-07T17:32:11.954Z',
    temp: 30,
    weather: weaters[0],
    author: authors[0],
    comment: 'Погода отличная',
  },
]

export const handlers = [
  // Наблюдения
  http.get('/api/observations', () => {
    return HttpResponse.json(observations)
  }),
  http.post<never, ObservationCreate>(
    '/api/observations',
    async ({ request }) => {
      const data = await request.json()
      const timestamp = getTimestamp()
      const id = observations.length + 1
      const observation = { ...data, timestamp, id }
      observations.push(observation)

      return HttpResponse.json(observation)
    },
  ),
  http.post<{ id: string }, Partial<Observation> & { id: Observation['id'] }>(
    '/api/observations/:id',
    async ({ params, request }) => {
      const id = Number(params.id)
      const data = await request.json()
      const observation = observations.find((o) => o.id === id)
      if (!observation) {
        return new HttpResponse(null, {
          status: 404,
        })
      }
      const updatedObservation = { ...observation, ...data }
      observations = observations.map((o) =>
        o.id === id ? updatedObservation : o,
      )

      return HttpResponse.json(updatedObservation)
    },
  ),
  http.delete<{ id: string }>('/api/observations/:id', ({ params }) => {
    const id = Number(params.id)
    observations = observations.filter((observation) => observation.id !== id)

    return new HttpResponse(null, {
      status: 204,
    })
  }),
  // Справочники
  http.get('/api/weathers', () => {
    return HttpResponse.json(weaters)
  }),
  http.get('/api/authors', () => {
    return HttpResponse.json(authors)
  }),
]
