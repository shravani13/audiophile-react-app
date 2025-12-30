import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "./appStore"

type User ={
    id:string,
    email: string,
    username: string,
    token: string
}
// type LoginUser = {
//     username: string,
//     password: string
// }

const initialState: { user: User | null; isAuthenticated: boolean } = {
    user: null,
    isAuthenticated: false
}
const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        login: (state,action:PayloadAction<User>) =>{
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout:(state) =>{
            state.user = null,
            state.isAuthenticated = false
        }
    }
})

export const {login, logout} = userSlice.actions
export default userSlice.reducer

export const selectUser = (state:RootState) => state.user.user;
export const selectUserAuthenticatedStatus = (state:RootState) => state.user.isAuthenticated;