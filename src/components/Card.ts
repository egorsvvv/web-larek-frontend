import { ICard } from "../types";
import { cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { CDN_URL } from "../utils/constants";

export class Card extends Component<ICard>{
    protected element: HTMLElement;
    protected events: IEvents;
    protected cardId: string;
    protected cardDescription?: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardCategory: HTMLElement;
    protected cardTitle: HTMLElement;
    protected cardButtonBuy?: HTMLButtonElement;
    protected cardPrice: HTMLElement;
    protected cardButtonPreview?: HTMLButtonElement;
    protected cardBusketDelete?: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;


        this.cardCategory = this.container.querySelector('.card__category');
        this.cardButtonPreview = this.container.querySelector('.gallery__item');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardPrice = this.container.querySelector('.card__price');
        this.cardDescription = this.container.querySelector('.card__text');
        this.cardBusketDelete = this.container.querySelector('.basket__item-delete');
        this.cardButtonBuy = this.container.querySelector('.card__button');

        this.addEventListeners();
    }

    private addEventListeners() {
        if (this.cardButtonPreview) {
            this.cardButtonPreview.addEventListener('click', () =>
                this.events.emit('card:select', { card: this })
            );
        }

        if (this.cardBusketDelete) {
            this.cardBusketDelete.addEventListener('click', () =>
                this.events.emit('card:delete', { card: this })
            );
        }

        if (this.cardButtonBuy) {
            this.cardButtonBuy.addEventListener('click', () =>
                this.events.emit('card:buy', { card: this })
            );
        }
    }

    render(data: Partial<ICard>): HTMLElement {
        Object.assign(this as object, data?? {});
        return this.container;
    }

    set id(id:string) {
        this.cardId = id;
    }

    get id(): string {
        return this.cardId;
    }


    set description(value: string | undefined) {
        if (this.cardDescription) this.cardDescription.textContent = value || '';
    }


    set image(value: string | undefined) {
        if (this.cardImage) {
            this.cardImage.src = `${CDN_URL}${value}`;
            this.cardImage.alt = this.title; 
        }
    }

    set category(value: string | undefined) {
        if (this.cardCategory) this.cardCategory.textContent = value || '';
    }

    set title(value: string) {
        this.cardTitle.textContent = value;
    }

    set price(value: number | null) {
        const priceText = value !== null ? `${value} синапсов` : 'Бесплатно';
        this.cardPrice.textContent = priceText;
}
}