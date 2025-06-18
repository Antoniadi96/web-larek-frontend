import { Component } from './base/Component';
import { IProduct, IEvents } from '../types';
import { CDN_URL, categoryClass } from '../utils/constants';

export class PreviewCard extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _inBasket: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._title = container.querySelector('.card__title') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._category = container.querySelector('.card__category') as HTMLElement;

        this._button.addEventListener('click', () => {
            if (this._inBasket) {
                events.emit('preview:remove', { id: container.dataset.id });
            } else {
                events.emit('preview:add', { id: container.dataset.id });
            }
        });
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        this.setText(this._button, value ? 'Убрать из корзины' : 'Купить');
    }

    protected setSafeImage(element: HTMLImageElement, src: string, alt: string) {
        try {
            const fullPath = src 
                ? src.startsWith('http') 
                    ? src 
                    : `${CDN_URL}/${src.replace(/^\/+/, '')}`
                : `${CDN_URL}/placeholder.svg`;
            
            element.src = fullPath;
            element.alt = alt || 'Изображение товара';
        } catch (error) {
            console.error('Error loading image:', error);
            element.src = `${CDN_URL}/placeholder.svg`;
            element.alt = 'Изображение недоступно';
        }
    }

    render(data: IProduct, inBasket: boolean): HTMLElement {
        this.setText(this._title, data.title);
        this.setSafeImage(this._image, data.image, data.title);
        this.setText(this._description, data.description);
        this.setText(this._category, data.category);
        this._category.className = `card__category ${categoryClass.get(data.category) ?? ''}`;
        
        if (data.price === null) {
            this.setText(this._price, 'Бесценно');
            this.setDisabled(this._button, true);
        } else {
            this.setText(this._price, `${data.price} синапсов`);
            this.setDisabled(this._button, false);
        }

        this.inBasket = inBasket;
        this.container.dataset.id = data.id;
        return this.container;
    }
}