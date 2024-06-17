import { IEvents } from "./base/events";
import { Component } from "./base/Component";


export class Modal<T> extends Component<T> {
    protected modal: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events:IEvents) {
        super(container);
        this.events = events;
        const closeButtonElement = this.container.querySelector('.modal__close');
        closeButtonElement.addEventListener('click', this.close.bind(this));
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscUp);
    }

    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    };
}