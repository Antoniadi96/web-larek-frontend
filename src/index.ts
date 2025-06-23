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
import { MainPage } from "./components/MainPage";
import { BasketControls } from "./components/BasketControls";

const events = new EventEmitter();
const api = new AppApi(API_URL);
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPayment(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

const page = new MainPage(ensureElement<HTMLElement>('.page__wrapper'), events);
const controls = new BasketControls(basket.container, events);

api.getProducts()
    .then(products => {
        productsData.setProducts(products);
    })
    .catch(err => {
        console.error('Ошибка при загрузке продуктов:', err);
    });

events.emit('basket:changed', basketData.items);

events.on('products:changed', (products: IProduct[]) => {
	page.catalog = products.map((product) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => events.emit('card:select', { id: product.id })
		});
		return card.render(product); 
	});
});

events.on('card:select', (data: { id: string }) => {
    const product = productsData.getProduct(data.id);
    if (!product) {
        console.error('Product not found for ID:', data.id);
        return;
    }
    const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
    const inBasket = basketData.items.some(item => item.id === data.id);
    modal.open();
        
    modal.content = preview.render(product, inBasket);
});

events.on('basket:changed', (items: IProductBasket[]) => {
	try {
		basket.items = items.map((item, index) => {
			const card = new BasketCard(cloneTemplate(cardBasketTemplate), events);
			return card.render(item, index + 1);
		});

		basket.total = basketData.getTotal();
		controls.counter = basketData.getTotalItems();
		controls.buttonDisabled = items.length === 0;

	} catch (error) {
		console.error('Error updating basket:', error);
	}
});

events.on('preview:add', (data: { id: string }) => {
	const product = productsData.getProduct(data.id);
	if (product) {
		basketData.addToBasket(product);
		modal.close();
	}
});

events.on('preview:remove', (data: { id: string }) => {
    basketData.deleteFromBasket(data.id);
    modal.close();
});

events.on('basket:open', () => {
    events.emit('basket:changed', basketData.items);

    modal.content = basket.container;
    modal.open();
});

events.on('order:open', () => {
    modal.content = orderPayment.container;
    modal.open();
});

events.on('order.payment:change', (data: { payment: 'card' | 'cash' }) => {
	orderData.setOrderField('payment', data.payment);
	orderPayment.valid = orderData.validatePaymentForm();
});

events.on('order.address:change', (data: { address: string }) => {
	orderData.setOrderField('address', data.address);
	orderPayment.valid = orderData.validatePaymentForm();
});

events.on('order:validation', (errors: FormErrors) => {
	const errorText = Object.values(errors).join('; ');

	orderPayment.errors = errorText;
	orderContacts.errors = errorText;
});

events.on('order:submit', () => {
	if (orderData.validatePaymentForm()) {
		modal.content = orderContacts.container;
	} else {
		events.emit('order:validation', orderData.errors);
	}
});

events.on('order.email:change', (data: { email: string }) => {
	orderData.setOrderField('email', data.email);
	orderContacts.valid = orderData.validateContactsForm();
});

events.on('order.phone:change', (data: { phone: string }) => {
	orderData.setOrderField('phone', data.phone);
	orderContacts.valid = orderData.validateContactsForm();
});

events.on('contacts:submit', () => {
	if (orderData.validateContactsForm()) {
		const order = orderData.createOrder(
			basketData.items.map(item => item.id), 
			basketData.getTotal()
		);

		api.createOrder(order)
			.then(() => {
				success.total = basketData.getTotal();
				modal.content = success.container;
				modal.open();
				basketData.clearBasket();
				orderData.clearOrder();
                orderPayment.togglePayment(null);
                orderPayment.address = '';
                orderPayment.errors = '';
                orderPayment.valid = false;

                orderContacts.email = '';
                orderContacts.phone = '';
                orderContacts.errors = '';
                orderContacts.valid = false;
			})
			.catch((err: string) => {
				console.error('Ошибка при оформлении заказа:', err);
			});
	} else {
		events.emit('order:validation', orderData.errors);
	}
});

events.on('success:close', () => {
    modal.close();
});

events.on('basket:remove', (data: { id: string }) => {
    basketData.deleteFromBasket(data.id);
});

const basketIcon = ensureElement<HTMLButtonElement>('.header__basket');
basketIcon.addEventListener('click', () => {
  events.emit('basket:open');
});