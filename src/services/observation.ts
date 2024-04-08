import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Observation, ObservationCreate } from '../types'
import { API_BASE_URL } from './constants.ts'

export const observationApi = createApi({
  reducerPath: 'observationApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Observations'],
  endpoints: (builder) => ({
    getObservations: builder.query<Observation[], void>({
      query: () => 'observations',
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'Observations', id }) as const,
              ),
              { type: 'Observations', id: 'LIST' },
            ]
          : [{ type: 'Observations', id: 'LIST' }],
    }),
    addObservation: builder.mutation<Observation, ObservationCreate>({
      query(body) {
        return {
          url: 'observations',
          method: 'POST',
          body,
        }
      },
      invalidatesTags: [{ type: 'Observations', id: 'LIST' }],
    }),
    updateObservation: builder.mutation<
      Observation,
      Partial<Observation> & { id: Observation['id'] }
    >({
      query(data) {
        const { id, ...body } = data
        return {
          url: `observations/${id}`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Observations', id },
      ],
    }),
    deleteObservation: builder.mutation<Observation['id'], Observation['id']>({
      query: (id) => ({
        url: `observations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Observations', id }],
    }),
  }),
})

export const {
  useGetObservationsQuery,
  useAddObservationMutation,
  useUpdateObservationMutation,
  useDeleteObservationMutation,
} = observationApi
