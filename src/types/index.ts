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
    savePreview(product: IProduct): void;
}

// Базовый API интерфейс
export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: any, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс для данных заказа
export interface IOrderData {
    formErrors: TFormErrors;
    order: IOrder;
    setOrderPayment(value: string): void;
    setOrderEmail(value: string): void;
    setOrderField(field: keyof TOrderInput, value: string): void;
    setOrderField(field: keyof IOrder, value: IOrder[keyof IOrder]): void;
    validateOrder(): boolean;
    clearOrder(): void;
}

// Интерфейс для данных корзины
export interface IBasketData {
    products: TProductBasket[];
    appendToBasket(product: IProduct): void;
    removeFromBasket(product: IProduct): void;
    getButtonStatus(product: TProductBasket): string;
    getBasketPrice(): number;
    getBasketQuantity(): number;
    clearBasket(): void;
    sendBasketToOrder(orderData: IOrderData): void;
}

// Интерфейс для обработки действий с карточками товаров
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Интерфейс для валидации форм
export interface IFormValidator {
    valid: boolean;
    errors: string[];
}

// Интерфейс для обработки действий после успешного выполнения
export interface ISuccessActions {
    onClick: () => void;
}

// Типы данных для корзины
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

// Типы оплаты
export type TPaymentMethod = 'card' | 'cash';

// Типы запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Тип для ошибок формы
export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Типы для заказа
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
export type TOrderInput = Pick<
    IOrder,
    'payment' | 'address' | 'email' | 'phone'
>;
export type TOrderContact = Pick<IOrder, 'email' | 'phone'>;
