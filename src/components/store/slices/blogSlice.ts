import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isPublished: false,
}

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setIsPublished: (state, action) => {
            state.isPublished = action.payload
        },
    },
})

export const { setIsPublished } = blogSlice.actions

export default blogSlice.reducer