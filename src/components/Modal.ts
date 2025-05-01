import { Component } from './base/Component';
import { IEvents } from '../types';
import { ensureElement } from '../utils/utils';

export class Modal extends Component<HTMLElement> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private _escapeHandler: (e: KeyboardEvent) => void;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._escapeHandler = (e: KeyboardEvent) => this.handleEscape(e);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    open(): void {
        document.body.style.overflow = 'hidden';
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._escapeHandler);
        this.events.emit('modal:open');
    }
    
    close(): void {
        document.body.style.overflow = '';
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