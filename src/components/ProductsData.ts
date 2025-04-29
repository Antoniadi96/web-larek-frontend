import { IProduct, IProductsData, TFormErrors } from '../types';
import { IEvents } from './base/events';

// Класс для работы с данными о продуктах
export class ProductsData implements IProductsData {
    _products: IProduct[];
    _preview: string | null;

    // Конструктор принимает систему событий
    constructor(protected events: IEvents) {
        this.events = events;
    }

    get products(): IProduct[] {
        return this._products;
    }

    // Метод для установки списка продуктов
    setProducts(products: IProduct[]) {
        this._products = products;
        this.events.emit('card:change');
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    // Метод для добавления нового продукта в начало списка
    addProduct(product: IProduct) {
        this._products = [product, ...this._products];
    }

    // Метод для получения продукта по ID
    getProduct(id: string) {
        return this.products.find((product) => product.id === id) || null;
    }

    // Метод для сохранения ID продукта в превью
    savePreview(product: IProduct): void {
        this._preview = product.id;
        this.events.emit('preview:change', product);
    }

    get preview(): string | null {
        return this._preview;
    }
}
