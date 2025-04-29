import { IOrder, IProduct } from '../types/index';
import { IApi } from '../types';
import { ApiListResponse } from './base/api';

// Основной класс API приложения
export class AppApi {
    private _baseApi: IApi;
    private cdn: string;

    // Конструктор инициализирует зависимости
    constructor(cdn: string, baseApi: IApi) {
        this._baseApi = baseApi;
        this.cdn = cdn;
    }

    // Получение списка всех продуктов
    // Добавляет полный URL к изображениям
    getProducts(): Promise<IProduct[]> {
        return this._baseApi
            .get<ApiListResponse<IProduct>>(`/product`)
            .then((response) =>
                response.items.map((product) => ({
                    ...product,
                    image: this.cdn + product.image,
                }))
            );
    }

    // Получение одного продукта по ID
    // Добавляет полный URL к изображению
    getProduct(id: string): Promise<IProduct> {
        return this._baseApi
            .get<IProduct>(`/product/${id}`)
            .then((product) => ({
                ...product,
                image: this.cdn + product.image,
            }));
    }

    // Создание нового заказа
    // Отправляет данные заказа на сервер
    orderProducts(order: IOrder): Promise<IOrder> {
        return this._baseApi
            .post<IOrder>('/order', order)
            .then((data: IOrder) => data);
    }
}
