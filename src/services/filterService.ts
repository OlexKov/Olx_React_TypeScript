import axios from "axios";
import { AdvertFilterModel } from "../models/AdvertFilterModel";
import { FilterValueModel } from "../models/FilterValueModel";
import { TryError } from "../helpers/common-methods";
const filterAPIUrl = process.env.REACT_APP_FILTER_API_URL;
export const filterService = {

   getCategoryFilters: (categoryId: number) => TryError<AdvertFilterModel[]>(()=> axios.get<AdvertFilterModel[]>(filterAPIUrl + '/category-filters/' + categoryId)),
   getAdvertFilterValues: (advertId: number) => TryError<FilterValueModel[]>(()=> axios.get<FilterValueModel[]>(filterAPIUrl + '/advert-values/' + advertId)),

}