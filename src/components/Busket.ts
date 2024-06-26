import { Component } from "./base/Component";
import { ensureElement, createElement, formatNumber } from "../utils/utils";
import { EventEmitter } from "./base/events";

interface IBusketView {
    items: HTMLElement[];
    total: number | string;
    selected: string[];
}

export class Busket extends Component<IBusketView> {
    protected list: HTMLElement;
    protected _total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total =  this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
        this.updateButtonState([]);
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        this.updateButtonState(items);
    }

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }

    private updateButtonState(items: any[]) {
        this.setDisabled(this.button, items.length === 0);
    }
}
