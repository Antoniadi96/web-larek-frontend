import { ApiListResponse, Api } from './base/api';
import { IApiClient, IProduct, IOrder } from '../types/index';

export class AppApi extends Api implements IApiClient {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.get('/product') as ApiListResponse<IProduct>;
        return response.items;
    }

    async getProduct(id: string): Promise<IProduct> {
        return await this.get(`/product/${id}`) as IProduct;
    }

    async createOrder(order: IOrder): Promise<IOrder> {
        return await this.post('/order', order) as IOrder;
    }
}