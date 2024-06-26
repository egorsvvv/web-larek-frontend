import { IApi, ICard, IOrder, IOrderResult } from "../types";
import { Order } from "./Form";
import { Api } from "./base/api";

export interface ApiResponse {
    total: number;
    items: ICard[];
}

export class AppApi {
    private _baseApi: IApi;

    constructor(baseApi: IApi) {
        this._baseApi = baseApi;
    }

    getCards(): Promise<ApiResponse> {
        return this._baseApi.get<ApiResponse>(`/product`).then((response: ApiResponse) => response);
    }

    postCards(order: IOrder): Promise<IOrder> {
        console.log('Отправка заказа на сервер:', order);
        return this._baseApi.post<IOrder>(`/order`, order)
            .then((response: IOrder) => response)
    }
}