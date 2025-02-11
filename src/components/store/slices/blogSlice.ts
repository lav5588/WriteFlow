import { createSlice } from '@reduxjs/toolkit'

interface IState{
    isPublished: boolean,
    id: number | null,
}

const initialState:IState = {
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