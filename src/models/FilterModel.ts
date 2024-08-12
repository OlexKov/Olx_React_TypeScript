import { FilterData } from "./Models"

export interface SearchBaseModel{
    count?:number
    page?:number
    sortIndex?:number
}

export interface AdvertSearchModel extends SearchBaseModel {
    categoryId?: number
    isNew?: boolean
    isVip?: boolean
    isContractPrice?: boolean
    search?: string
    cityId?: number
    areaId?: number
    priceFrom?:number
    priceTo?:number
    filterValues:FilterData[]
    count?:number
    page?:number
    sortIndex?:number
}




