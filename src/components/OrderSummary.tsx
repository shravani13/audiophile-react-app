import { useSelector } from "react-redux";
import type { RootState } from "../redux/appStore";
import { useEffect, useState } from "react";
import { productsData } from "../data/mock-products";
import { OrderSummaryItem } from "./OrderSummaryItem";
import { formatCurrency } from "../utils/formatCurrency";

export type MergedCartItem = {
    productId: string,
    name: string,
    quantity : number,
    imageUrl: string,
    price : number
}
export const OrderSummary = () => {
    const cart = useSelector((state:RootState) => state.cart);
    const [mergedCartItems,setMergedCartItems] = useState<MergedCartItem[]>([]);
    const [totalPrice,setTotalPrice] = useState<number>(0);
    //create an object with product Id, image url, quantity and price
    useEffect(()=>{
      
        const data:MergedCartItem[] = cart?.cart?.cart?.items?.map(item=>{
            const product = productsData?.products?.find(product=>product.id === item.productId);
            if(!product) return null;
            // Derive imageUrl from images array (for API data) or use imageUrl property (for mock data)
            const cartImage = product.images?.find(image => image.imageType.toLowerCase() === 'thumbnail');
            const imageUrl = cartImage 
                ? `https://res.cloudinary.com/dzvbnmljo/image/upload/${cartImage.cloudinaryVersion}/${cartImage.cloudinaryPublicId}.jpg`
                : (product as any).imageUrl || '';
            return {
                productId: product.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                imageUrl: imageUrl
            } as MergedCartItem
        }).filter((item):item is MergedCartItem => item !== null);
        setMergedCartItems(data);

        setTotalPrice(data?.reduce((acc,item)=>acc+item?.price*item?.quantity,0));
    },[cart]);

    
    return(
        <div id="order-summary" className="bg-white rounded-lg px-8 lg:py-8 h-fit">
                <h3 className="uppercase text-lg font-bold">Summary</h3>
                <div id="merged-cart-items" className="my-4">
                    <ul className="flex flex-wrap list-none">
                        {mergedCartItems?.map((item) => {
                            return(
                               <OrderSummaryItem {...item}/>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between uppercase my-1"><span className="text-content text-base font-medium">Total</span><span className="text-lg font-bold">{formatCurrency(totalPrice)}</span></div>
                    <div className="flex justify-between uppercase my-1"><span className="text-content text-base font-medium">Shipping</span><span className="text-lg font-bold">$ 50</span></div>
                    <div className="flex justify-between uppercase my-1"><span className="text-content text-base font-medium">VAT (included)</span><span className="text-lg font-bold">$ 1079</span></div>
                    <div className="flex justify-between uppercase my-1"><span className="text-content text-base font-medium">Grand Total</span><span className="text-lg font-bold">{formatCurrency(totalPrice+50)}</span></div>
                    
               </div>
            </div>
        )
}