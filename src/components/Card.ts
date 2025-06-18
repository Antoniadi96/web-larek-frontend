import { Component } from './base/Component';
import { IEvents, ICardActions, IProduct } from '../types';
import { CDN_URL, categoryClass } from '../utils/constants';

export class Card extends Component<HTMLElement> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement | null;
    protected _container: HTMLElement;

    constructor(
        container: HTMLElement, 
        events: IEvents,
        actions?: ICardActions
    ) {
        super(container, events);
        
        this._container = container;
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            container.addEventListener('click', (e) => {
                const isButtonClick = this._button && 
                    (e.target === this._button || 
                     this._button.contains(e.target as Node));
                
                if (!isButtonClick) {
                    e.preventDefault();
                    actions.onClick(e);
                }
            });
        }

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.onClick(e);
            });
        }
    }

    render(data: IProduct): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.category = data.category;
        this.price = data.price;
        return this.container;
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        try {
            const fullPath = value 
                ? value.startsWith('http') 
                    ? value 
                    : `${CDN_URL}/${value.replace(/^\/+/, '')}`
                : `${CDN_URL}/placeholder.svg`;
            
            this._image.src = fullPath;
            this._image.alt = this._title.textContent || 'Изображение товара';
        } catch (error) {
            console.error('Error loading image:', error);
            this._image.src = `${CDN_URL}/placeholder.svg`;
            this._image.alt = 'Изображение недоступно';
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClassName = this.getCategoryClass(value);
        this._category.className = `card__category ${categoryClassName}`;
    }
    
    private getCategoryClass(category: string): string {
        return categoryClass.get(category);
    }
    
    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) this.setDisabled(this._button, true);
        } else {
            this.setText(this._price, `${value} синапсов`);
            if (this._button) this.setDisabled(this._button, false);
        }
    }

    set selected(value: boolean) {
        this.toggleClass(this._container, 'card_selected', value);
    }
}