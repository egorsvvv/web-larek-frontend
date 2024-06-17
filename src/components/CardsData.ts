import { ICard, ICardsData, IBusket } from "../types";
import { IEvents } from "./base/events";

export class CardData implements ICardsData {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сеттер для карточек
    set cards(cards: ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed'); // Вызываем событие при изменении карточек
    }

    // Геттер для карточек
    get cards() {
        return this._cards;
    }

    set preview(preview: string | null) {
        this._preview = preview;
        this.events.emit('preview:changed'); // Вызываем событие при изменении preview
    }

    // Геттер для preview
    get preview() {
        return this._preview;
    }

    // Метод покупки карточки
    buyCard(cardId: string, payload: Function | null): void {
        const card = this.getCard(cardId);
        if (card) {
            // Пример логики покупки карточки
            console.log(`Покупка карточки: ${card.title}`);
            if (payload) payload(card);
        }
    }

    // Метод получения карточки по ID
    getCard(cardId: string): ICard {
        const card = this._cards.find(card => card.id === cardId);
        if (!card) {
            throw new Error(`Карточка с ID ${cardId} не найдена`);
        }
        return card;
    }

    // Метод обновления корзины
    updateBusket(): IBusket[] {
        // Пример логики обновления корзины
        return this._cards.map(card => ({
            id: card.id,
            price: card.price, // Правильное имя свойства
            title: card.title, // Правильное имя свойства
        }));
    }
}