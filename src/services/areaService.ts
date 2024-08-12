import axios from "axios";
import { AreaModel } from "../models/AreaModel";
import { TryError } from "../helpers/common-methods";
const areasAPIUrl = process.env.REACT_APP_AREAS_API_URL;
export const areaService = {

    getAll: () =>TryError<AreaModel[]>(()=> axios.get<AreaModel[]>(areasAPIUrl + '/getareas')),
    getById: (id: number) =>TryError<AreaModel>(()=> axios.get<AreaModel>(areasAPIUrl + `/getbyid/${id}`)),
    getByCityId: (id: number) =>TryError<AreaModel>(()=> axios.get<AreaModel>(areasAPIUrl + `/getbycityid/${id}`))
}