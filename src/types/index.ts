export interface ICard {
    id: string;
    description: string | null;
    image: string | null;
    title: string;
    category: string | null;
    price: number | string;
}

export interface IBusket {
    id: string;
    price: number | string;
    title: string;
}

export interface IContacts {
    address: string;
    mail: string;
    phone: string;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
}

export interface IBusketData {
    busket: IBusket[];
    deleteCard(cardId: string, payload: Function | null): void;
    summPrice(price: string, payload: Function | null): void;
}

export interface IContactsData {
    checkAddressValidation(data: Record<keyof TAddress, string>): boolean;
    checkCommunicationValidation(data: Record<keyof TCommunication, string | number>): boolean;
}

export type TProduct = Pick<ICard, 'id' | 'image' | 'title' | 'price' | 'category'>;

export type TAddress = Pick<IContacts, 'address'>;

export type TCommunication = Pick<IContacts, 'mail' | 'phone'>

export type ApiPostMethods = 'POST' | 'PUT' 

export interface IApi {
    baseUrl: string;
    get<T>(uri:string): Promise<T>;
    post<T>(uri:string, data:object, method?: ApiPostMethods): Promise<T>;
}