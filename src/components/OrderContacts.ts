import { Component } from "./base/Component";
import { IEvents } from "../types";

export class OrderContacts extends Component<HTMLElement> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _errors: HTMLElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._email = container.querySelector('[name="email"]') as HTMLInputElement;
        this._phone = container.querySelector('[name="phone"]') as HTMLInputElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;
        this._submitButton = container.querySelector('.button') as HTMLButtonElement;

        this._email.addEventListener('input', () => {
            events.emit('order.email:change', { email: this._email.value });
        });

        this._phone.addEventListener('input', () => {
            events.emit('order.phone:change', { phone: this._phone.value });
        });

        this._submitButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this.setValue(this._email, value);
    }

    set phone(value: string) {
        this.setValue(this._phone, value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set valid(value: boolean) {
        this.setDisabled(this._submitButton, !value);
    }
}