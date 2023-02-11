import {configureStore} from "@reduxjs/toolkit"
import {apiSlice} from '../features/api/apiSlice'



export const store=configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})


// Using RTK Query with the Redux store requires some middleware
//The middleware retutns an array
//The apiSlice manages cache lifetime and expiration and is required when using RTK Query and an apiSlice