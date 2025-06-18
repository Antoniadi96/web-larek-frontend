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
		this.events.emit('order:changed', this._order);
	}

    validatePaymentForm(): boolean {
        this._errors = {};
    
        if (!this._order.payment) {
            this._errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this._order.address) {
            this._errors.address = 'Необходимо указать адрес';
        }
        this.events.emit('order:validation', this._errors);
        return Object.keys(this._errors).length === 0;
    }
    
    validateContactsForm(): boolean {
        this._errors = {};
    
        if (!this._order.email) {
            this._errors.email = 'Необходимо указать email';
        } else if (!this._order.email.includes('@')) {
            this._errors.email = 'Некорректный email';
        }
    
        if (!this._order.phone) {
            this._errors.phone = 'Необходимо указать телефон';
        } else {
            const phone = this._order.phone.replace(/\D/g, ''); 
            const startsWith = this._order.phone.startsWith('+7') || this._order.phone.startsWith('8');
            const validLength = phone.length === 11;
    
            if (!startsWith || !validLength) {
                this._errors.phone = 'Телефон должен начинаться с +7 или 8 и содержать 11 цифр';
            }
        }
    
        this.events.emit('order:validation', this._errors);
        return Object.keys(this._errors).length === 0;
    }

    createOrder(items: string[], total: number): IOrder {
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