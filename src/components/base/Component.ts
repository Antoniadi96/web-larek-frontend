import { IEvents } from "../../types";

export abstract class Component<T extends HTMLElement> {
    public container: T;
    protected events: IEvents;

    constructor(container: T, events: IEvents) {
        this.container = container;
        this.events = events;
    }

    protected setText(element: HTMLElement, value: unknown): void {
        if (element) element.textContent = String(value);
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (element) element.classList.toggle(className, force);
    }

    protected setVisible(element: HTMLElement, visible: boolean): void {
        if (element) element.style.display = visible ? '' : 'none';
    }

    protected setValue(element: HTMLInputElement, value: unknown): void {
        if (element) element.value = String(value);
    }
}