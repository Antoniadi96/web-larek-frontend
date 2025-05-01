import { IProductsData, IProduct, IEvents } from '../types';

export class ProductsData implements IProductsData {
    protected _products: IProduct[] = [];
    protected _preview: string | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }
    products: IProduct[];
    preview: string;

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('products:changed', this._products);
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProduct(id: string): IProduct {
        const product = this._products.find(item => item.id === id);
        if (!product) throw new Error('Product not found');
        return product;
    }

    saveProduct(product: IProduct): void {
        const index = this._products.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this._products[index] = product;
        } else {
            this._products.push(product);
        }
        this.events.emit('products:changed', this._products);
    }

    savePreview(id: string | null): void {
        this._preview = id;
        this.events.emit('preview:changed', { id });
    }
}