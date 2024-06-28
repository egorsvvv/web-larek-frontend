import { IEvents } from "./base/events";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement

    constructor(container: HTMLElement, events?:IEvents) {
        super(container);
        this.events = events;
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());

        this.handleEscUp = this.handleEscUp.bind(this);
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.toggleClass(this.container, 'modal_active', true);
        document.addEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:open', this.events)
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        document.removeEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:close', this.events);
    }

    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}