import { TProductBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

// Интерфейс состояния корзины
export interface IBasket {
    items: TProductBasket[];
    total: number | null;
}

// Класс компонента корзины
export class Basket extends Component<IBasket> {
    protected _catalog: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    // Конструктор инициализирует компонент
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Находим или создаем необходимые элементы
        this._catalog = ensureElement<HTMLElement>(`.basket__list`, this.container);
        this._price = ensureElement<HTMLElement>(`.basket__price`, this.container);
        this._button = container.querySelector(`.basket__button`);

        // Инициализируем список товаров
        this.items = [];

        // Добавляем обработчик клика на кнопку
        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }

    // Обновляет состояние кнопки оформления заказа
    updateButtonState() {
        const totalPrice = parseFloat(this._price.textContent || '0');
        if (totalPrice > 0) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    // Сеттер для общей суммы
    set price(value: number) {
        this._price.textContent = `${value} синапсов`;
        this.updateButtonState();
    }

    // Сеттер для списка товаров
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._catalog.replaceChildren(...items);
        } else {
            this._catalog.replaceChildren(
                createElement('p', { textContent: 'Корзина пуста' })
            );
        }
        this.updateButtonState();
    }
}
