import { ICardsData } from "../types";
import { Model } from "./base/Model";

export class AppState extends Model<ICardsData> {
    basket: string[]
}