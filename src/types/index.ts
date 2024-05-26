export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBusket {
    id: string;
    price: number | null;
    title: string;
}

export interface IContacts {
    address: string;
    mail: string;
    phone: number;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
    buyCard(cardId: string, payload: Function | null): void;
    getCard(cardId: string): ICard;
    updateBusket(): IBusket[];
}

export interface IBusketData {
    busket: IBusket[];
    deleteCard(cardId: string, payload: Function | null): void;
    summPrice(price: number, payload: Function | null): void;
}

export interface IContactsData {
    checkAddressValidation(data: Record<keyof TAddress, string>): boolean;
    checkCommunicationValidation(data: Record<keyof TCommunication, string | number>): boolean;
}

export type TProduct = Pick<ICard, 'id' | 'image' | 'title' | 'price' | 'category'>;

export type TAddress = Pick<IContacts, 'address'>;

export type TCommunication = Pick<IContacts, 'mail' | 'phone'>