// Интерфейсы API-клиента
export interface IApiClient {
    getProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    createOrder(order: IOrder): Promise<IOrder>;
}
  
// Интерфейс для описания товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
  
// Интерфейс для описания товара в корзине
export interface IBasketItem {
    total: number | null;
    items: TProductBasket[];
}

// Интерфейс для формы заказа
export interface IOrderForm {
    items: IProduct[];
    address: string;
    email: string;
    phone: string;
}
  
// Интерфейс для заказа
export interface IOrder {
    items: string[];
    total: number; 
    paymentMethod: string; 
    deliveryAddress: string; 
    email: string; 
    phone: string; 
}
  
// Интерфейс для управления данными о товаре
export interface IProductsData {
    products: IProduct[];
    preview: string | null;
    setProducts(products: IProduct[]): void;
    getProducts(): IProduct[];
    getProduct(id: string): IProduct;
    saveProduct(product: IProduct): void;
    savePreview(products: IProduct[]): void;
}
  
// Типы данных для корзины
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;
  
// Типы оплаты
export type TPaymentMethod = 'card' | 'cash';
  
// Типы запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  
// Базовый API интерфейс
export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: any, method?: ApiPostMethods): Promise<T>;
}
  