import { Component } from './base/Component';
import { IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<HTMLElement> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
	}
}