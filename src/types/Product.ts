export interface ProductImage {
    imageType: string;
    cloudinaryPublicId: string;
    cloudinaryVersion: string;
  }
  
  export interface GalleryImage{
    desktop: string;
    tablet: string;
    mobile: string;
  }
  
  export interface IncludedItem {
    quantity: number;
    item: string;
  }
  
  export interface Product {
    id: string;
    slug: string;
    name: string;
    new: boolean;
    price: number;
    description: string;
    quantity: number;
    features: string;
    category: string;
    images: ProductImage[];
    gallery: GalleryImage[];
    includedItems: IncludedItem[];
  }
  
  // Response is an array of products
  export interface ProductsByCategoryResponse {
    products: Product[];
  }
  export interface ProductByIdResponse  {
    product : Product;
  }
  