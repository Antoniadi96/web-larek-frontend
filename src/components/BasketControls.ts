import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../types';

export class BasketControls extends Component<HTMLElement> {
	protected _counter: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

		this._button.addEventListener('click', () => {
			if (!this._button.disabled) {
				events.emit('order:open');
			}
		});
	}

	set counter(value: number) {
		this._counter.textContent = value.toString();
	}

	set buttonDisabled(state: boolean) {
		this._button.disabled = state;
	}
}