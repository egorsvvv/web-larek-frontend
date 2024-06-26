export interface ICard {
    id: string;
    description: string | null;
    image: string | null;
    title: string;
    category: string | null;
    price: number | string;
}

export interface IContactsForm {
    address: string;
    email: string;
    phone: string;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
    basket?: string[];
    order?: IContacts | null;
    loading?: boolean;
}
export type FormErrors = Partial<Record<keyof IContacts, string>>;

export type TAddress = Pick<IContactsForm, 'address'>;

export type TCommunication = Pick<IContactsForm, 'email' | 'phone'>

export interface IContacts extends IContactsForm {
    items: string[];
}

export type ApiPostMethods = 'POST' | 'PUT' 

export interface IApi {
    baseUrl: string;
    get<T>(uri:string): Promise<T>;
    post<T>(uri:string, data:object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrder extends IContactsForm {
    items: string[],
    payment: string,
    total: number
}

export interface IOrderResult {
    id: string;
}