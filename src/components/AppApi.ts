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
            .catch(error => {
                console.error('Ошибка при отправке заказа на сервер:', error);
                throw error; // Повторно выбросим ошибку для ее обработки в вызывающем коде
            });
    }

    // postCards(order: IOrder): Promise<IOrderResult> {
    //     return this._baseApi.post('/order', order).then(
    //         (data: IOrderResult) => data
    //     )
    // }
}