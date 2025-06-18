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
  

// Интерфейс для формы заказа
export interface IOrderForm {
    items: IProduct[];
    address: string;
    email: string;
    phone: string;
    payment: 'card' | 'cash';
}
  
// Интерфейс для заказа
export interface IOrder {
    items: string[];
    total: number; 
    payment: string; 
    address: string; 
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
    savePreview(id: string | null): void;
}

export type EventName = string | RegExp;

// Интерфейс для системы событий
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    off(event: EventName, callback: Function): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Интерфейс товара в корзине
export interface IProductBasket {
    id: string;
    title: string;
    price: number | null;
    quantity: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Типы данных для корзины
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;
  
// Типы оплаты
export type TPaymentMethod = 'card' | 'cash';
  
// Типы запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Ошибки формы, связанные с заполнением полей
export type FormErrors = {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
};

// Базовый API интерфейс
export interface IApi {
    baseUrl: string;
    get(uri: string): Promise<object>;
    post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}
  