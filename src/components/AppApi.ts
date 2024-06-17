import { IApi, ICard } from "../types";

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
}