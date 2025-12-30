import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {fetchAuthSession} from 'aws-amplify/auth';

export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery: fetchBaseQuery({
        
        prepareHeaders: async (headers) => {
            try{
                const session = await fetchAuthSession();
                const token = session.tokens?.accessToken;
                if(token){
                    headers.set('authorization', `Bearer ${token}`);
                }
            }catch(err){
                console.log("error in fetching current user session", err);
            }
            
            return headers;
        }
    }),
    
    endpoints: () => ({
    }),
    tagTypes: ['Cart',"Product"],
    keepUnusedDataFor: 86400
})

