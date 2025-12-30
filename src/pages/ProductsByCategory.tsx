import { useParams, Link } from "react-router";
import {  
    useGetProductsByCategoryQuery 
} from "../redux/productSlice"
import { ProductThumbnailImage } from "../components/Product/ProductThumbnailImage";

export const ProductsByCategory = () => {
    const {category} = useParams();
   
   
    const {data,
        isLoading,
        isError
    } = useGetProductsByCategoryQuery(category!);
    //const [productsDataState, setProductsDataState] = useState<ProductsByCategoryResponse>();
    
    //const apiClientFactory = new ApiClientFactory("https://audiophile-product-catalog.azurewebsites.net/api");
    //const apiClient = apiClientFactory.createClient();
    //const abortControllerRef = useRef<AbortController>(null);

    /*const fetchProductsByCategory = async(abortSignal:AbortSignal) => {
        const response = await apiClient.get<ProductsByCategoryResponse>(`/product/category/${category}`,"",abortSignal);
        console.log(response);
        setProductsDataState(response);
    }*/
     /*useEffect(()=>{
        //abortControllerRef.current = new AbortController();
       const promise = dispatch(fetchProductsByCategory(category!));
        return () => {
            promise.abort();
           // abortControllerRef.current?.abort()
        }
    },[]);*/
    if(isLoading) return <p>....Loading</p>
    else if(isError) return <p>...error in loading products</p>
    else {
        const products = data?.ids?.map((id) => data?.entities[id]!).filter(Boolean);
    return (
        <>
        
        <div className="bg-black-1 py-8 px-20">
            <h1 className="uppercase text-2xl text-white font-bold text-center">{category}</h1>
        </div>
        <div id="categoryList" className="flex flex-col px-6 md:px-10 lg:px-36">
            {
                
                products?.map((item,index) => {
                   
                    return (
                        <div key={item?.id} className="flex flex-col mt-10 lg:flex-row lg:mt-40 md:mt-28">
                            <div className={`flex flex-col items-center lg:flex-row lg:mr-16 text-black-1 order-1  ${index%2 != 0 ? 'lg:order-2' : ''}`}>
                                {/* <img alt={item?.name} src={item?.imageUrl || ""} aria-label={item?.slug} className="rounded-lg mb-8"></img> */}
                                <ProductThumbnailImage images={item?.images || []} name={item?.name || ""} />
                            </div>
                            <div className={`flex flex-col items-center lg:justify-center lg:items-start lg:ml-16 order-2 ${index%2 != 0 ? 'lg:order-1' : ''}`}>
                                {item?.new ? <span className="text-sm text-dark-brown uppercase font-normal mb-6">New Product</span>: ""}
                                <h2 className="text-2xl font-extrabold uppercase text-center">{item?.name}</h2>
                                <p className="text-base font-bold my-4 text-center text-content lg:text-start">{item?.description}</p>
                                <Link to={"/product/"+item?.category+"/"+item?.id} className="uppercase py-4 px-7 mt-3 font-bold text-xs text-white bg-dark-brown hover:bg-light-brown">See Product</Link>
                            </div>
                        </div>
                    )
                })
                }

        </div>
    </>
    )
}
}

 