import { TOrderContact } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

// Класс для работы с контактной информацией заказа
export class OrderContacts extends Form<TOrderContact> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    // Конструктор принимает контейнер формы и систему событий
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Инициализация полей формы
        this._email = container.querySelector(
            'input[name="email"]'
        ) as HTMLInputElement;
        this._phone = container.querySelector(
            'input[name="phone"]'
        ) as HTMLInputElement;
    }

    // Сеттер для установки значения email и phone
    set email(value: string) {
        this._email.value = value;
        this._phone.value = value;
    }
}
