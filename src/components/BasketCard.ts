import { Component } from './base/Component';
import { IProductBasket, IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class BasketCard extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        // Проверяем сам контейнер
        if (!container) {
            throw new Error('Container is null or undefined');
        }

        // Безопасное получение элементов с проверкой
        try {
            this._title = ensureElement<HTMLElement>('.card__title', container);
            this._price = ensureElement<HTMLElement>('.card__price', container);
            this._index = ensureElement<HTMLElement>('.basket__item-index', container);
            this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

            this._button.addEventListener('click', () => {
                events.emit('basket:remove', { id: container.dataset.id });
            });

        } catch (error) {
            console.error('Error initializing BasketCard elements:', error);
            console.error('Container content:', container.innerHTML);
            throw error;
        }
    }

    render(item: IProductBasket, index: number): HTMLElement {
        this.setText(this._title, item.title);
        this.setText(this._price, `${item.price} синапсов`);
        this.setText(this._index, (index + 1).toString());
        this.container.dataset.id = item.id;
        return this.container;
    }
}