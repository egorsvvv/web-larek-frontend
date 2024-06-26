import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IApi, ICardsData, IContactsForm, TAddress, TCommunication, IOrder} from './types';
import { API_URL, settings, CDN_URL} from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { ICard } from './types';
import { CardsContainer } from './components/CardContainer';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { AppState, CardItem, } from './components/AppData';
import { Busket } from './components/Busket';
import { Order, Contacts} from './components/Form';
import { Success } from './components/Success';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const basketCounter = document.querySelector('.header__basket-counter');
const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const page = new Page(document.body, events);

const appData = new AppState({}, events)
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const busket = new Busket(cloneTemplate(basketTemplate), events);
const modalContainer = document.querySelector('.modal') as HTMLElement;
const modal = new Modal(modalContainer, events);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const order = new Order(cloneTemplate(orderTemplate), events);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

Promise.all([api.getCards()])
    .then(([response]) => {
        if (response && Array.isArray(response.items)) {
            const items = response.items.map(item => ({
                ...item,
            }));
            appData.setCards(items);
            events.emit('initialData:loaded');
        }
    })
    .catch((err) => {
        console.error(err);
    });

events.on('initialData:loaded', () => {
    const cardsArray = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
    cardsContainer.render({ catalog: cardsArray });
});

events.on('card:select', (item: CardItem) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
        onClick: () => {
            events.emit('card:buy', item);
            const isInBasket = appData.isItemInBasket(item.id);
            card.buttonDisabled = isInBasket;
        }
    });
    const isInBasket = appData.isItemInBasket(item.id);
    card.buttonDisabled = isInBasket;
    appData.setPreview(item);
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
            id: item.id,
        })
    });
});

events.on('card:buy', (item: CardItem) => {
    appData.addToBasket(item);
    // appData.toggleOrderedCard(item.id, true);
});

events.on('basket:updated', (basket: CardItem[]) => {
    const basketItems = basket.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), events, {
            onClick: () => events.emit('card:delete', item)
        });
        card.index = index + 1; // Устанавливаем индекс элемента в корзине
        return card.render(item);
    });
    busket.items = basketItems;
    busket.total = basket.reduce((total, item) => total + (typeof item.price === 'number' ? item.price : 0), 0);
    busket.selected = basket.map(item => item.id);
    basketCounter.textContent = basket.length.toString();
});

events.on('card:delete', (item: CardItem) => {
    appData.removeFromBasket(item)
    // appData.toggleOrderedCard(item.id, false);
})

events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            busket.render()
        ])
    });
});

events.on('formErrorsOrder:change', (errors: Partial<TAddress>) => {
    const { address } = errors;
    order.valid = !address;
    order.errors = address || '';
});

events.on(/^order\..*:change/, (data: { field: keyof TAddress, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:open', () => {
    modal.render({
        content: order.render({
            valid: false,
            address: '',
            errors: [],
        })
    });
});

events.on('formErrorsСontacts:change', (errors: Partial<TCommunication>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof TCommunication, value: string }) => {
    appData.setContatsField(data.field, data.value);
});
// Метод валидации контактных данных

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            valid: false,
            email: '',
            phone: '',
            errors: [],
        })
    })
})

events.on('choose:offline', () => {
    appData.setPaymentMethod('offline');
});

events.on('choose:online', () => {
    appData.setPaymentMethod('online');
});

events.on('contacts:submit', () => {
    const orderData = appData.getOrderData();
    
    api.postCards(orderData)
        .then(response => {
            console.log('Order submitted successfully:', response);
            const total = response.total;
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });
            modal.render({
                content: success.render({ total })
            });
        })
        .catch(error => {
            console.error('Ошибка при отправке заказа на сервер:', error);
            events.emit('order:submissionFailed', error);
        });
});

// events.on('contacts:submit', () => {
//     api.postCards(appData.getOrderData())
//     .then((result) => {
//     })
// })

// events.on('contacts:submit', () => {
//     const success = new Success(cloneTemplate(successTemplate), {
//         onClick: () => {
//             modal.close();
//         }
//     });
//     modal.render({
//         content: success.render({})
//     });
// })

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

