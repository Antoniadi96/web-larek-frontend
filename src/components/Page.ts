import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

// Интерфейс состояния страницы
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// Класс для управления страницей
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    // Конструктор принимает контейнер и систему событий
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов DOM
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        // Подписка на клик по корзине
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
