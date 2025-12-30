import {configureStore, createListenerMiddleware}  from "@reduxjs/toolkit";
import cartReducer, { cartApiSlice }  from "../redux/cartSlice";
import userReducer, { login } from "../redux/userSlice";
import authReducer from "../redux/authSlice";
import { apiSlice } from "./apiSlice";
import storage from "redux-persist/lib/storage";
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import { getCookie, removeCookie } from "../utils/cookieUtils";


const persistConfig = {
    key: "root",
    storage
}

const persistedCartReducer = persistReducer(persistConfig,cartReducer);

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    actionCreator: login,
    effect: async (_action, listenerApi) => {
        const guestId = getCookie('guestId');
        if(guestId){
            try{
                await listenerApi.dispatch(cartApiSlice.endpoints.mergeCart.initiate(undefined));
            }catch(err){
                console.error("Failed to merge carts",err);
            }
            finally{
                removeCookie('guestId');
            }
        }
    }
})
export const appStore = configureStore({
    reducer : {
        cart : persistedCartReducer,
        user: userReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions: [FLUSH,REHYDRATE, PURGE, PAUSE, PERSIST, REGISTER]
            }
        }).concat(apiSlice.middleware).prepend(listenerMiddleware.middleware)
});


export type AppDispatch = typeof appStore.dispatch
export type RootState = ReturnType<typeof appStore.getState>

export const persistor = persistStore(appStore);

