import { IEvents } from './base/events';
import { IOrderData, IBasketData, TProductBasket } from '../types/index';

// Класс для работы с данными корзины
export class BasketData implements IBasketData {
    protected _products: TProductBasket[] = [];

    // Конструктор инициализирует обработчики событий
    constructor(protected events: IEvents) {
        this.events = events;
    }

    // Геттер для получения списка товаров в корзине
    get products(): TProductBasket[] {
        return this._products;
    }

    // Добавление товара в корзину
    appendToBasket(product: TProductBasket) {
        this._products.push(product);
        this.events.emit('basket:change');
    }

    // Удаление товара из корзины
    removeFromBasket(product: TProductBasket) {
        this._products = this._products.filter(
            (_product) => _product.id !== product.id
        );
        this.events.emit('basket:change');
    }

    // Проверка наличия товара в корзине и изменение состояния
    isBasketCard(product: TProductBasket) {
        return !this.products.some((card) => card.id === product.id)
            ? this.appendToBasket(product)
            : this.removeFromBasket(product);
    }

    // Получение статуса кнопки для товара
    getButtonStatus(product: TProductBasket) {
        if (
            product.price === null ||
            product.price === undefined ||
            String(product.price) === 'Бесценно'
        ) {
            return 'Нельзя купить';
        }
        return !this._products.some((card) => card.id === product.id)
            ? 'Купить'
            : 'Удалить';
    }

    // Расчет общей суммы товаров в корзине
    getBasketPrice() {
        let total = 0;
        this._products.map((elem) => {
            total += elem.price;
        });
        return total;
    }

    // Получение количества товаров в корзине
    getBasketQuantity() {
        return this._products.length;
    }

    // Очистка корзины
    clearBasket() {
        this._products = [];
        this.events.emit('basket:change');
    }

    // Подготовка данных корзины для заказа
    sendBasketToOrder(orderData: IOrderData) {
        const orderItems = this._products.map((product) => product.id);

        orderData.setOrderField('items', orderItems);
        orderData.setOrderField('total', this.getBasketPrice());
    }
}
