// import { IEvents } from "./events";
// import { IBusket, IBusketData } from "../../types";

// export class BusketData implements IBusketData {
//     protected _busket: IBusket[];
//     protected events: IEvents;

//     constructor(events: IEvents) {
//         this._busket = []; // Инициализируем пустым массивом
//         this.events = events;
//     }

//     // Сеттер для корзины
//     set busket(busket: IBusket[]) {
//         this._busket = busket;
//         this.events.emit('busket:changed'); // Вызываем событие при изменении корзины
//     }

//     // Геттер для корзины
//     get busket() {
//         return this._busket;
//     }

//     // Метод удаления карточки из корзины
//     deleteCard(cardId: string, payload: Function | null): void {
//         this._busket = this._busket.filter(card => card.id !== cardId);
//         this.events.emit('busket:changed'); // Вызываем событие при изменении корзины
//         if (payload) payload(cardId);
//     }

//     summPrice(): number {
//         return this._busket.reduce((sum, card) => sum + (card.price || 0), 0);
//     }
// }