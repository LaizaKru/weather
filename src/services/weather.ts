import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Weather } from '../types'
import { API_BASE_URL } from './constants.ts'

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Weathers'],
  endpoints: (builder) => ({
    getWeathers: builder.query<Weather[], void>({
      query: () => 'weathers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Weathers', id }) as const),
              { type: 'Weathers', id: 'LIST' },
            ]
          : [{ type: 'Weathers', id: 'LIST' }],
    }),
  }),
})

export const { useGetWeathersQuery } = weatherApi
