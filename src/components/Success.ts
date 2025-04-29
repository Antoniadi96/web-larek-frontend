import { ISuccessActions } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

// Интерфейс состояния компонента
interface ISuccess {
    total: number;
}

// Класс компонента успешной оплаты
export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _description: HTMLElement;

    // Конструктор принимает контейнер и коллбэки действий
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        // Инициализация элементов DOM
        this._description = container.querySelector('.order-success__description');
        this._close = ensureElement<HTMLElement>(
            '.order-success__close',
            this.container
        );

        // Подписка на клик по кнопке закрытия, если коллбэк передан
        if (actions.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для установки общего количества синапсов
    set total(total: number) {
        this.setText(this._description, `Ваш заказ ${total} синапсов`);
    }
}
