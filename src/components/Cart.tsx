import type { AppDispatch, RootState } from "../redux/appStore"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router"
import { clearCart, closeCart, selectCartQuantity, selectTotalPrice, selectCart, selectCartOpenStatus } from "../redux/cartSlice"
import { CartItem } from "./CartItem"
//import { useEffect } from "react"
import { formatCurrency } from "../utils/formatCurrency"
import { EmptyCart } from "./EmptyCart"
//import { selectUser, selectUserAuthenticatedStatus } from "../redux/userSlice"


export const Cart = () => {

    const dispatch = useDispatch<AppDispatch>();

    const cart = useSelector((state:RootState) => selectCart(state));
    //const cartStatus = useSelector((state:RootState) => selectCartStatus(state));
    const isCartOpen = useSelector((state:RootState) => selectCartOpenStatus(state));
    const totalQuantity = useSelector(selectCartQuantity);
    const totalPrice = useSelector(selectTotalPrice);
    //const [deleteCart, {isLoading}] = useDeleteCartMutation();
   


    //const {data} = useGetCartQuery();

    const handleDeleteCart = () => {
        dispatch(clearCart());
        //deleteCart()
    }
    const handleCloseCart = () => dispatch(closeCart())
    
    
    if(!isCartOpen) return null
 
    return(
        <div onClick={handleCloseCart} className="fixed top-0 left-0 w-full h-full bg-background flex justify-end">
             <div className="bg-white w-full h-fit py-8 px-7 mx-6 mt-32 rounded-lg shadow-sm md:w-auto">
            {totalQuantity === 0 ? 
                    <EmptyCart onCloseCart={handleCloseCart}></EmptyCart>
            :
                <div className="md:w-auto">
                    <div id="cart-header" className="flex justify-between flex-wrap my-4">
                        <h2 className="text-lg font-bold uppercase">Cart {' ('+totalQuantity+')'}</h2>
                        <button aria-label="Remove All" onClick={()=>handleDeleteCart()} className="text-content font-medium text-base uppercase">Remove All</button>
                    </div>
            
                    <div id="cart-items" className="my-4">
                        <ul className="flex flex-col list-none">
                            {cart?.items?.map((item) => (
                                <CartItem key={item?.productId} {...item}></CartItem>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between">
                        <span>Total:</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex">
                        <Link to="/checkout" className="grow text-white text-xs font-bold uppercase text-center py-4 px-8 bg-dark-brown hover:bg-light-brown">checkout</Link>
                    </div>
                    </div>
               
            }
             </div>
        </div>
    );
}
