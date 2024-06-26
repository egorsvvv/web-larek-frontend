import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { formatNumber } from "../utils/utils";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._price = ensureElement<HTMLElement>('.order-success__description', this.container);

        this._close.addEventListener('click', () => {
			events.emit('success:close');
		});
    }

    set total(value: number) {
		this.setText(this._price, `Списано ${formatNumber(value)} синапсов`);
	}
}