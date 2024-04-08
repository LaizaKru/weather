import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Author } from '../types'
import { API_BASE_URL } from './constants.ts'

export const authorApi = createApi({
  reducerPath: 'authorApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Authors'],
  endpoints: (builder) => ({
    getAuthors: builder.query<Author[], void>({
      query: () => 'authors',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Authors', id }) as const),
              { type: 'Authors', id: 'LIST' },
            ]
          : [{ type: 'Authors', id: 'LIST' }],
    }),
  }),
})

export const { useGetAuthorsQuery } = authorApi
