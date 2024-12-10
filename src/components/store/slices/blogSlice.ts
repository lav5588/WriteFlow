import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isPublished: false,
    id:null,
}

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setIsPublished: (state, action) => {
            state.isPublished = action.payload
        },
        setId:(state, action) => {
            state.id = action.payload
        },
    },
})

export const { setIsPublished, setId } = blogSlice.actions

export default blogSlice.reducer