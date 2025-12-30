import { incrementQuantity, decrementQuantity, useCreateOrUpdateCartMutation } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/appStore";
import { formatCurrency } from "../utils/formatCurrency";
import type { ShoppingCartRequestWrapper } from "../types/Cart";
import { useEffect, useRef } from "react";

type CartItemProps = {
    productId : string,
    productName: string,
    quantity : number,
    price: number,
    imageUrl: string
}
export const CartItem = ({productId, productName, quantity,price, imageUrl}:CartItemProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const[createOrUpdateCart] = useCreateOrUpdateCartMutation();
    const debounceTimerRef = useRef<number | null>(null);
    const pendingUpdateRef = useRef<ShoppingCartRequestWrapper | null>(null);
    const DEBOUNCE_DELAY = 500; // milliseconds

    // Debounced cart update: fires 500ms after the last action
    useEffect(() => {
        if (pendingUpdateRef.current === null) return;

        const timer = setTimeout(() => {
            if (pendingUpdateRef.current) {
                createOrUpdateCart(pendingUpdateRef.current);
                pendingUpdateRef.current = null;
            }
        }, DEBOUNCE_DELAY);

        debounceTimerRef.current = timer;

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [quantity, createOrUpdateCart]);

    const handleUpdateCart = (updateType:string) =>{
        if(updateType == 'increment'){
            const product: ShoppingCartRequestWrapper = {shoppingCartItem: {productId:productId, 
                productName: productName, 
                price: price, 
                imageUrl:imageUrl,
                quantity: quantity + 1}}
            dispatch(incrementQuantity(productId, productName, price, quantity + 1, imageUrl));
            pendingUpdateRef.current = product;
        }else{
            const product: ShoppingCartRequestWrapper = {shoppingCartItem: {productId:productId, 
                productName: productName, 
                price: price, 
                imageUrl:imageUrl,
                quantity: quantity - 1}}
            dispatch(decrementQuantity({productId:productId,productName:productName,price:price, imageUrl:imageUrl, quantity:quantity-1}));
            pendingUpdateRef.current = product;
        }
    }
    return (
        <>
                
        <li key={productId} className="mb-6">
            <div className="flex">
                <img alt={productName} 
                    src={imageUrl} 
                    className="h-16 w-16 rounded-lg mr-5">
                </img>
                <div className="flex flex-col mr-5">
                    <span className="text-base font-bold">{productName}</span>
                    <span className="text-content font-bold text-sm">{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between grow bg-grey-1 py-4 px-4 font-bold text-xs ">
                    <button aria-label="Decrement Quantity" className="cursor-pointer" data-action="minus" type="button" 
                    onClick={()=>handleUpdateCart("decrement")}>-</button>
                        <span className="bg-grey-1 font-bold px-4">{quantity}</span>
                    
                    <button aria-label="Increment Quantity" className="cursor-pointer" data-action="add" type="button" 
                    onClick={()=>handleUpdateCart("increment")}>+</button>
                </div>
                
            </div>
        </li>
             
        </>
        
        
    )
}
