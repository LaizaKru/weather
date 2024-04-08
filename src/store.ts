import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { observationApi } from './services/observation'
import { weatherApi } from './services/weather'
import { authorApi } from './services/author'

export const store = configureStore({
  reducer: {
    [observationApi.reducerPath]: observationApi.reducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(observationApi.middleware)
      .concat(weatherApi.middleware)
      .concat(authorApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
