import { Component } from './base/Component';
import { IEvents } from '../types';

export class OrderPayment extends Component<HTMLElement> {
    protected _buttonCard: HTMLButtonElement;
    protected _buttonCash: HTMLButtonElement;
    protected _address: HTMLInputElement;
    protected _errors: HTMLElement;
    protected _submitButton: HTMLButtonElement;

    private _triedSubmit = false;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._buttonCard = container.querySelector('[name="card"]') as HTMLButtonElement;
        this._buttonCash = container.querySelector('[name="cash"]') as HTMLButtonElement;
        this._address = container.querySelector('[name="address"]') as HTMLInputElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('.order__button') as HTMLButtonElement;

        this._buttonCard.addEventListener('click', () => {
            this.togglePayment('card');
            events.emit('order.payment:change', { payment: 'card' });
        });

        this._buttonCash.addEventListener('click', () => {
            this.togglePayment('cash');
            events.emit('order.payment:change', { payment: 'cash' });
        });

        this._address.addEventListener('input', () => {
            events.emit('order.address:change', { address: this._address.value });

            if (this._triedSubmit) {
                events.emit('order:validation:force');
            }
        });

        this._submitButton.addEventListener('click', () => {
            this._triedSubmit = true;
            events.emit('order:submit');
        });
    }

    togglePayment(method: 'card' | 'cash' | null): void {
        this.toggleClass(this._buttonCard, 'button_alt-active', method === 'card');
        this.toggleClass(this._buttonCash, 'button_alt-active', method === 'cash');
    }
    
    set address(value: string) {
        this.setValue(this._address, value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set valid(value: boolean) {
        this.setDisabled(this._submitButton, !value);
    }

    get triedSubmit(): boolean {
        return this._triedSubmit;
    }
}