import { IOrder, IOrderForm, FormErrors, IEvents, IProductBasket } from '../types';

export class OrderData {
    protected _order: Partial<IOrderForm> = {};
    protected _errors: FormErrors = {};
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setOrderField<T extends keyof IOrderForm>(field: T, value: IOrderForm[T]): void {
        this._order[field] = value;
        this.validateOrder();
        this.events.emit('order:changed', this._order);
    }

    validateOrder(): boolean {
        this._errors = {};
    
        if (!('payment' in this._order) || !this._order.payment) {
            this._errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!('address' in this._order) || !this._order.address) {
            this._errors.address = 'Необходимо указать адрес';
        }
        if (!('email' in this._order) || !this._order.email) {
            this._errors.email = 'Необходимо указать email';
        } else if (!this._order.email.includes('@')) {
            this._errors.email = 'Некорректный email';
        }
        if (!('phone' in this._order) || !this._order.phone) {
            this._errors.phone = 'Необходимо указать телефон';
        }
    
        this.events.emit('order:validation', this._errors);
        return Object.keys(this._errors).length === 0;
    }

    createOrder(items: IProductBasket[], total: number): IOrder {
        // Проверка через ключи
        const requiredFields: (keyof IOrderForm)[] = ['payment', 'address', 'email', 'phone'];
        const missingFields = requiredFields.filter(field => !this._order[field]);
    
        if (missingFields.length > 0) {
            throw new Error(`Не заполнены поля: ${missingFields.join(', ')}`);
        }
    
        return {
            ...this._order as Required<IOrderForm>,
            items,
            total
        };
    }

    get errors(): FormErrors {
        return this._errors;
    }

    clearOrder(): void {
        this._order = {};
        this._errors = {};
    }
}