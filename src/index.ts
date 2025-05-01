import './scss/styles.scss';

import { EventEmitter } from "./components/base/events";
import { AppApi } from "./components/AppApi";
import { ProductsData } from "./components/ProductsData";
import { BasketData } from "./components/BasketData";
import { OrderData } from "./components/OrderData";
import { Modal } from "./components/Modal";
import { Card } from "./components/Card";
import { PreviewCard } from "./components/PreviewCard";
import { Basket } from "./components/Basket";
import { BasketCard } from "./components/BasketCard";
import { OrderPayment } from "./components/OrderPayment";
import { OrderContacts } from "./components/OrderContacts";
import { Success } from "./components/Success";
import { API_URL } from "./utils/constants";
import { IProduct, IProductBasket, FormErrors } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Initialize core components
const events = new EventEmitter();
const api = new AppApi(API_URL);
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// Find all templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Initialize UI components
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPayment(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Global containers
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const galleryContainer = ensureElement<HTMLElement>('.gallery');


// Load products
api.getProducts()
    .then(products => {
        productsData.setProducts(products);
    })
    .catch(err => {
        console.error('Ошибка при загрузке продуктов:', err);
    });

// Render catalog
events.on('products:changed', (products: IProduct[]) => {
    galleryContainer.innerHTML = '';
    products.forEach((product) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
            onClick: () => events.emit('card:select', { id: product.id })
        });
        card.id = product.id;
        card.title = product.title;
        card.image = product.image;
        card.category = product.category;
        card.price = product.price;
        galleryContainer.appendChild(card.container);
    });
});

// Handle card selection
events.on('card:select', (data: { id: string }) => {
    console.log('Modal opened for product ID:', data.id); // Добавьте лог
    const product = productsData.getProduct(data.id);
    if (!product) {
        console.error('Product not found for ID:', data.id);
        return;
    }
    const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
    const inBasket = basketData.items.some(item => item.id === data.id);
    modal.open();
    modal.container.style.display = 'flex';
    modal.container.style.alignItems = 'center';
    modal.container.style.justifyContent = 'center';
        
    modal.content = preview.render(product, inBasket);
});

events.on('basket:changed', (items: IProductBasket[]) => {
    try {
        const basketList = ensureElement<HTMLElement>('.basket__list');
        const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

        // Проверка содержимого шаблона
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(basketTemplate.content.cloneNode(true));
        
        if (!tempDiv.querySelector('.card__title')) {
            throw new Error('Шаблон корзины не содержит .card__title');
        }

        basketList.innerHTML = '';

        items.forEach((item, index) => {
            try {
                const cardElement = cloneTemplate(basketTemplate);
                const card = new BasketCard(cardElement, events);
                basketList.appendChild(card.render(item, index));
            } catch (error) {
                console.error(`Error creating basket item ${index}:`, error);
            }
        });

        basket.total = basketData.getTotal();
        basket.counter = basketData.getTotalItems();
        basket.buttonDisabled = items.length === 0;

    } catch (error) {
        console.error('Error updating basket:', error);
    }
});

// Handle preview add to basket
events.on('preview:add', (data: { id: string }) => {
    const product = productsData.getProduct(data.id);
    if (product) {
        basketData.addToBasket(product);
        modal.close(); // Явное закрытие модалки
        
        // Проверяем что items существует перед использованием map
        const items = basketData.items || [];
        basket.items = items.map((item, index) => {
            const card = new BasketCard(cloneTemplate(basketTemplate), events);
            return card.render(item, index);
        });
        
        basket.total = basketData.getTotal();
    }
});

// Handle preview remove from basket
events.on('preview:remove', (data: { id: string }) => {
    basketData.deleteFromBasket(data.id);
});

// Handle basket open/close
events.on('basket:open', () => {
    modal.content = basket.container;
    modal.open();
});

// Handle order open
events.on('order:open', () => {
    modal.content = orderPayment.container;
    modal.open();
});

// Handle order payment changes
events.on('order.payment:change', (data: { payment: 'card' | 'cash' }) => {
    orderData.setOrderField('payment', data.payment);
    orderPayment.valid = orderData.validateOrder();
});

// Handle order address changes
events.on('order.address:change', (data: { address: string }) => {
    orderData.setOrderField('address', data.address);
    orderPayment.valid = orderData.validateOrder();
});

// Handle order validation
events.on('order:validation', (errors: FormErrors) => {
    orderPayment.errors = Object.values(errors).join('; ');
});

// Handle order submit (go to contacts)
events.on('order:submit', () => {
    if (orderData.validateOrder()) {
        modal.content = orderContacts.container;
    }
});

// Handle contacts changes
events.on('order.email:change', (data: { email: string }) => {
    orderData.setOrderField('email', data.email);
    orderContacts.valid = orderData.validateOrder();
});

events.on('order.phone:change', (data: { phone: string }) => {
    orderData.setOrderField('phone', data.phone);
    orderContacts.valid = orderData.validateOrder();
});

// Handle contacts submit
events.on('contacts:submit', () => {
    if (orderData.validateOrder()) {
        const order = orderData.createOrder(basketData.items, basketData.getTotal());
        api.createOrder(order)
            .then(() => {
                success.total = basketData.getTotal();
                modal.content = success.container;
                basketData.clearBasket();
                orderData.clearOrder();
            })
            .catch((err: string) => {
                console.error('Ошибка при оформлении заказа:', err);
            });
    }
});

// Handle success close
events.on('success:close', () => {
    modal.close();
});

// Handle basket button click
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});