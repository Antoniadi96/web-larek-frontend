import { Component } from './base/Component';
import { IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<HTMLElement> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _counter: HTMLElement; // Добавляем элемент счетчика

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter'); // Находим элемент счетчика

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    // Добавляем setter для counter
    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    set buttonDisabled(state: boolean) {
        this.setDisabled(this._button, state);
    }
}