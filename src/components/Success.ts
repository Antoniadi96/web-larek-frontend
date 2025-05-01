import { Component } from './base/Component';
import { IEvents } from '../types';

export class Success extends Component<HTMLElement> {
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._total = container.querySelector('.order-success__description') as HTMLElement;
        this._button = container.querySelector('.order-success__close') as HTMLButtonElement;

        this._button.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}