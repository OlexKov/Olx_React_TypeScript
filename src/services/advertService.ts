import axios from "axios";
import { AdvertModel } from "../models/AdvertModel";
import { formPostConfig} from "../helpers/constants";
import { SearchResultModel } from "../models/SearchResultModel";
import { ImageModel } from "../models/ImageModel";
import { TryError } from "../helpers/common-methods";
const advertAPIUrl = process.env.REACT_APP_ADVERT_API_URL;
export const advertService = {
    getAll: () => TryError<AdvertModel[]>(()=> axios.get<AdvertModel[]>(advertAPIUrl + '/adverts')),
    getById:(id: number)=> TryError<AdvertModel>( () => axios.get<AdvertModel>(advertAPIUrl + `/get/${id}`)),
    getImages: (id: number)=> TryError<ImageModel[]>( ()=> axios.get<ImageModel[]>(advertAPIUrl + `/images/${id}`)),
    getByUserEmail: (email: string) => TryError<AdvertModel>( ()=> axios.get<AdvertModel>(advertAPIUrl + `/get?email=${email}`)),
    getByFilter: (filter: FormData) => TryError<SearchResultModel>( ()=> axios.post<SearchResultModel>(advertAPIUrl + `/findadverts`,filter,formPostConfig)),
    getFavByFilter: (filter: FormData) => TryError<SearchResultModel>( ()=> axios.post<SearchResultModel>(advertAPIUrl + `/favadverts`,filter,formPostConfig)),
    getUserAdverts: (filter: FormData) => TryError<SearchResultModel>( ()=> axios.post<SearchResultModel>(advertAPIUrl + `/useradverts`,filter,formPostConfig)),
    getByIDs: (ids: number[]) => TryError<AdvertModel[]>( ()=> axios.post<AdvertModel[]>(advertAPIUrl + `/adverts`,ids)),
    getRandomVip: (count: number)=> TryError<AdvertModel[]>( () => axios.get<AdvertModel[]>(advertAPIUrl + `/vip/${count}`)),
    create: (model: FormData) => TryError( ()=> axios.post(advertAPIUrl + `/create`,model,formPostConfig)),
    update: (model: FormData) => TryError( ()=> axios.put(advertAPIUrl + `/update`,model,formPostConfig)),
    delete: (id: number) => TryError( ()=> axios.delete(advertAPIUrl + `/delete/${id}`)),

}