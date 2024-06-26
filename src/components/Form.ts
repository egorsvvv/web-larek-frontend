import { Component } from "./base/Component";
import { IEvents } from '../components/base/events';
import { ensureElement } from "../utils/utils";
import { TAddress, TCommunication } from "../types/index"

interface IFormState {
    valid: boolean;
    errors: string[];
}


export class Form<T> extends Component<IFormState>{
    protected submitBtn: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitBtn = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }
    
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setDisabled(this.submitBtn, !value);
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);

        return this.container;
    }
}

export class Order extends Form<TAddress> {
    private cashBtn: HTMLButtonElement;
    private onlineBtn: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events)
        this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;

        this.addressInput.addEventListener('input', (event) => {
            const value = (event.target as HTMLInputElement).value;
            this.events.emit(`${this.container.name}.address:change`, { field: 'address', value });
        });
        
        this.cashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.onlineBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);

        if (this.cashBtn) {
            this.cashBtn.addEventListener('click', () => {
                events.emit('choose:offline');
            });
        } if (this.onlineBtn) {
            this.onlineBtn.addEventListener('click', () => {
                events.emit('choose:online');
            });
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
        this.events.emit(`${this.container.name}.address:change`, { field: 'address', value });
    }
}

export class Contacts extends Form<TCommunication> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;

        this.emailInput.addEventListener('input', (event) => {
            const value = (event.target as HTMLInputElement).value;
            this.events.emit(`${this.container.name}.email:change`, { field: 'email', value });
        });

        this.phoneInput.addEventListener('input', (event) => {
            const value = (event.target as HTMLInputElement).value;
            this.events.emit(`${this.container.name}.phone:change`, { field: 'phone', value });
        });
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set mail(value: string) {
        this.emailInput.value = value;
    }
}