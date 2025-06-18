import { Component } from './base/Component';
import { IEvents } from '../types';

export class Modal extends Component<HTMLElement> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	private _escapeHandler: (e: KeyboardEvent) => void;
	private _outsideHandler: (e: MouseEvent) => void;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
		this._content = container.querySelector('.modal__content') as HTMLElement;

		this._escapeHandler = (e: KeyboardEvent) => this.handleEscape(e);
		this._outsideHandler = (e: MouseEvent) => this.handleOutsideClick(e);

		this._closeButton?.addEventListener('click', () => this.close());
		this.container.addEventListener('click', this._outsideHandler);
	}

	open(content?: HTMLElement): void {
		const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
		this.container.classList.add('modal_active');

		if (content) {
			this.content = content;
		}

		document.addEventListener('keydown', this._escapeHandler);
		this.events.emit('modal:open');
	}

	close(): void {
		document.body.style.overflow = '';
        document.body.style.paddingRight = '';
		this.container.classList.remove('modal_active');
		document.removeEventListener('keydown', this._escapeHandler);
		this.events.emit('modal:close');
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	private handleEscape(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.close();
		}
	}

	private handleOutsideClick(event: MouseEvent): void {
		if (event.target === this.container) {
			this.close();
		}
	}
}

export class ModalManager {
	private modals: Modal[];

	constructor(events: IEvents) {
		const modalElements = document.querySelectorAll<HTMLElement>('.modal');
		this.modals = Array.from(modalElements).map(el => new Modal(el, events));
	}

	openByName(name: string, content?: HTMLElement) {
		const modal = this.modals.find(m => m.container.dataset.modal === name);
		if (modal) modal.open(content);
		else console.warn(`[ModalManager] Модалка с именем "${name}" не найдена`);
	}

	openByElement(element: HTMLElement, content?: HTMLElement) {
		const modal = this.modals.find(m => m.container === element);
		if (modal) modal.open(content);
		else console.warn(`[ModalManager] Модалка по элементу не найдена`);
	}

	closeAll() {
		this.modals.forEach(modal => modal.close());
	}
}

function getScrollbarWidth(): number {
    return window.innerWidth - document.documentElement.clientWidth;
}