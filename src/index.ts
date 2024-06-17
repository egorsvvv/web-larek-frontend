import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { CardData } from './components/CardsData';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IApi } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { ICard } from './types';
import { CardsContainer } from './components/CardContainer';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const cardsData = new CardData(events);
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

Promise.all([api.getCards()])
    .then(([response]) => {
        if (response && Array.isArray(response.items)) {
            cardsData.cards = response.items;
            events.emit('initialData:loaded');
        }
    })
    .catch((err) => {
        console.error(err);
    });

events.on('initialData:loaded', () => {
    const cardsArray = cardsData.cards.map((item) => {
        const cardInstance = new Card(cloneTemplate(cardTemplate), events);
        return cardInstance.render(item);
    });

    cardsContainer.render({ catalog: cardsArray });
});
