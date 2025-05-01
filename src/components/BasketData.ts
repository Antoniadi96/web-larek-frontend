import { IProductBasket, IProduct, IEvents } from '../types';

export class BasketData {
    protected _items: IProductBasket[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    get items(): IProductBasket[] {
        return this._items;
    }

    addToBasket(product: IProduct): void {
        const existingItem = this._items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this._items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1
            });
        }
        this.events.emit('basket:changed', this._items);
    }

    deleteFromBasket(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed', this._items);
    }

    clearBasket(): void {
        this._items = [];
        this.events.emit('basket:changed', this._items);
    }

    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price ?? 0) * item.quantity;
        }, 0);
    }

    getTotalItems(): number {
        return this._items.reduce((total, item) => total + item.quantity, 0);
    }
}