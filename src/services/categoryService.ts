import axios from "axios";
import { CategoryModel } from "../models/CategoryModel";
import { TryError } from "../helpers/common-methods";
const categoriesAPIUrl = process.env.REACT_APP_CATEGORIES_API_URL;
export const categoryService = {

    getAll: () =>TryError<CategoryModel[]>(()=>  axios.get<CategoryModel[]>( categoriesAPIUrl + '/getcategories')),
    getById:(id:number)=>TryError<CategoryModel>(()=> axios.get<CategoryModel>(categoriesAPIUrl + `/getbyid/${id}`))
}