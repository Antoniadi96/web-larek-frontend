import { Component } from './base/Component';
import { IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<HTMLElement> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _counter: HTMLElement; 

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    
        if (this._button) {
            this._button.addEventListener('click', () => {
                if (this._button.disabled) return;
                events.emit('order:open');
            });
        } else {
            console.warn('⚠ basket__button не найдена при инициализации Basket');
        }
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    set buttonDisabled(state: boolean) {
        this.setDisabled(this._button, state);
    }

    setElements() {
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    }
}

