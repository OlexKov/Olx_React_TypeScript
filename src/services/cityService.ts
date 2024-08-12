import axios from "axios";
import { CityModel } from "../models/CityModel";
import { TryError } from "../helpers/common-methods";
const citiesAPIUrl = process.env.REACT_APP_CITIES_API_URL;
export const cityService = {

    getAll: () =>TryError<CityModel[]>(()=> axios.get<CityModel[]>(citiesAPIUrl + '/getcities')),
    getById: (id: number) =>TryError<CityModel>(()=> axios.get<CityModel>(citiesAPIUrl + `/getbyid/${id}`)),
    getByAreaId: (id: number) => TryError<CityModel[]>(()=>axios.get<CityModel[]>(citiesAPIUrl + `/getbyareaid/${id}`))
}