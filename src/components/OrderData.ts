import { IOrder, IOrderData, TPaymentMethod } from '../types';
import { TFormErrors, TOrderInput } from '../types/index';
import { IEvents } from './base/events';

// Класс для работы с данными заказа
export class OrderData implements IOrderData {
    protected _formErrors: TFormErrors;
    protected _order: IOrder = {
        total: 0,
        items: [],
        email: '',
        phone: '',
        address: '',
        payment: '',
    };

    // Конструктор принимает систему событий
    constructor(protected events: IEvents) {
        this.events = events;
    }

    get formErrors(): TFormErrors {
        return this._formErrors;
    }

    get order(): IOrder {
        return this._order;
    }

    // Установка способа оплаты
    setOrderPayment(value: TPaymentMethod) {
        this._order.payment = value;
    }

    // Установка email
    setOrderEmail(value: string) {
        this._order.email = value;
    }

    // Установка адреса
    setOrderAddress(value: string) {
        this._order.address = value;
    }
    
    // Установка поля заказа
    setOrderField(field: keyof TOrderInput, value: string) {
        this._order[field] = value;
        this.validateOrder();
    }

    // Валидация данных заказа
    validateOrder() {
        const errors: typeof this._formErrors = {};

        if (!this._order.payment) {
            errors.payment = 'Укажите способ оплаты';
        }
        if (!this._order.email) {
            errors.email = 'Укажите ваш e-mail';
        }
        if (!this._order.address) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this._order.phone) {
            errors.phone = 'Укажите номер телефона';
        }

        this._formErrors = errors;
        this.events.emit('errors:change', this._formErrors);

        return Object.keys(errors).length === 0;
    }

    // Очистка данных заказа
    clearOrder() {
        this._order = {
            total: 0,
            items: [],
            email: '',
            phone: '',
            address: '',
            payment: '',
        };
    }
}
