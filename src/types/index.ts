// Интерфейсы API-клиента
export interface IApiClient {
    getProducts(): Promise<IProductList[]>;
    getProduct(id: string): Promise<IProductList>;
    createOrder(order: IOrder): Promise<IOrder>;
}
  
// Интерфейс для описания товара
export interface IProductList {
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
    items: IProductList[];
    address: string;
    email: string;
    phone: string;
}
  
// Интерфейс для заказа
export interface IOrder {
    id: string;
    items: TProductBasket[];
    paymentMethod: string;
    deliveryAddress: string;
    email: string;
    phone: string;
}
  
// Интерфейс для управления данными о товаре
export interface IProductsData {
    products: IProductList[];
    preview: string | null;
    setProducts(products: IProductList[]): void;
    getProducts(): IProductList[];
    getProduct(id: string): IProductList;
    saveProduct(product: IProductList): void;
    savePreview(products: IProductList[]): void;
}
  
// Типы данных для корзины
export type TProductBasket = Pick<IProductList, 'id' | 'title' | 'price'>;
  
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
  