import { ICardsData, IContacts, ICard, IContactsForm, TAddress, TCommunication, IOrder } from "../types";
import { Card } from "./Card";
// import { CardData } from "./CardsData";
import { Model } from "./base/Model";
import { FormErrors } from "../types";
import { IEvents } from "./base/events";

export class CardItem extends Model<ICard> {
    id: string;
    description: string | null;
    image: string | null;
    title: string;
    category: string | null;
    price: number | string;

    constructor(data: ICard, events: IEvents) {
        super(data, events);
        this.id = data.id;
        this.description = data.description;
        this.image = data.image;
        this.title = data.title;
        this.category = data.category;
        this.price = data.price;
    }
}

export class AppState extends Model<ICardsData> {
    basket: CardItem[] = []; 
    catalog: ICard[];
    loading: boolean;
    order: TAddress = {
        address: '',
    };
    contacts: TCommunication = {
        email: '',
        phone: '',
    }
    preview: string | null;
    formErrors: FormErrors = {};
    paymentMethod: 'online' | 'offline';

    addToBasket(item: CardItem) {
        this.basket.push(item);
        this.events.emit('basket:updated', this.basket);
    }

    removeFromBasket(item: CardItem) {
        const index = this.basket.findIndex(basketItem => basketItem.id === item.id);
        if (index !== -1) {
            this.basket.splice(index, 1);
            this.events.emit('basket:updated', this.basket);
        }
    }

    setPreview(item: CardItem) {
        this.preview = item.id;
    }

    setCards(items: ICard[]) {
        this.catalog = items.map(item => new CardItem(item, this.events));
    }

    isItemInBasket(id: string): boolean {
        return this.basket.some(item => item.id === id);
    }

    setOrderField(field: keyof TAddress, value: string) {
        this.order[field] = value;
        this.validateOrder();
    }

    setContatsField(field: keyof TCommunication, value: string) {
        this.contacts[field] = value;
        this.validateContacts();
    }

    validateContacts() {
        console.log('Validating contacts...');
        console.log('Current email:', this.contacts.email);
        console.log('Current phone:', this.contacts.phone);
        const errors: typeof this.formErrors = {};
        if (!this.contacts.email.trim()) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.contacts.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsСontacts:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
 
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address.trim()) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsOrder:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setPaymentMethod(method:'online' | 'offline') {
        this.paymentMethod = method;
    }

    getOrderData(): IOrder {
        return {
            payment: this.paymentMethod || '',
            email: this.contacts.email,
            phone: this.contacts.phone,
            address: this.order.address,
            total: this.basket.reduce((total, item) => total + (typeof item.price === 'number' ? item.price : 0), 0),
            items: this.basket.map(item => item.id),
        };
    }

    clearBasket() {
        this.basket = [];
        this.events.emit('basket:updated', this.basket);
    }
}
