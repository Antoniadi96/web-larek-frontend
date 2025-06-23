import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../types';

export class MainPage extends Component<HTMLElement> {
	protected _gallery: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._gallery = ensureElement<HTMLElement>('.gallery', container);
	}

	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}
}