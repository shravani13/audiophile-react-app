import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingCartResponseWrapper, ShoppingCartItem, ShoppingCartRequestWrapper } from "../types/Cart";
import type { RootState } from "./appStore";
import { apiSlice } from "./apiSlice";

const baseUrl = import.meta.env.VITE_CART_API_BASE_URL;
const initialCart: ShoppingCartResponseWrapper = {
    cart: {
        userId: '',
        guestId: '',
        totalPrice: 0,
        items: []
    }
}

type CartState = {
    cart: ShoppingCartResponseWrapper,
    isCartOpen: boolean,
    status: 'idle' | 'success' | 'failed' | 'pending',
    error: string | null
}
//to make api calls and cache the response
export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrUpdateCart: builder.mutation<ShoppingCartResponseWrapper, ShoppingCartRequestWrapper>({
            query: (cart: ShoppingCartRequestWrapper)=>({
                url: `${baseUrl}/cart`,
                credentials: 'include',
                method: 'POST',
                body: cart
            }),
            
            invalidatesTags: ['Cart']
        }),
        getCart: builder.query<ShoppingCartResponseWrapper, void>({
            query: () => ({
                url: `${baseUrl}/cart`,
                credentials: 'include'
            }),
            providesTags: ['Cart']
        }),
        getCartByUserId: builder.query<ShoppingCartResponseWrapper, string>({
            query: (userId: string) => ({
                url: `${baseUrl}/cart/${userId}`,
            }),
            providesTags: ['Cart']
        }),
        deleteCart: builder.mutation<void, string>({
            query: (userId: string) => ({
                url: `${baseUrl}/cart/${userId}`,
                credentials: 'include',
                method: 'DELETE'
            }),
            invalidatesTags: ['Cart']
        }),
        mergeCart: builder.mutation({
            query: () => ({
                url: `${baseUrl}/cart/merge`,
                credentials: 'include',
                method: 'POST'
            }),
            invalidatesTags: ['Cart']
        })
    })
})

//handles cart operations
//sync the local state with the api response received from the above defined queries/mutations
const cartSlice = createSlice({
    name:'cart',
    initialState :{
        cart : initialCart,
        isCartOpen : false,
        status: 'idle', // 'success' | 'failed' | 'pending'
        error: null
    } as CartState,
    
    reducers :{
        toggleCart : (state) => {
            state.isCartOpen = !state.isCartOpen
        },
        openCart : (state) => {
            state.isCartOpen = true
        },
        closeCart: (state) => {
            state.isCartOpen = false
        },
        clearCart : (state) => {
            state.cart.cart.items = []
        },
        removeItem : (state, action: PayloadAction<ShoppingCartItem>) => {
            const itemIndex = state.cart.cart.items.findIndex((x: any)=>x.productId == action.payload.productId);
            if(itemIndex > -1)
                state.cart.cart.items.splice(itemIndex, 1)
        },
        incrementQuantity : {
            reducer: (state, action: PayloadAction<ShoppingCartItem>) => {
                const item = state.cart.cart.items.find((x: any)=>x.productId == action.payload.productId);
                if(item === undefined)
                    state.cart.cart.items.push({...action.payload, quantity:1} as any)
                else
                    item.quantity += 1
            },
            prepare(id:string,name:string,price:number,
                quantity:number,imageUrl:string): { payload: ShoppingCartItem } {
                return{
                        payload:
                        {
                            productId: id,
                            productName: name,
                            price: price,
                            quantity: quantity,
                            imageUrl: imageUrl
                        }
                    }
                }
        },
        decrementQuantity : (state, action: PayloadAction<ShoppingCartItem>) => {
            const item = state.cart.cart.items.find((x: ShoppingCartItem)=>x.productId == action.payload.productId);
            const itemIndex = state.cart.cart.items.findIndex((x: ShoppingCartItem)=>x.productId == action.payload.productId);
            if(item?.quantity === 1)
                state.cart.cart.items.splice(itemIndex,1)
            else
                item!.quantity -= 1
        }
    },
    extraReducers : (builder) =>{
        builder.addMatcher(
            cartApiSlice.endpoints.createOrUpdateCart.matchPending,
            (state) => {
                state.status = 'pending'
            }
        )
        builder.addMatcher(
            cartApiSlice.endpoints.createOrUpdateCart.matchFulfilled,
            (state, action: PayloadAction<ShoppingCartResponseWrapper>) => {
                state.status = 'success'
                state.cart.cart = action.payload.cart
            }
        )
        builder.addMatcher(
            cartApiSlice.endpoints.createOrUpdateCart.matchRejected,
            (state, action) => {
                state.status = 'failed'
                state.error = action.error?.message ? action.error.message : 'Unknown error'
            }
        )

        builder.addMatcher(
            cartApiSlice.endpoints.getCart.matchPending,
            (state) => {
                state.status = 'pending'
            }
        )
        builder.addMatcher(
            cartApiSlice.endpoints.getCart.matchFulfilled,
            (state, action: PayloadAction<ShoppingCartResponseWrapper>) => {
                state.cart.cart = action.payload.cart
                state.status = 'success'
            }
        )
        builder.addMatcher(
            cartApiSlice.endpoints.getCart.matchRejected,
            (state, action) => {
                state.status = 'failed'
                state.error = action.error?.message ? action.error.message : 'Unknown error'
            }
        )

        builder.addMatcher(
            cartApiSlice.endpoints.deleteCart.matchFulfilled,
            (state) => {
                state.cart = initialCart
            }
        )
        builder.addMatcher(
            cartApiSlice.endpoints.deleteCart.matchRejected,
            (state, action) => {
                state.error = action.error?.message ? action.error.message : 'Unknown error'
            }
        )
    }
})
export const {removeItem, incrementQuantity, decrementQuantity, clearCart, openCart, closeCart, toggleCart} = cartSlice.actions;
export default cartSlice.reducer;

export const { useCreateOrUpdateCartMutation, useGetCartQuery, useDeleteCartMutation,
     useMergeCartMutation, useGetCartByUserIdQuery } = cartApiSlice;

export const selectCart = (state:RootState) => state.cart.cart.cart
export const selectCartStatus = (state:RootState) =>  state.cart.status
export const selectCartError = (state:RootState) => state.cart.error
export const selectCartOpenStatus = (state:RootState) => state.cart.isCartOpen
export const selectCartItems = (state:RootState) => state.cart.cart.cart.items

export const selectTotalPrice = createSelector(
    selectCartItems,
    (cartItems: ShoppingCartItem[]) => cartItems.reduce((totalPrice: number, cartItem: ShoppingCartItem) => totalPrice + cartItem.price * cartItem.quantity,0)
)
export const selectCartQuantity = createSelector(
    selectCartItems,
    (cartItems: ShoppingCartItem[]) => cartItems.reduce((totalQuantity: number, cartItem: ShoppingCartItem)=> totalQuantity + cartItem.quantity,0)
)

